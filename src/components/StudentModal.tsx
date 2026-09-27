import React, { useState } from 'react';
import { Student, ScoreHistoryEntry } from '../types';
import { DIGITAL_BADGES } from '../data/mockData';
import { analyzeStudentPsychology } from '../services/geminiService';
import {
  X,
  Phone,
  MapPin,
  Calendar,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  Bot,
  PlusCircle,
  MinusCircle,
  Send,
  Sparkles,
  ShieldCheck,
  History,
  FileCheck2
} from 'lucide-react';

interface StudentModalProps {
  student: Student;
  historyEntries: ScoreHistoryEntry[];
  onClose: () => void;
  onOpenScoreModal: (student: Student, defaultType?: 'plus' | 'minus') => void;
  onOpenParentNotify: (student: Student) => void;
  onToggleBadge: (studentId: number, badgeId: string) => void;
  onUndoScore?: (historyId: string) => void;
  currentUserRole?: 'teacher' | 'monitor' | 'student';
}

export const StudentModal: React.FC<StudentModalProps> = ({
  student,
  historyEntries,
  onClose,
  onOpenScoreModal,
  onOpenParentNotify,
  onToggleBadge,
  onUndoScore,
  currentUserRole = 'teacher',
}) => {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const studentHistory = historyEntries.filter((h) => h.studentId === student.id);
  const hasWarning = student.consecutiveDrops >= 3;

  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await analyzeStudentPsychology(student, studentHistory);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header Profile Cover */}
        <div className="bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-20 h-20 rounded-2xl object-cover border-4 border-white/80 shadow-md"
            />
            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
                  Bàn #{student.id} (Hàng {student.seatRow} - Cột {student.seatCol})
                </span>
                <span className="bg-indigo-900/60 text-indigo-100 text-xs px-2.5 py-0.5 rounded-full">
                  Dân tộc {student.ethnic}
                </span>
                <span className="bg-emerald-500/80 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                  {student.gender}
                </span>
              </div>
              <h2 className="text-2xl font-black mt-1.5">{student.name}</h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-xs text-indigo-100">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Sinh: {student.dob}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {student.address}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Warning Banner if >= 3 consecutive drops */}
          {hasWarning && (
            <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-start space-x-3 text-rose-900">
              <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5 animate-bounce" />
              <div>
                <h4 className="font-bold text-sm">
                  CẢNH BÁO SỤT GIẢM 3 PHIÊN LIÊN TIẾP TỪ THUẬT TOÁN
                </h4>
                <p className="text-xs mt-1 text-rose-800 leading-relaxed">
                  Học sinh có biểu đồ điểm số sụt giảm liên tục trong 3 tuần/phiên gần nhất.
                  Đề xuất Cô Oanh kiểm tra lại "Hộp thư điều thầm kín", gặp gỡ riêng sau giờ học
                  nội trú hoặc liên hệ ngay với phụ huynh ({student.parentName} - {student.parentPhone}).
                </p>
              </div>
            </div>
          )}

          {/* Quick Score Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl">
              <span className="text-[11px] font-bold text-indigo-600 uppercase">Tổng Điểm Thi Đua</span>
              <div className="text-2xl font-black text-indigo-900 mt-1">{student.totalPoints}đ</div>
              <span className="text-[10px] text-indigo-700 font-semibold flex items-center justify-center gap-0.5 mt-0.5">
                {student.trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-600" />}
                {student.trend === 'down' && <TrendingDown className="w-3 h-3 text-rose-600" />}
                {student.trend === 'stable' && <Minus className="w-3 h-3 text-slate-400" />}
                Xu hướng {student.trend === 'up' ? 'Tăng' : student.trend === 'down' ? 'Giảm' : 'Ổn định'}
              </span>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl">
              <span className="text-[11px] font-bold text-blue-600 uppercase">Điểm Nề Nếp</span>
              <div className="text-2xl font-black text-blue-900 mt-1">{student.disciplinePoints}đ</div>
              <span className="text-[10px] text-blue-600">Đồng phục, chuyên cần</span>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <span className="text-[11px] font-bold text-emerald-600 uppercase">Điểm Học Tập</span>
              <div className="text-2xl font-black text-emerald-900 mt-1">{student.academicPoints}đ</div>
              <span className="text-[10px] text-emerald-600">Phát biểu, điểm 10</span>
            </div>

            <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl">
              <span className="text-[11px] font-bold text-purple-600 uppercase">Đạo Đức & Kỹ Năng</span>
              <div className="text-2xl font-black text-purple-900 mt-1">{student.moralPoints}đ</div>
              <span className="text-[10px] text-purple-600">Tử tế, trung thực</span>
            </div>
          </div>

          {/* 5-Week Trend Visual Sparkline */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Biểu Đồ Tiến Trình 5 Tuần Gần Nhất
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {student.weeklyTrendPoints.join('đ ➔ ')}đ
              </span>
            </div>
            {/* Visual Bar representation */}
            <div className="flex items-end space-x-3 h-20 pt-2">
              {student.weeklyTrendPoints.map((pts, idx) => {
                const max = 100;
                const heightPercent = Math.max(15, Math.min(100, (pts / max) * 100));
                const isLatest = idx === student.weeklyTrendPoints.length - 1;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <span className="text-[10px] font-bold text-slate-600">{pts}</span>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-lg transition-all ${
                        isLatest
                          ? hasWarning
                            ? 'bg-rose-500'
                            : 'bg-indigo-600'
                          : 'bg-indigo-200'
                      }`}
                    ></div>
                    <span className="text-[10px] text-slate-500">T{idx + 1}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Pedagogical Advisor Card */}
          <div className="p-4 bg-gradient-to-br from-indigo-50/70 via-purple-50/60 to-pink-50/60 border border-indigo-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Trợ Lý Tâm Lý Sư Phạm AI Lớp 6
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Phân tích tâm sinh lý tuổi dậy thì & Đề xuất cách tương tác cho Cô Oanh
                  </p>
                </div>
              </div>

              <button
                onClick={handleRunAiAnalysis}
                disabled={isAnalyzing}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center space-x-1 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAnalyzing ? 'Đang phân tích...' : 'Phân Tích Bằng AI'}</span>
              </button>
            </div>

            {aiAnalysis ? (
              <div className="p-3 bg-white/90 rounded-xl border border-indigo-100 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {aiAnalysis}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Bấm nút "Phân Tích Bằng AI" để hệ thống tổng hợp dữ liệu điểm số, lỗi lặp lại và đặc điểm tâm lý tuổi 11-12 của em {student.name}.
              </p>
            )}
          </div>

          {/* Digital Badges Section */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              Huy Hiệu Điện Tử (Digital Badges)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DIGITAL_BADGES.map((badge) => {
                const isEarned = student.badges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    onClick={() => onToggleBadge(student.id, badge.id)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-center space-x-2 ${
                      isEarned
                        ? 'bg-amber-50/80 border-amber-300 text-amber-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 font-bold bg-gradient-to-tr ${badge.color}`}
                    >
                      ★
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold truncate">{badge.title}</div>
                      <div className="text-[10px] text-slate-500">
                        {isEarned ? 'Đã đạt' : 'Chưa đạt'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Parent Contact Information */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase">Liên Hệ Phụ Huynh</span>
              <div className="text-sm font-bold text-slate-800 mt-0.5">
                {student.parentName}
              </div>
              <div className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-mono">{student.parentPhone}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenParentNotify(student);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Soạn Tin Nhắn Cho Phụ Huynh</span>
            </button>
          </div>

          {/* Historical Activity Log */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <History className="w-4 h-4 text-slate-500" />
              Nhật Ký Thi Đua Gần Đây
            </h4>
            {studentHistory.length === 0 ? (
              <p className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-xl">
                Chưa có sự kiện nào được ghi nhận gần đây cho học sinh này.
              </p>
            ) : (
              <div className="space-y-2">
                {studentHistory.map((h) => (
                  <div
                    key={h.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-start justify-between gap-2"
                  >
                    <div>
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        {h.actionName}
                        {h.multiplierReason && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-800 font-semibold">
                            {h.multiplierReason}
                          </span>
                        )}
                      </div>
                      {h.note && (
                        <div className="text-slate-600 text-[11px] mt-0.5 italic">
                          "{h.note}"
                        </div>
                      )}
                      <div className="text-[10px] text-slate-400 mt-1">
                        {new Date(h.timestamp).toLocaleString('vi-VN')}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div
                        className={`font-black text-sm px-2 py-0.5 rounded-lg ${
                          h.calculatedPoints > 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {h.calculatedPoints > 0 ? `+${h.calculatedPoints}` : h.calculatedPoints}đ
                      </div>
                      {currentUserRole === 'teacher' && onUndoScore && (
                        <button
                          onClick={() => onUndoScore(h.id)}
                          className="ml-2 p-1 text-slate-400 hover:text-rose-500 transition rounded-full hover:bg-rose-50"
                          title="Hoàn tác (Xóa lịch sử này và hoàn lại điểm)"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between gap-3">
          {currentUserRole !== 'student' && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenScoreModal(student, 'plus');
                }}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center space-x-1"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{currentUserRole === 'teacher' ? 'Cộng Điểm' : 'Đề Xuất Cộng'}</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenScoreModal(student, 'minus');
                }}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center space-x-1"
              >
                <MinusCircle className="w-4 h-4" />
                <span>{currentUserRole === 'teacher' ? 'Trừ Điểm' : 'Đề Xuất Trừ'}</span>
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
