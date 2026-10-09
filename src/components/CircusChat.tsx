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
import { getPredefinedAnswer } from "@/src/services/predefinedAnswers";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Icon } from "@/src/components/Icon";
import { OFFICIAL_CIRCUS_LOGO } from "@/src/lib/logo";

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
    label: "Xiếc đương đại vs truyền thống",
    labelEn: "Traditional vs Contemporary",
    prompt: "Sự khác biệt giữa xiếc truyền thống và xiếc đương đại?",
    promptEn: "What is the difference between traditional and contemporary circus?",
    icon: "bi bi-person-arms-up",
  },
  {
    label: "Kỹ thuật khó & Tiết mục hay",
    labelEn: "Technique & Show Quality",
    prompt: "Kỹ thuật khó có quyết định một tiết mục hay hay không?",
    promptEn: "Does difficult technique determine whether a performance is good?",
    icon: "bi bi-bullseye",
  },
  {
    label: "Ảnh hưởng văn hóa xiếc",
    labelEn: "Cultural Influences",
    prompt: "Xiếc Việt Nam chịu ảnh hưởng từ những nền văn hóa nào?",
    promptEn: "Which cultures have influenced Vietnamese circus?",
    icon: "bi bi-globe-americas",
  },
  {
    label: "Nguồn gốc nghệ thuật xiếc",
    labelEn: "Origin of Circus",
    prompt: "Xiếc bắt đầu từ khi nào",
    promptEn: "When did circus art begin?",
    icon: "🎪",
  },
  {
    label: "Giai đoạn phát triển xiếc",
    labelEn: "Development Stages",
    prompt: "Từng giai đoạn phát triển trong xiếc Việt Nam",
    promptEn: "What are the developmental stages of Vietnamese circus?",
    icon: "bi bi-file-earmark-text",
  },
  {
    label: "Trở thành diễn viên xiếc",
    labelEn: "Circus Artist Training",
    prompt: "Mất bao lâu để trở thành diễn viên xiếc đương đại",
    promptEn: "How long does it take to become a contemporary circus artist?",
    icon: "bi bi-stopwatch",
  },
  {
    label: "Khó khăn & Thách thức",
    labelEn: "Artist Challenges",
    prompt: "Khó khăn và thách thức nhất của một diễn viên xiếc?",
    promptEn: "What are the biggest challenges faced by a circus performer?",
    icon: "bi bi-lightning-charge",
  },
  {
    label: "Yếu tố quyết định xiếc",
    labelEn: "Crucial Performance Factors",
    prompt: "Yếu tố quyết định của một màn trình diễn xiếc đương đại",
    promptEn: "What factors determine a contemporary circus performance?",
    icon: "bi bi-stars",
  },
  {
    label: "Địa điểm biểu diễn & Mua vé",
    labelEn: "Venues & Tickets",
    prompt: "Các đoàn xiếc Việt Nam thường biểu diễn ở đâu?",
    promptEn: "Where do Vietnamese circus troupes usually perform?",
    icon: "bi bi-geo-alt",
  },
  {
    label: "Vì sao không còn xiếc thú?",
    labelEn: "Why No Circus Animals?",
    prompt: "Vì sao ngày nay nhiều chương trình xiếc không còn sử dụng động vật",
    promptEn: "Why do modern circus shows no longer use animals?",
    icon: "bi bi-universal-access",
  },
  {
    label: "Độ tuổi & Khán giả phù hợp",
    labelEn: "Target Audience & Age",
    prompt: "Xiếc phù hợp với tệp khán giả nào?",
    promptEn: "Which audience age group is circus suitable for?",
    icon: "bi bi-people",
  },
  {
    label: "Đạo cụ truyền thống phổ biến",
    labelEn: "Traditional Circus Props",
    prompt: "Có những đạo cụ truyền thống nào phổ biến trong xiếc?",
    promptEn: "What are the common traditional props in circus?",
    icon: "bi bi-tree",
  },
  {
    label: "Xiếc đương đại là gì?",
    labelEn: "What is Contemporary Circus?",
    prompt: "Thông tin về xiếc đương đại Việt Nam",
    promptEn: "Information about Vietnamese contemporary circus",
    icon: "🎪",
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

const streamTextGradually = (
  fullText: string,
  onChunk: (chunkText: string) => void,
  signal?: AbortSignal,
  chunkSize?: number,
  intervalMs = 18
): Promise<void> => {
  return new Promise((resolve) => {
    let currentIndex = 0;
    // Tốc độ hiện chữ vừa phải, tự nhiên, không quá nhanh và không gây sốt ruột cho người đọc
    const computedChunk = chunkSize ?? Math.max(6, Math.min(22, Math.ceil(fullText.length / 55)));
    const intervalId = setInterval(() => {
      if (signal?.aborted) {
        clearInterval(intervalId);
        resolve();
        return;
      }
      currentIndex = Math.min(currentIndex + computedChunk, fullText.length);
      onChunk(fullText.slice(0, currentIndex));
      if (currentIndex >= fullText.length) {
        clearInterval(intervalId);
        resolve();
      }
    }, intervalMs);
  });
};

export const CircusChat: React.FC<CircusChatProps> = ({ onBack, onUnlockBadge }) => {
  const { isEn } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([isEn ? INITIAL_GREETING_EN : INITIAL_GREETING_VI]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

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
  }, [messages, isLoading, isStreaming]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isLoading || isStreaming) return;

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

    const abort = new AbortController();
    abortControllerRef.current = abort;

    const assistantPlaceholderId = "assistant-" + Date.now();
    const assistantMessage: Message = {
      id: assistantPlaceholderId,
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString(isEn ? "en-US" : "vi-VN", { hour: "2-digit", minute: "2-digit" }),
      source: "gemini",
    };

    // Predefined exact answers for circus queries
    const predefined = getPredefinedAnswer(query, isEn ? 'en' : 'vi');
    if (predefined) {
      setTimeout(async () => {
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
        setIsStreaming(true);
        setStreamingMessageId(assistantPlaceholderId);

        await streamTextGradually(
          predefined.answer,
          (chunk) => {
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantPlaceholderId ? { ...m, content: chunk } : m))
            );
          },
          abort.signal
        );

        setIsStreaming(false);
        setStreamingMessageId(null);
        abortControllerRef.current = null;
        circusAudio.playBambooStep();
      }, 250);
      return;
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
      const targetContent = data.reply || (isEn ? "I have received your question, what else would you like to explore?" : "Tôi đã nhận được câu hỏi, bạn muốn tìm hiểu thêm chi tiết nào nữa không?");

      setMessages((prev) => [...prev, { ...assistantMessage, source: data.source }]);
      setIsLoading(false);
      setIsStreaming(true);
      setStreamingMessageId(assistantPlaceholderId);

      await streamTextGradually(
        targetContent,
        (chunk) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantPlaceholderId ? { ...m, content: chunk } : m))
          );
        },
        abort.signal
      );

      setIsStreaming(false);
      setStreamingMessageId(null);
      abortControllerRef.current = null;
      circusAudio.playBambooStep();
    } catch (err: any) {
      console.warn("Chat request error, providing local answer fallback", err);
      const fallbackText = isEn 
        ? `🎪 Thank you for asking about "${query}"!\n\nVietnam's circus art boasts over a century of heritage, highlighted by Master Tạ Duy Hiển (1921), prestigious global gold medals in France, Spain, and Monaco, and contemporary Bamboo Circus (À Ố Show).\n\nYou can explore more directly in the **History Timeline** or **Circus Map** section!`
        : `🎪 Cảm ơn câu hỏi của bạn về "${query}"!\n\nNghệ thuật xiếc Việt Nam qua hơn 100 năm phát triển đã ghi dấu ấn với gánh xiếc Cụ Tạ Duy Hiển (1921), những tấm huy chương vàng thế giới tại Pháp, Tây Ban Nha, Monaco và dòng xiếc tre đương đại độc đáo (À Ố Show).\n\nBạn có thể tra cứu thêm trực tiếp trên mục **Lịch Sử Xiếc** hoặc mục **Bản Đồ** để có thông tin địa chỉ 6 rạp xiếc lớn nhất ba miền nhé!`;

      setMessages((prev) => [...prev, { ...assistantMessage, source: "fallback" }]);
      setIsLoading(false);
      setIsStreaming(true);
      setStreamingMessageId(assistantPlaceholderId);

      await streamTextGradually(
        fallbackText,
        (chunk) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantPlaceholderId ? { ...m, content: chunk } : m))
          );
        },
        abort.signal
      );

      setIsStreaming(false);
      setStreamingMessageId(null);
      abortControllerRef.current = null;
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      setStreamingMessageId(null);
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
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setIsStreaming(false);
    setStreamingMessageId(null);
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

            <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-amber-950/80 p-0.5 border-2 border-amber-400 overflow-hidden shrink-0 shadow-md">
                <img
                  src={OFFICIAL_CIRCUS_LOGO}
                  alt="Logo Rạp Xiếc Bỏ Túi"
                  className="size-full rounded-xl object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] uppercase tracking-widest font-bold bg-amber-400 text-red-950 px-2.5 py-0.5 rounded-full shadow-xs">
                    {isEn ? "AI Assistant 24/7" : "Tư vấn viên AI 24/7"}
                  </span>
                  <span className="text-xs text-amber-200/90 font-medium">
                    {isEn ? "Interactive culture & circus guide" : "Hỏi đáp thông minh về nghệ thuật xiếc"}
                  </span>
                </div>
                <h1 className="font-circus text-2xl sm:text-3xl text-amber-300 tracking-wide mt-1 drop-shadow-md">
                  {isEn ? "AI CIRCUS CONSULTANT" : "TƯ VẤN VIÊN AI"}
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
            <a
              href="/chatbot"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-red-950 text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border border-amber-200"
              title={isEn ? "Open AI Chatbot" : "Mở Chatbot AI"}
            >
              <span><Icon name="bi bi-robot" /></span>
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
                  className={`size-9 sm:size-10 rounded-2xl flex items-center justify-center shrink-0 text-base shadow-xs overflow-hidden ${
                    isUser
                      ? "bg-red-600 text-white font-bold"
                      : "bg-amber-950/90 border-2 border-amber-400 p-0.5"
                  }`}
                >
                  {isUser ? (
                    <Icon name="bi bi-person" />
                  ) : (
                    <img
                      src={OFFICIAL_CIRCUS_LOGO}
                      alt="AI"
                      className="size-full rounded-xl object-cover"
                    />
                  )}
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
                      {isUser ? (isEn ? "You" : "Bạn") : (isEn ? "AI Circus Assistant" : "Tư vấn viên AI")}
                    </span>
                    <span className="opacity-80">{message.timestamp}</span>
                  </div>

                  {/* Body Content */}
                  <div className="text-xs sm:text-sm leading-relaxed font-sans">
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      <>
                        <Markdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p({ children }) {
                              return <p className="mb-2.5 last:mb-0 leading-relaxed whitespace-pre-line">{children}</p>;
                            },
                            a({ href, children }) {
                              return (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-semibold text-red-700 underline decoration-amber-400 hover:text-red-900 transition-colors break-all"
                                >
                                  {children}
                                </a>
                              );
                            },
                            strong({ children }) {
                              return <strong className="font-bold text-neutral-900">{children}</strong>;
                            },
                            ul({ children }) {
                              return <ul className="list-disc pl-4 space-y-1 mb-2.5">{children}</ul>;
                            },
                            li({ children }) {
                              return <li className="leading-relaxed">{children}</li>;
                            },
                          }}
                        >
                          {message.content}
                        </Markdown>
                        {isStreaming && message.id === streamingMessageId && (
                          <span className="inline-block h-3.5 w-1.5 animate-pulse rounded-full bg-amber-500 ml-1 align-middle" />
                        )}
                      </>
                    )}
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
              <div className="size-9 sm:size-10 rounded-2xl bg-amber-950/90 border-2 border-amber-400 p-0.5 overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                <img
                  src={OFFICIAL_CIRCUS_LOGO}
                  alt="AI Thinking"
                  className="size-full rounded-xl object-cover"
                />
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

        {/* Input Bar with horizontal suggestion pills */}
        <div className="p-3 sm:p-4 bg-white border-t border-amber-200">
          {/* Horizontal Suggested Questions Row */}
          <div className="mb-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-transparent">
            <span className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-amber-900 pr-1 uppercase tracking-wider">
              <Sparkles className="size-3.5 text-amber-600" />
              <span className="hidden sm:inline">{isEn ? "Suggestions:" : "Gợi ý:"}</span>
            </span>
            {SAMPLE_QUESTIONS.map((item, idx) => {
              const label = isEn ? item.labelEn : item.label;
              const promptText = isEn ? item.promptEn : item.prompt;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(promptText)}
                  disabled={isLoading}
                  title={promptText}
                  className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50/80 hover:bg-amber-400 hover:border-amber-500 px-3 py-1 text-xs font-semibold text-amber-950 transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <span className="text-xs group-hover:scale-110 transition-transform">
                    <Icon name={item.icon} />
                  </span>
                  <span className="whitespace-nowrap tracking-tight">{label}</span>
                </button>
              );
            })}
          </div>

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
