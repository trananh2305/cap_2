import { useUserInfo } from "@/hook/auth";
import { socket } from "@/provider/SocketProvider";
import { addToBox } from "@/redux/slices/chatBoxSlice";
import { RootState } from "@/redux/store";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ChatBoxUi = ({
  setIsOpenChatBox,
}: {
  setIsOpenChatBox: (value: boolean) => void;
}) => {
  const [input, setInput] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const dispatch = useDispatch();

  const messages = useSelector((state: RootState) => {
    const message = state.chatbox;
    return message;
  });

  const { _id } = useUserInfo();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const hanleSendMessage = () => {
    if (input) {
      dispatch(
        addToBox({ id: crypto.randomUUID(), message: input, role: "user" })
      );

      socket.emit("user_message", {
        user: _id,
        message: input,
      });

      setIsWaiting(true);
      setInput("");
    }
  };

  function isValidJSON(str: string): boolean {
    try {
      const parsed = JSON.parse(str);
      return typeof parsed === "object" && parsed !== null;
    } catch {
      return false;
    }
  }

  useEffect(() => {
    socket.on("ai_reply", (data) => {
      console.log("data", data);
      let messageToDispatch: string | [] = data.message;
      let mesDescription = "";

      if (isValidJSON(data.message)) {
        const dataAi = JSON.parse(data.message);

        messageToDispatch = dataAi.menu;
        if (dataAi.message) mesDescription = dataAi.message;
      }
      if (mesDescription) {
        dispatch(
          addToBox({
            id: crypto.randomUUID(),
            message: mesDescription,
            role: "chat",
          })
        );
      }
      dispatch(
        addToBox({
          id: crypto.randomUUID(),
          message: messageToDispatch,
          role: "chat",
        })
      );
      setIsWaiting(false);
    });

    return () => {
      socket.off("ai_reply");
    };
  }, []);



  return (
    <div className="w-full h-screen bg-white shadow-lg rounded-t-lg  fixed bottom-0 right-0 z-[9999] flex flex-col border border-gray-300 sm:w-[370px] sm:h-[450px]">
      {/* Header */}
      <div className="bg-primary-100 text-white py-4 flex items-center px-4 font-semibold sm:rounded-t-lg justify-between ">
        <span>Hộp trò chuyện</span>
        <button onClick={() => setIsOpenChatBox(false)}>
          <X />
        </button>
      </div>

      {/* Tin nhắn */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-3"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {messages.map((mes) => (
          <div
            key={mes.id}
            className={`flex ${
              mes.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {typeof mes.message === "string" ? (
              <div
                className={`px-4 py-2 rounded-xl max-w-[70%] text-sm ${
                  mes.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                {mes.message}
              </div>
            ) : (
              <div className="px-4 py-2 rounded-xl max-w-[70%] text-sm flex flex-wrap gap-3">
                {(mes.message || []).map((mes) => (
                  <Link
                    key={mes._id}
                    to={`/menu/${mes._id}`}
                    className="flex gap-4 border-2 p-1 rounded-lg shadow-sm sm:flex-col"
                  >
                    <img
                      src={mes.imageUrl || "https://placehold.co/600x400"}
                      alt=""
                      className=" sm:size-full size-[13vw]"
                    />
                    <div className=" gap-2 flex flex-col sm:items-center justify-center lg:w-full  ">
                      <span className="font-bold lg:w-fit">{mes.name}</span>
                      <span>
                        {Number(mes.price).toLocaleString("vi-VN")} VNĐ
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        ))}
        {isWaiting && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-xl max-w-[70%] text-sm flex gap-1 animate-pulse">
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-2 border-t flex items-center">
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          className="flex-1 px-3 py-2 border rounded-lg outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              hanleSendMessage();
            }
          }}
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={hanleSendMessage}
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatBoxUi;
