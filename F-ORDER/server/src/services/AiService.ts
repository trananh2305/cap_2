import { OpenAI } from "openai";
import dotenv from "dotenv";
import Fuse from "fuse.js";
import redis from "../config/redis";
import { commonQuestions, stopWords } from "../libs/constant";
import { createSlug } from "../libs/slugify";
import getMenuItemsData from "../config/DataForAi";

// Interface định nghĩa cho cấu trúc câu hỏi phổ biến

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

interface CommonQuestion {
    question: string;
    answer: string;
  }
/**
 * Phân tích ngữ cảnh câu hỏi của người dùng để trích xuất từ khóa món ăn liên quan.
 * @param userMessage Câu hỏi của người dùng
 * @returns Một chuỗi từ khóa món ăn gợi ý
 */
export async function extractFoodContext(userMessage: string): Promise<string> {
  const prompt = `
Người dùng hỏi: "${userMessage}".
Bạn hãy phân tích xem người đó đang tìm món ăn theo tiêu chí gì (thời tiết, cảm xúc, dịp đặc biệt, loại món ăn...).
Hãy trả về từ khóa món ăn gợi ý phù hợp và gần đầy đủ nhất có thể. Ví dụ: "lẩu", "nướng", "súp", "kem", "tôm", "cua", "hàu", v.v.
Chỉ trả về từ khóa, không giải thích.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "Bạn là AI hiểu ngữ cảnh người dùng hỏi về món ăn",
      },
      { role: "user", content: prompt },
    ],
  });

  return response.choices[0].message.content?.trim() || "";
}

interface ChatMessage {
  role: "user" | "system" | "assistant";
  content: string | object;
}

interface MenuItem {
    _id: string;
    name: string;
    description?: string;
    price?: number;
    category?: {
      categoryName: string;
    };
  }

/**
 * Gửi đoạn hội thoại và danh sách món ăn vào GPT, nhận về kết quả món phù hợp ở dạng JSON.
 * @param history Lịch sử trò chuyện giữa người dùng và bot
 * @param formattedMenu Danh sách menu đã định dạng (chuỗi)
 * @param userMessage Câu hỏi hiện tại của người dùng
 * @returns Danh sách món gợi ý hoặc chuỗi nếu không parse được JSON
 */
export async function askGPTWithMenu(
  history: ChatMessage[],
  formattedMenu: string,
  userMessage: string
): Promise<{ menu: MenuItem[] } | string | null> {
  const systemPrompt = `
Bạn là chatbot chuyên tư vấn món ăn. 
Chỉ được sử dụng các món ăn có trong danh sách bên dưới.
Không được gợi ý món khác ngoài danh sách.

Trả lời duy nhất dưới dạng JSON hợp lệ. Không thêm giải thích. Không trả về văn bản không phải JSON.

Bắt buộc phải bao gồm cả câu dẫn trong trường "message" để giới thiệu các món ăn(AI có thể tự sáng tạo ra câu phù hợp).

Mẫu JSON:
{
  "message":"Đây là các món phù hợp bạn có thể thử:",
  "menu": [
    {
      "_id": "_id của món ăn",
      "name": "Tên món ăn",
      "price": "Giá tiền",
      "imageUrl":"link ảnh"
    }
  ]
}
`.trim();

  const safeHistory = history.map((msg) => ({
    role: msg.role,
    content: typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content),
  }));

  console.log("📜 Lịch sử hội thoại:", history);

  const messages = [
    {
      role: "system" as const,
      content: systemPrompt.trim(),
    },
    ...safeHistory,
    {
      role: "system" as const,
      content: `Dưới đây là danh sách món ăn phù hợp từ menu:\n${formattedMenu}`,
    },
    { role: "user" as const, content: userMessage },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
    });

    let messageContent = response.choices[0]?.message?.content?.trim();
    if (!messageContent) {
      console.warn("Không nhận được nội dung phản hồi từ OpenAI.");
      return null;
    }

    // Làm sạch chuỗi JSON nếu bị bao bởi ```
    if (messageContent.startsWith("```json") && messageContent.endsWith("```")) {
      messageContent = messageContent.slice(7, -3).trim();
    } else if (messageContent.startsWith("```") && messageContent.endsWith("```")) {
      messageContent = messageContent.slice(3, -3).trim();
    }

    try {
      const parsed = JSON.parse(messageContent);
      return parsed;
    } catch (err) {
      console.warn("Không parse được JSON sau khi làm sạch:", err);
      return messageContent;
    }
  } catch (error: any) {
    console.error("Lỗi khi gọi GPT với menu:", error.message || error);
    return null;
  }
}

