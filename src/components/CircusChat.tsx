import React, { useState, useRef, useEffect } from "react";
import { circusAudio } from "@/src/utils/audio";
import { useLanguage } from "@/src/context/LanguageContext";
import { 
  Bot, 
  Send, 
  Sparkles, 
  Trash2, 
  ArrowLeft, 
  Copy, 
  Check, 
  HelpCircle, 
  MessageSquare, 
  Lightbulb, 
  Compass,
  Bookmark,
  ExternalLink
} from "lucide-react";
import { CHATBOT_AI_URL } from "@/src/lib/constants";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  source?: "gemini" | "fallback";
}

interface CircusChatProps {
  onBack: () => void;
  onUnlockBadge?: (badgeId: string) => void;
}

const SAMPLE_QUESTIONS = [
  {
    label: "Lịch sử & Cụ Tạ Duy Hiển",
    labelEn: "History & Tạ Duy Hiển",
    prompt: "Xiếc Việt Nam ra đời năm nào và ai là người sáng lập gánh xiếc đầu tiên?",
    promptEn: "When was Vietnamese circus founded and who established the very first troupe?",
    icon: "📜",
  },
  {
    label: "Các rạp xiếc lớn 3 miền",
    labelEn: "Venues Across 3 Regions",
    prompt: "Có những rạp xiếc nào nổi tiếng ở Hà Nội và TP. Hồ Chí Minh? Địa chỉ ở đâu?",
    promptEn: "What are famous circus theaters in Hanoi and Ho Chi Minh City? Where are their locations?",
    icon: "📍",
  },
  {
    label: "Kỷ lục Quốc Cơ - Quốc Nghiệp",
    labelEn: "Quốc Cơ - Quốc Nghiệp Records",
    prompt: "Những kỷ lục Guinness thế giới phi thường của anh em Quốc Cơ - Quốc Nghiệp là gì?",
    promptEn: "What extraordinary Guinness World Records do brothers Quốc Cơ and Quốc Nghiệp hold?",
    icon: "🏆",
  },
  {
    label: "Nghệ thuật Xiếc Tre",
    labelEn: "Contemporary Bamboo Circus",
    prompt: "Xiếc tre đương đại Việt Nam như À Ố Show, Làng Tôi có điểm gì độc đáo khiến thế giới thán phục?",
    promptEn: "What makes Vietnamese contemporary bamboo circus like À Ố Show and Teh Dar so unique?",
    icon: "🎋",
  },
  {
    label: "Giá vé & Kinh nghiệm xem",
    labelEn: "Tickets & Best Seats",
    prompt: "Giá vé xem xiếc hiện nay khoảng bao nhiêu và nên chọn chỗ ngồi nào đẹp cho gia đình?",
    promptEn: "What is the typical circus ticket price and which seats provide the best view for families?",
    icon: "🎟️",
  },
  {
    label: "Xu hướng Xiếc Thú",
    labelEn: "Animal Welfare Transition",
    prompt: "Xiếc thú tại Việt Nam hiện nay đang chuyển dịch như thế nào để bảo vệ động vật hoang dã?",
    promptEn: "How is Vietnamese circus transitioning away from wild animals toward humane acrobatics?",
    icon: "🦁",
  },
];

const INITIAL_GREETING_VI: Message = {
  id: "welcome",
  role: "assistant",
  content: `🎪 **Chào mừng bạn đến với GÓC GIẢI ĐÁP RẠP XIẾC BỎ TÚI!**

Tôi là **Trợ Lý Rạp Xiếc Thông Minh (AI Circus Assistant)**. Bạn có thể hỏi tôi bất cứ điều gì về nghệ thuật xiếc Việt Nam và thế giới:

- 📜 **Lịch sử trăm năm**: Từ gánh xiếc cụ Tạ Duy Hiển (1921) đến những kỳ tích hiện đại.
- 📍 **Thông tin 6 rạp xiếc tiêu biểu**: Rạp Phú Thọ, Rạp Gia Định, Rạp Trung Ương Hà Nội, Nhà hát TP.HCM...
- 🤹 **Các bộ môn xiếc**: Đu bay, thăng bằng, uốn dẻo, ảo thuật, xiếc tre, xiếc hề...
- 🏆 **Kỷ lục thế giới**: Anh em NSƯT Quốc Cơ - Quốc Nghiệp, các giải thưởng Monte Carlo.
- 🎟️ **Kinh nghiệm xem xiếc**: Giá vé, lịch diễn, cách chọn vị trí ngồi đẹp cho trẻ em.

*Hãy gõ câu hỏi vào ô bên dưới hoặc bấm vào các gợi ý có sẵn để bắt đầu nhé!* ✨`,
  timestamp: "Vừa xong",
};

