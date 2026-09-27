import React, { useState, useMemo } from 'react';
import { Student, ScoreItem, PillarType } from '../types';
import {
  X,
  PlusCircle,
  MinusCircle,
  AlertCircle,
  Flame,
  Award,
  Upload,
  CheckCircle2,
  FileText,
  Send,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScoreActionModalProps {
  student: Student;
  defaultType?: 'plus' | 'minus';
  scoreItems: ScoreItem[];
  onClose: () => void;
  onApplyScore: (
    studentId: number,
    item: ScoreItem,
    calculatedPoints: number,
    multiplierReason: string | undefined,
    note: string,
    evidenceUrl?: string,
    notifyParent?: boolean
  ) => void;
  currentUserRole?: 'teacher' | 'monitor' | 'student';
}

export const ScoreActionModal: React.FC<ScoreActionModalProps> = ({
  student,
  defaultType = 'plus',
  scoreItems,
  onClose,
  onApplyScore,
  currentUserRole = 'teacher',
}) => {
  const [selectedPillar, setSelectedPillar] = useState<PillarType>(
    defaultType === 'minus' ? 'discipline' : 'academic'
  );
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [note, setNote] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [notifyParent, setNotifyParent] = useState(true);

  // Filter items by pillar
  const availableItems = useMemo(() => {
    return scoreItems.filter((item) => item.pillar === selectedPillar);
  }, [selectedPillar, scoreItems]);

  // Selected item object
  const selectedItem = useMemo(() => {
    return scoreItems.find((item) => item.id === selectedItemId);
  }, [selectedItemId, scoreItems]);

  // Calculate flexible weighting
  const calculation = useMemo(() => {
    if (!selectedItem) {
      return { finalPoints: 0, reason: undefined, multiplier: 1 };
    }

    // Kindness bonus check
    if (selectedItem.isKindnessBonus && selectedItem.basePoints > 0) {
      return {
        finalPoints: selectedItem.basePoints * 2,
        reason: 'Hành động tử tế đột xuất (Nhân đôi x2)',
        multiplier: 2,
      };
    }

    // Repeated infraction check for penalties
    if (selectedItem.basePoints < 0) {
      const priorCount = student.recentInfractions[selectedItem.name] || 0;
      const currentOccurrence = priorCount + 1;
      if (currentOccurrence > 1) {
        const factor = Math.pow(2, currentOccurrence - 1);
        return {
          finalPoints: selectedItem.basePoints * factor,
          reason: `Lỗi lặp lại lần thứ ${currentOccurrence} trong tuần (Cấp số nhân x${factor})`,
          multiplier: factor,
        };
      }
    }

    return {
      finalPoints: selectedItem.basePoints,
      reason: undefined,
      multiplier: 1,
    };
  }, [selectedItem, student]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    if (calculation.finalPoints > 0) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }

    onApplyScore(
      student.id,
      selectedItem,
      calculation.finalPoints,
      calculation.reason,
      note,
      evidenceUrl,
      notifyParent
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-white/80 shadow-xs"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-mono">
                  STT #{student.id}
                </span>
                <span className="text-xs text-indigo-100">Lớp 6A</span>
              </div>
              <h3 className="text-base font-bold">{student.name}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Pillar Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Chọn Trụ Cột Đánh Giá
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedPillar('discipline');
                  setSelectedItemId('');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  selectedPillar === 'discipline'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>Nề Nếp</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedPillar('academic');
                  setSelectedItemId('');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  selectedPillar === 'academic'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>Học Tập</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedPillar('moral');
                  setSelectedItemId('');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  selectedPillar === 'moral'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>Đạo Đức - Kỹ Năng</span>
              </button>
            </div>
          </div>

          {/* Action List Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Hành Vi / Thành Tích Ghi Nhận
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {availableItems.map((item) => {
                const isSelected = selectedItemId === item.id;
                const isRepeat =
                  item.basePoints < 0 && (student.recentInfractions[item.name] || 0) > 0;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItemId(item.id)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 shadow-xs'
                        : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        {item.name}
                        {item.isKindnessBonus && (
                          <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-sm text-[10px] font-bold">
                            Tử tế x2
                          </span>
                        )}
                        {isRepeat && (
                          <span className="px-1.5 py-0.2 bg-rose-100 text-rose-800 rounded-sm text-[10px] font-bold flex items-center gap-0.5">
                            <Flame className="w-2.5 h-2.5" /> Lặp lại
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {item.description}
                      </div>
                    </div>
                    <div
                      className={`font-black text-sm px-2 py-0.5 rounded-lg ${
                        item.basePoints > 0
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {item.basePoints > 0 ? `+${item.basePoints}` : item.basePoints}đ
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Flexible Weighting Calculation Banner */}
          {selectedItem && (
            <div
              className={`p-3 rounded-2xl border text-xs ${
                calculation.finalPoints > 0
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  {calculation.finalPoints > 0 ? (
                    <Award className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Flame className="w-4 h-4 text-rose-600" />
                  )}
                  Điểm Áp Dụng Thực Tế:
                </span>
                <span className="text-base font-black">
                  {calculation.finalPoints > 0
                    ? `+${calculation.finalPoints}`
                    : calculation.finalPoints}đ
                </span>
              </div>
              {calculation.reason && (
                <div className="mt-1 text-[11px] font-medium opacity-90 flex items-center gap-1">
                  <span>⚡ Thuật toán: {calculation.reason}</span>
                </div>
              )}
            </div>
          )}

          {/* Evidence & Note Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Minh Chứng / Ghi Chú Của Cô Oanh
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Nhặt được ví tiền ở sân trường nộp lại; hoặc: Quên khăn quàng giờ chào cờ thứ 2..."
              rows={2}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
          </div>

          {/* Evidence URL / Sample Attachment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Ảnh Minh Chứng (Nếu có)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                placeholder="Dán link ảnh hoặc chọn ảnh mẫu..."
                className="flex-1 text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
              <button
                type="button"
                onClick={() =>
                  setEvidenceUrl(
                    'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80'
                  )
                }
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Ảnh mẫu</span>
              </button>
            </div>
          </div>

          {/* Notify Parent Toggle */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Send className="w-4 h-4 text-indigo-600" />
              <div>
                <div className="text-xs font-bold text-slate-800">
                  Gửi thông báo tức thời cho Phụ huynh
                </div>
                <div className="text-[11px] text-slate-500">
                  PH: {student.parentName} ({student.parentPhone})
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifyParent}
              onChange={(e) => setNotifyParent(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded-sm focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              disabled={!selectedItem}
              className="flex-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 disabled:opacity-50 transition flex items-center justify-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{currentUserRole === 'teacher' ? 'Xác Nhận Lưu Vào Hệ Sinh Thái' : 'Gửi Đề Xuất Điểm'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