const fuseCommon = new Fuse<CommonQuestion>(commonQuestions, {
    keys: ["question"],
    threshold: 0.5,
  });
  
  /**
   * 🔍 Trả lời từ danh sách câu hỏi phổ biến bằng Fuse.js
   * @param userQuestion Câu hỏi từ người dùng
   * @returns Trả lời nếu có kết quả phù hợp
   */
  export function getCommonQuestionAnswer(userQuestion: string): string | null {
    const result = fuseCommon.search(userQuestion);
    if (result.length > 0) {
      console.log("✅ Phản hồi từ danh sách câu hỏi phổ biến:", result[0].item.question);
      return result[0].item.answer;
    }
    return null;
  }
  
  /**
   * 📦 Lưu câu hỏi và câu trả lời vào Redis với key chuẩn hóa bằng slug
   * @param question Câu hỏi gốc
   * @param answer Câu trả lời (có thể là chuỗi hoặc object)
   */
  export async function cacheAnswer(question: string, answer: string | object): Promise<void> {
    const slug = `qa:${createSlug(question)}`;
    const valueToCache = typeof answer === "string" ? answer : JSON.stringify(answer);
    await redis.setex(slug, 86400, valueToCache); // Cache 24h
  }
  
  /**
   * 🔍 Tìm câu hỏi đã cache gần giống trong Redis thông qua slug
   * @param userQuestion Câu hỏi người dùng
   * @returns Câu trả lời đã cache nếu có
   */
  export async function getSimilarQuestion(userQuestion: string): Promise<string | null> {
    const slug = `qa:${createSlug(userQuestion)}`;
    const answer = await redis.get(slug);
    if (answer) {
      console.log("✅ Tìm thấy câu hỏi gần giống (slug):", slug);
      return answer;
    }
    return null;
  }

  // Định nghĩa kiểu role theo chuẩn OpenAI API
type Role = "user" | "system" | "assistant";

// Định nghĩa kiểu dữ liệu cho một message
interface Message {
  role: Role;
  content: string;
}

/**
 * 💾 Lưu một message vào lịch sử hội thoại Redis
 * @param userId ID người dùng
 * @param role Vai trò của message
 * @param content Nội dung message
 */
export async function saveConversation(userId: string, role: Role, content: string): Promise<void> {
  const message: Message = { role, content };
  await redis.lpush(`conversation:${userId}`, JSON.stringify(message));
  await redis.ltrim(`conversation:${userId}`, 0, 9); // Giới hạn 10 message gần nhất
}

/**
 * 📜 Lấy lịch sử hội thoại từ Redis
 * @param userId ID người dùng
 * @returns Danh sách message theo thứ tự thời gian
 */
export async function getConversationHistory(userId: string): Promise<Message[]> {
  const messages = await redis.lrange(`conversation:${userId}`, 0, -1);
  return messages.reverse().map((msg) => JSON.parse(msg) as Message);
}

/**
 * 🧠 Trích xuất từ khóa cơ bản từ chuỗi
 * @param text Văn bản gốc
 * @returns Danh sách từ khóa đã lọc stop words
 */
function extractKeywords(text: string): string[] {
    return text
      .toLowerCase()
      .split(" ")
      .filter((word) => !stopWords.includes(word));
  }
  
  /**
   * 🧩 Gộp từ khóa, loại bỏ trùng lặp và chuẩn hóa
   * @param sources Mảng các mảng từ khóa
   * @returns Danh sách từ khóa duy nhất
   */
  function mergeKeywords(...sources: string[][]): string[] {
    const seen = new Set<string>();
    return sources
      .flat()
      .map((k) => k.trim().toLowerCase())
      .filter((k) => k && !seen.has(k) && !!seen.add(k));
  }
  
  /**
   * 🧠 Kết hợp từ khóa từ ngữ cảnh AI và từ khóa cơ bản
   * @param message Tin nhắn người dùng
   * @returns Danh sách từ khóa phù hợp
   */
  export async function getAllRelevantKeywords(message: string): Promise<string[]> {
    const contextKeywordsRaw = await extractFoodContext(message);
    const contextKeywords = contextKeywordsRaw
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
  
    const basicKeywords = extractKeywords(message);
  
    return mergeKeywords(contextKeywords, basicKeywords);
  }

  
/**
 * 🔍 Tìm kiếm mờ (fuzzy search) trong dữ liệu menu
 * @param query Từ khóa tìm kiếm từ người dùng
 * @returns Danh sách món ăn phù hợp
 */
export async function fuzzySearchData(query: string): Promise<MenuItem[]> {
    const menuItems = await getMenuItemsData() as MenuItem[];
  
    const fuse = new Fuse(menuItems, {
      threshold: 0.5,
      keys: ["name", "description", "category.categoryName"],
    });
  
    return fuse.search(query).map((r) => r.item);
  }
