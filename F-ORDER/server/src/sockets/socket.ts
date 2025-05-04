import { Server, Socket } from "socket.io";
import dotenv from "dotenv";
import { generateAIResponse } from "../controllers/AiController";

dotenv.config();

interface ConnectedUsers {
  [socketId: string]: string;
}
// Định nghĩa kiểu cho dữ liệu nhận từ client
interface UserMessageData {
  user: string;
  message: string;
}

// Định nghĩa kiểu cho phản hồi từ server (client nhận)
interface AIReplyData {
  user: string;
  message: string;
}

let io: Server | null = null; // Biến io toàn cục

export function setupSocket(server: any): void {
  io = new Server(server, {
    cors: {
      origin: [process.env.URL_CLIENT || "http://localhost:5173"], // Chỉ định CORS
      methods: ["GET", "POST"],
    },
  });

  console.log("🛠 Socket.io initialized!");

  const connectedUsers: ConnectedUsers = {};

  io.on("connection", (socket: Socket) => {
    console.log(`🔌 User connected: ${socket.id}`);
    

    setTimeout(() => {
      if (io) {
        io.emit("testEvent", { message: "Hello from server!" });
        console.log("📡 Test event emitted!");
      }
    }, 5000);

    connectedUsers[socket.id] = socket.id;
    socket.on("user_message", async (data: UserMessageData) => {
      console.log(`📩 Nhận tin nhắn từ ${data.user}:`, data.message);
  
      try {
        // Gọi hàm AI để lấy phản hồi
        const reply = await generateAIResponse(data.user, data.message);
  
        // Gửi phản hồi về client
        socket.emit("ai_reply", {
          user: "AI",
          message: reply || "Xin lỗi, tôi không hiểu.",
        } as AIReplyData);
      } catch (error) {
        console.error("❌ Lỗi AI:", error instanceof Error ? error.message : "Unknown error");
        socket.emit("ai_reply", {
          user: "AI",
          message: "Xin lỗi, hệ thống đang gặp lỗi!",
        } as AIReplyData);
      }
    });

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
      delete connectedUsers[socket.id];
    });
  });
}

// ✅ Hàm lấy instance của io, đảm bảo không bị undefined
export function getIo(): Server {
  if (!io) {
    throw new Error("Socket.io chưa được khởi tạo! Hãy gọi setupSocket(server) trước.");
  }
  return io;
}
