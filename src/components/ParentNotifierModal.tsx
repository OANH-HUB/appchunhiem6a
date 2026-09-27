import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { draftParentMessage } from '../services/geminiService';
import {
  X,
  Send,
  Sparkles,
  Copy,
  Check,
  Phone,
  Image as ImageIcon,
  CheckCircle2,
  MessageCircle,
  BellRing,
  Bot
} from 'lucide-react';

interface ParentNotifierModalProps {
  student: Student;
  defaultReason?: string;
  defaultPoints?: number;
  defaultEvidence?: string;
  onClose: () => void;
  onSendSuccess: () => void;
}

export const ParentNotifierModal: React.FC<ParentNotifierModalProps> = ({
  student,
  defaultReason = 'Tích cực tham gia xây dựng bài học và nề nếp tốt',
  defaultPoints = 5,
  defaultEvidence = 'Được giáo viên bộ môn ghi nhận trong sổ theo dõi',
  onClose,
  onSendSuccess,
}) => {
  const [reason, setReason] = useState(defaultReason);
  const [points, setPoints] = useState(defaultPoints);
  const [evidenceNote, setEvidenceNote] = useState(defaultEvidence);
  const [messageBody, setMessageBody] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Generate initial draft using AI
  useEffect(() => {
    const generateInitialMessage = async () => {
      setIsGenerating(true);
      const draft = await draftParentMessage({
        studentName: student.name,
        actionType: points >= 0 ? 'plus' : 'minus',
        points,
        reason,
        evidenceNote,
      });
      setMessageBody(draft);
      setIsGenerating(false);
    };

    generateInitialMessage();
  }, [student, points, reason, evidenceNote]);

  const handleCopy = () => {
    navigator.clipboard.writeText(messageBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendSimulated = () => {
    setSentSuccess(true);
    setTimeout(() => {
      onSendSuccess();
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <BellRing className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-xs text-indigo-200 font-medium">
                Cổng Kết Nối Phụ Huynh Lớp 6A
              </span>
              <h3 className="text-base font-bold">
                Gửi Thông Báo Kèm Minh Chứng Xác Thực
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Student & Parent Info Strip */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
            <div>
              <div className="text-slate-500">Học sinh:</div>
              <div className="font-bold text-slate-800 text-sm">{student.name} (Bàn #{student.id})</div>
            </div>
            <div className="text-right">
              <div className="text-slate-500">Phụ huynh nhận:</div>
              <div className="font-bold text-slate-800 flex items-center gap-1 justify-end">
                <span>{student.parentName}</span>
                <span className="font-mono text-indigo-600">({student.parentPhone})</span>
              </div>
            </div>
          </div>

          {/* Action details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Lý Do Thông Báo
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Điểm Thi Đua
              </label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* Evidence note */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
              Minh Chứng Đính Kèm (Bắt buộc theo quy chế)
            </label>
            <input
              type="text"
              value={evidenceNote}
              onChange={(e) => setEvidenceNote(e.target.value)}
              placeholder="VD: Biên bản nề nếp tuần 4; Phiếu bài kiểm tra Toán..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          {/* AI-Generated Message Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1">
                <Bot className="w-3.5 h-3.5 text-indigo-600" />
                Nội Dung Tin Nhắn (Zalo / SMS)
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Đã sao chép' : 'Sao chép tin nhắn'}</span>
              </button>
            </div>

            <div className="relative">
              <textarea
                rows={5}
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                disabled={isGenerating}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed"
              />
              {isGenerating && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-2xs rounded-2xl flex items-center justify-center text-xs font-semibold text-indigo-600">
                  <Sparkles className="w-4 h-4 mr-1.5 animate-spin" />
                  Trợ lý AI đang soạn tin nhắn sư phạm chuẩn mực...
                </div>
              )}
            </div>
          </div>

          {/* Send Success Toast */}
          {sentSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Đã phát thông báo Push & Tin nhắn Zalo thành công đến Phụ huynh!</span>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={handleSendSimulated}
              disabled={sentSuccess}
              className="flex-2 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition flex items-center justify-center space-x-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Gửi Thông Báo Tức Thời</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
