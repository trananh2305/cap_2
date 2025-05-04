import { askGPTWithMenu, cacheAnswer, fuzzySearchData, getAllRelevantKeywords, getCommonQuestionAnswer, getConversationHistory, getSimilarQuestion, saveConversation } from "../services/AiService";

interface GPTResponse {
    menu: Array<{
      _id: string;
      name: string;
      price: string;
    }>;
  }
  
  /**
   * 🤖 Tạo phản hồi từ AI
   * @param userId ID người dùng
   * @param message Tin nhắn của người dùng
   * @returns Phản hồi từ AI (có thể là chuỗi hoặc JSON)
   */
  export async function generateAIResponse(userId: string, message: string): Promise<string> {
    // Kiểm tra câu trả lời từ danh sách câu hỏi phổ biến
    const commonAnswer = getCommonQuestionAnswer(message);
    if (commonAnswer) return commonAnswer;
  
    // Kiểm tra cache trả lời từ Redis
    const cachedReply = await getSimilarQuestion(message);
    if (cachedReply) {
      console.log("✅ Lấy phản hồi từ Redis Cache");
      return cachedReply;
    }
  
    // Tổng hợp từ khóa từ nội dung câu hỏi
    const keywords = await getAllRelevantKeywords(message);
    console.log("🔍 Tổng hợp từ khóa:", keywords);
  
    let matchedItems: any[] = [];
    // Tìm kiếm dữ liệu món ăn từ các từ khóa
    for (const keyword of keywords) {
      const results = await fuzzySearchData(keyword);
      matchedItems.push(...results);
    }
  
    // Loại bỏ các món ăn trùng lặp
    matchedItems = matchedItems.filter((item, index, self) =>
      index === self.findIndex((t) => t._id.toString() === item._id.toString())
    );
  
    if (matchedItems.length === 0) {
      return "Xin lỗi, tôi không tìm thấy món ăn phù hợp trong menu.";
    }
  
    // Định dạng danh sách món ăn
    const formattedMenu = matchedItems.map((item) => {
      const _id = item._id.toString();
      const name = item.name || "Không tên";
      const description = item.description || "Không có mô tả";
      const category = item.category?.categoryName || "Không rõ";
      const price = item.price || "Không có giá";
      const imageUrl = item.imageUrl || "";
      return `${_id}. ${name} - ${description} (Phân loại: ${category}) - Giá: ${price} - Ảnh: ${imageUrl}`;
    }).join("\n");
  
    // Lấy lịch sử hội thoại
    const history = await getConversationHistory(userId);
    // Gọi OpenAI để lấy phản hồi
    const reply = await askGPTWithMenu(history, formattedMenu, message);
  
    if (!reply) throw new Error("OpenAI không trả về phản hồi hợp lệ.");
    console.log("🤖 OpenAI phản hồi:", reply);
  
    // Lưu hội thoại vào Redis
    await saveConversation(userId, "user", message);
    await saveConversation(userId, "assistant", typeof reply === 'string' ? reply : JSON.stringify(reply));

    // Cache kết quả vào Redis
    await cacheAnswer(message, reply);
  
    return typeof reply === 'object' ? JSON.stringify(reply) : reply;
  }