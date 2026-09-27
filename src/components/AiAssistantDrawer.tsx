import React, { useState, useRef, useEffect } from 'react';
import { Student, SecretLetter, FundTransaction } from '../types';
import { askAiAssistant } from '../services/geminiService';
import {
  Bot,
  X,
  Send,
  Sparkles,
  RefreshCw,
  MessageSquare,
  AlertTriangle,
  Lightbulb,
  Zap,
  CheckCircle2,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  letters: SecretLetter[];
  transactions: FundTransaction[];
  onExecuteCommand: (command: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  students,
  letters,
  transactions,
  onExecuteCommand,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Chào Cô Bế Thị Oanh! Tôi là **Trợ lý Số hóa Quản trị Lớp học Thông minh 6A** (Trường PTNT TH & THCS Đồng Tâm).

1. **Trạng thái hiện tại (Status):** Lớp 6A hiện diện 45/45 học sinh. Điểm trung bình thi đua tuần đạt ${(
        students.reduce((a, b) => a + b.totalPoints, 0) / students.length
      ).toFixed(1)}đ.
2. **Cập nhật thi đua (Action):** Hệ thống đang tự động theo dõi cấp số nhân cho các lỗi lặp lại và nhân đôi điểm thưởng tử tế.
3. **Cảnh báo & Đề xuất (Insight):** Có ${
        students.filter((s) => s.consecutiveDrops >= 3).length
      } học sinh (Lương Gia Bảo, Ma Văn Đức, Nông Văn Quyết) có điểm số sụt giảm 3 phiên liên tiếp. Đề nghị Cô Oanh lưu ý trò chuyện tâm lý.
4. **Tiện ích đi kèm (Add-ons):** "Hộp thư điều thầm kín" có ${
        letters.filter((l) => !l.isRead).length
      } bức thư mới về tâm tư tuổi dậy thì đang chờ Cô xem xét.
5. **Lệnh nhanh (Quick Commands):** [Mở Sơ đồ lớp] | [Xem bảng xếp hạng] | [Mở Hộp thư thầm kín] | [Xuất báo cáo PDF]`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    // Build real-time context payload
    const classContext = {
      totalStudents: students.length,
      averageScore: (
        students.reduce((sum, s) => sum + s.totalPoints, 0) / students.length
      ).toFixed(1),
      warningStudents: students
        .filter((s) => s.consecutiveDrops >= 3)
        .map((s) => ({
          name: s.name,
          id: s.id,
          points: s.totalPoints,
          drops: s.consecutiveDrops,
          infractions: s.recentInfractions,
          notes: s.notes,
        })),
      topStudents: [...students]
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .slice(0, 3)
        .map((s) => ({ name: s.name, points: s.totalPoints })),
      unreadLettersCount: letters.filter((l) => !l.isRead).length,
      recentLetters: letters.slice(0, 3).map((l) => ({
        title: l.title,
        category: l.category,
        sender: l.isAnonymous ? 'Ẩn danh' : l.senderName,
      })),
      fundBalance: transactions
        .reduce((sum, t) => sum + (t.type === 'thu' ? t.amount : -t.amount), 0),
    };

    const res = await askAiAssistant(text, classContext);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: res.reply,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const quickPrompts = [
    'Tóm tắt tình hình lớp 6A hôm nay',
    'Phân tích 3 học sinh có nguy cơ sụt giảm nề nếp',
    'Gợi ý danh sách trao huy hiệu điện tử tuần này',
    'Tư vấn cách phản hồi thư thầm kín của học sinh',
    'Soạn thông báo động viên gửi phụ huynh',
  ];

  // Helper to extract clickable quick commands [Lệnh] from AI text
  const renderMessageContent = (text: string) => {
    // Match commands like [Mở Sơ đồ lớp], [Xuất báo cáo PDF]
    const commandRegex = /\[(.*?)\]/g;
    const parts = text.split(commandRegex);

    return (
      <div className="space-y-1 text-xs leading-relaxed whitespace-pre-line font-sans">
        {text}
        {/* Render interactive quick command buttons if present in text */}
        {text.includes('[') && (
          <div className="mt-3 pt-2 border-t border-slate-200/60 flex flex-wrap gap-1.5">
            {Array.from(text.matchAll(commandRegex)).map((match, i) => {
              const cmd = match[1];
              return (
                <button
                  key={i}
                  onClick={() => onExecuteCommand(cmd)}
                  className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 rounded-lg text-[11px] font-bold border border-indigo-200 transition shadow-2xs flex items-center gap-1 active:scale-95"
                >
                  <Zap className="w-3 h-3" />
                  <span>{cmd}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition">
      <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/40 border border-white/20 flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5 animate-pulse text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-amber-300">
                  Chuyên Gia EdTech & Tâm Lý AI
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <h3 className="text-sm font-bold text-white">
                Trợ Lý Quản Trị Hệ Sinh Thái 6A
              </h3>
              <p className="text-[10px] text-indigo-200 italic">
                Đồng hành cùng Cô Bế Thị Oanh
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1 shrink-0">
            Hỏi nhanh:
          </span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-[11px] px-2.5 py-1 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-full border border-slate-200 whitespace-nowrap transition shadow-2xs font-medium"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isAi ? 'items-start' : 'items-end flex-row-reverse'}`}
              >
                {isAi && (
                  <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs ${
                    isAi
                      ? 'bg-slate-50 border border-slate-200 text-slate-900 rounded-tl-xs'
                      : 'bg-indigo-600 text-white rounded-br-xs'
                  }`}
                >
                  {isAi ? renderMessageContent(msg.text) : <div className="text-xs">{msg.text}</div>}
                  <div
                    className={`text-[9px] mt-1 text-right font-mono ${
                      isAi ? 'text-slate-400' : 'text-indigo-200'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs animate-spin">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-500 rounded-tl-xs flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
                <span>Trợ lý đang phân tích dữ liệu 45 học sinh lớp 6A...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Nhập câu hỏi hoặc yêu cầu cho Trợ lý AI..."
              className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-200 disabled:opacity-40 transition active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-[10px] text-center text-slate-600 mt-1.5 font-medium">
            "Quản trị bằng dữ liệu - Giáo dục bằng tình thương" • Powered by Gemini 3.8 Flash
          </div>
        </div>
      </div>
    </div>
  );
};