const INITIAL_GREETING_EN: Message = {
  id: "welcome",
  role: "assistant",
  content: `🎪 **Welcome to the POCKET CIRCUS KNOWLEDGE CORNER!**

I am your **AI Circus Assistant**. Feel free to ask me anything about Vietnamese and international circus arts:

- 📜 **100+ Years of History**: From Master Tạ Duy Hiển's first troupe (1921) to modern breakthroughs.
- 📍 **Key Venues & Theaters**: Phú Thọ Circus, Gia Định, Central Circus Hanoi, Saigon Opera House...
- 🤹 **Circus Disciplines**: Flying trapeze, balancing, contortion, magic, bamboo circus, clowning...
- 🏆 **World Guinness Records**: Giang Brothers (Quốc Cơ - Quốc Nghiệp), Monte Carlo honors.
- 🎟️ **Audience Tips**: Ticket pricing, schedules, and optimal seating for families.

*Type your question below or click any suggested prompt to begin!* ✨`,
  timestamp: "Just now",
};

export const CircusChat: React.FC<CircusChatProps> = ({ onBack, onUnlockBadge }) => {
  const { isEn } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([isEn ? INITIAL_GREETING_EN : INITIAL_GREETING_VI]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Update initial greeting if no chat has taken place
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === "welcome") {
      setMessages([isEn ? INITIAL_GREETING_EN : INITIAL_GREETING_VI]);
    }
  }, [isEn]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isLoading) return;

    circusAudio.playBambooStep();

    const userMessage: Message = {
      id: "user-" + Date.now(),
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString(isEn ? "en-US" : "vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputPrompt("");
    setIsLoading(true);

    if (onUnlockBadge) {
      onUnlockBadge("circus-scholar");
    }

    try {
      const historyPayload = newHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
          language: isEn ? "en" : "vi",
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const assistantMessage: Message = {
        id: "assistant-" + Date.now(),
        role: "assistant",
        content: data.reply || (isEn ? "I have received your question, what else would you like to explore?" : "Tôi đã nhận được câu hỏi, bạn muốn tìm hiểu thêm chi tiết nào nữa không?"),
        timestamp: new Date().toLocaleTimeString(isEn ? "en-US" : "vi-VN", { hour: "2-digit", minute: "2-digit" }),
        source: data.source,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      circusAudio.playBambooStep();
    } catch (err: any) {
      console.warn("Chat request error, providing local answer fallback", err);
      const fallbackMessage: Message = {
        id: "assistant-" + Date.now(),
        role: "assistant",
        content: isEn 
          ? `🎪 Thank you for asking about "${query}"!\n\nVietnam's circus art boasts over a century of heritage, highlighted by Master Tạ Duy Hiển (1921), prestigious global gold medals in France, Spain, and Monaco, and contemporary Bamboo Circus (À Ố Show).\n\nYou can explore more directly in the **History Timeline** or **Circus Map** section!`
          : `🎪 Cảm ơn câu hỏi của bạn về "${query}"!\n\nNghệ thuật xiếc Việt Nam qua hơn 100 năm phát triển đã ghi dấu ấn với gánh xiếc Cụ Tạ Duy Hiển (1921), những tấm huy chương vàng thế giới tại Pháp, Tây Ban Nha, Monaco và dòng xiếc tre đương đại độc đáo (À Ố Show).\n\nBạn có thể tra cứu thêm trực tiếp trên mục **Lịch Sử Xiếc** hoặc mục **Bản Đồ** để có thông tin địa chỉ 6 rạp xiếc lớn nhất ba miền nhé!`,
        timestamp: new Date().toLocaleTimeString(isEn ? "en-US" : "vi-VN", { hour: "2-digit", minute: "2-digit" }),
        source: "fallback",
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([isEn ? INITIAL_GREETING_EN : INITIAL_GREETING_VI]);
    circusAudio.playBambooStep();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Navigation & Identity */}
      <div className="bg-gradient-to-r from-red-850 via-red-900 to-amber-950 text-white rounded-3xl p-6 shadow-xl border-4 border-amber-400 relative overflow-hidden">
        {/* Circus Banner Deco */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 size-36 rounded-full bg-amber-400/10 blur-xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                circusAudio.playBambooStep();
                onBack();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-amber-200 hover:text-white transition-all text-xs font-bold border border-white/20 cursor-pointer shadow-xs active:scale-95 shrink-0"
              title={isEn ? "Back to Stage" : "Quay lại sân khấu"}
            >
              <ArrowLeft className="size-4" />
              <span>{isEn ? "Main Stage" : "Sân Khấu"}</span>
            </button>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] uppercase tracking-widest font-bold bg-amber-400 text-red-950 px-2.5 py-0.5 rounded-full shadow-xs">
                  {isEn ? "AI Assistant 24/7" : "AI Trợ Lý 24/7"}
                </span>
                <span className="text-xs text-amber-200/90 font-medium">
                  {isEn ? "Interactive culture & circus guide" : "Hỏi đáp thông minh như ChatGPT"}
                </span>
              </div>
              <h1 className="font-circus text-2xl sm:text-3xl text-amber-300 tracking-wide mt-1 drop-shadow-md flex items-center gap-2.5">
                <Bot className="size-7 text-amber-400 animate-pulse" />
                <span>{isEn ? "VIETNAM CIRCUS Q&A" : "GÓC GIẢI ĐÁP XIẾC VIỆT"}</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
            <a
              href="/chatbot"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-red-950 text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border border-amber-200"
              title={isEn ? "Open AI Chatbot" : "Mở Chatbot AI"}
            >
              <span>🤖</span>
              <span>{isEn ? "Chatbot AI" : "Mở Chatbot AI"}</span>
            </a>

            <button
              onClick={handleClearChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-800 text-amber-200 text-xs font-semibold border border-amber-400/30 hover:border-amber-400 transition-colors cursor-pointer"
              title={isEn ? "Reset and start fresh conversation" : "Xóa lịch sử và làm mới cuộc trò chuyện"}
            >
              <Trash2 className="size-3.5" />
              <span>{isEn ? "Reset" : "Làm Mới"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Questions Carousel / Chips */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-neutral-600 px-1">
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-900">
            <Lightbulb className="size-4 text-amber-600" />
            <span>{isEn ? "Quick Suggested Questions (Click to ask)" : "Gợi Ý Câu Hỏi Nhanh (Bấm để hỏi ngay)"}</span>
          </span>
          <span className="text-[11px] text-neutral-500 hidden sm:inline">
            {isEn ? "Ask about history, artists, techniques or venues" : "Hỏi về lịch sử, nghệ sĩ, kỹ thuật hoặc vé"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {SAMPLE_QUESTIONS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(isEn ? item.promptEn : item.prompt)}
              disabled={isLoading}
              className="p-3 text-left rounded-2xl bg-white hover:bg-amber-50/80 border-2 border-amber-200 hover:border-red-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between text-xs disabled:opacity-50"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
                <span className="font-bold text-neutral-800 line-clamp-1 group-hover:text-red-700">
                  {isEn ? item.labelEn : item.label}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 line-clamp-2 leading-tight">
                {isEn ? item.promptEn : item.prompt}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Conversation Window */}
      <div className="bg-white rounded-3xl border-2 border-amber-200 shadow-lg overflow-hidden flex flex-col min-h-[460px] max-h-[620px]">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-amber-50/20 via-white to-amber-50/30">
          {messages.map((message) => {
            const isUser = message.role === "user";
            return (
              <div
                key={message.id}
                className={`flex gap-3 max-w-[92%] sm:max-w-[85%] ${
                  isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* Avatar Icon */}
                <div
                  className={`size-9 sm:size-10 rounded-2xl flex items-center justify-center shrink-0 text-base shadow-xs ${
                    isUser
                      ? "bg-red-600 text-white font-bold"
                      : "bg-amber-400 text-red-950 border border-amber-300"
                  }`}
                >
                  {isUser ? "👤" : "🎪"}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl p-4 shadow-sm relative group ${
                    isUser
                      ? "bg-red-600 text-white rounded-tr-xs"
                      : "bg-amber-50/90 text-neutral-800 border border-amber-200/90 rounded-tl-xs"
                  }`}
                >
                  {/* Sender & Timestamp Header */}
                  <div
                    className={`flex items-center justify-between gap-3 text-[10px] mb-1.5 ${
                      isUser ? "text-red-100" : "text-neutral-500"
                    }`}
                  >
                    <span className="font-bold uppercase tracking-wider">
                      {isUser ? (isEn ? "You" : "Bạn") : (isEn ? "AI Circus Assistant" : "Trợ Lý Rạp Xiếc Bỏ Túi")}
                    </span>
                    <span className="opacity-80">{message.timestamp}</span>
                  </div>

                  {/* Body Content */}
                  <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                    {message.content}
                  </div>

                  {/* Copy Action Button (on assistant messages) */}
                  {!isUser && (
                    <div className="mt-2.5 pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-neutral-500">
                      <span className="text-[10px] text-amber-800 font-medium">
                        {isEn ? "✦ Verified Vietnamese Circus Archives" : "✦ Thông tin xác thực về Rạp Xiếc Việt Nam"}
                      </span>
                      <button
                        onClick={() => handleCopy(message.id, message.content)}
                        className="flex items-center gap-1 hover:text-red-700 transition-colors cursor-pointer px-2 py-0.5 rounded-md hover:bg-amber-100"
                        title={isEn ? "Copy message text" : "Sao chép nội dung câu trả lời"}
                      >
                        {copiedId === message.id ? (
                          <>
                            <Check className="size-3 text-emerald-600" />
                            <span className="text-emerald-700 font-semibold">{isEn ? "Copied" : "Đã chép"}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="size-3" />
                            <span>{isEn ? "Copy" : "Sao chép"}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing / Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 mr-auto max-w-[85%] animate-pulse">
              <div className="size-9 sm:size-10 rounded-2xl bg-amber-400 text-red-950 flex items-center justify-center shrink-0 text-base shadow-xs">
                🎪
              </div>
              <div className="rounded-2xl rounded-tl-xs p-4 bg-amber-50/90 border border-amber-200 text-neutral-700 flex items-center gap-2 text-xs sm:text-sm">
                <Sparkles className="size-4 text-amber-600 animate-spin" />
                <span className="font-medium">
                  {isEn
                    ? "Assistant is searching circus archives & thinking..."
                    : "Trợ lý đang suy nghĩ và lục tìm tư liệu xiếc..."}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-amber-200">
          <div className="flex items-end gap-2 bg-neutral-50 rounded-2xl border-2 border-amber-300 focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-100 p-2 transition-all">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isEn
                  ? "Ask about Vietnamese circus... (e.g. Who was the founding pioneer of Vietnam circus?)"
                  : "Nhập câu hỏi về xiếc Việt Nam... (ví dụ: Ai là ông tổ gánh xiếc Việt?)"
              }
              className="flex-1 max-h-32 bg-transparent resize-none border-none outline-none text-xs sm:text-sm text-neutral-800 placeholder:text-neutral-400 p-1.5 leading-relaxed"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputPrompt.trim() || isLoading}
              className={`size-10 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-xs ${
                inputPrompt.trim() && !isLoading
                  ? "bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white scale-105 active:scale-95"
                  : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              }`}
              title={isEn ? "Send inquiry (Enter)" : "Gửi câu hỏi (Enter)"}
            >
              <Send className="size-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-2 px-1">
            <span>
              {isEn ? (
                <>💡 Tip: Press <b>Enter</b> to send, <b>Shift + Enter</b> for new line</>
              ) : (
                <>💡 Mẹo: Nhấn <b>Enter</b> để gửi tin nhắn, <b>Shift + Enter</b> để xuống dòng</>
              )}
            </span>
            <span className="font-medium text-amber-800 hidden sm:inline">
              {isEn
                ? "Pocket Circus • Cultural AI Assistant"
                : "Rạp Xiếc Bỏ Túi • Trợ lý AI văn hóa nghệ thuật"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
