import React, { useState, useMemo } from 'react';
import { Student, ScoreItem, PillarType } from '../types';
import {
  X,
  CheckCircle2,
  Users,
  Search,
  Award,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BulkScoreModalProps {
  students: Student[];
  scoreItems: ScoreItem[];
  onClose: () => void;
  onApplyBulkScore: (
    studentIds: number[],
    item: ScoreItem,
    note: string
  ) => void;
  currentUserRole?: 'teacher' | 'monitor' | 'student';
}

export const BulkScoreModal: React.FC<BulkScoreModalProps> = ({
  students,
  scoreItems,
  onClose,
  onApplyBulkScore,
  currentUserRole = 'teacher'
}) => {
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedPillar, setSelectedPillar] = useState<PillarType>('discipline');
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [note, setNote] = useState('');

  // Filter items by pillar
  const availableItems = useMemo(() => {
    return scoreItems.filter((item) => item.pillar === selectedPillar);
  }, [selectedPillar, scoreItems]);

  const selectedItem = useMemo(() => {
    return scoreItems.find((item) => item.id === selectedItemId);
  }, [selectedItemId, scoreItems]);

  // Filter students based on search
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      return s.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [students, searchQuery]);

  const toggleStudent = (id: number) => {
    setSelectedStudentIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]); // Deselect all currently filtered
    } else {
      setSelectedStudentIds(filteredStudents.map(s => s.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || selectedStudentIds.length === 0) return;

    if (selectedItem.basePoints > 0) {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
      });
    }

    onApplyBulkScore(selectedStudentIds, selectedItem, note);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row h-[85vh]">
        
        {/* Left Side: Select Students */}
        <div className="w-full md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50 h-[40vh] md:h-full shrink-0">
          <div className="p-4 border-b border-slate-200 bg-white">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-indigo-600" />
              Chọn Học Sinh ({selectedStudentIds.length}/{students.length})
            </h3>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm tên..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-100 border-none rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button 
                onClick={toggleSelectAll}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1 rounded-md transition"
              >
                {selectedStudentIds.length === filteredStudents.length && filteredStudents.length > 0 
                  ? 'Bỏ chọn tất cả' 
                  : 'Chọn tất cả danh sách dưới'}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredStudents.map(s => (
              <label 
                key={s.id} 
                className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition border border-transparent ${
                  selectedStudentIds.includes(s.id) ? 'bg-indigo-50 border-indigo-200' : 'hover:bg-slate-100'
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={selectedStudentIds.includes(s.id)}
                  onChange={() => toggleStudent(s.id)}
                  className="w-4 h-4 text-indigo-600 rounded-sm"
                />
                <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-full bg-white shadow-sm" />
                <div className="flex-1">
                  <div className="text-sm font-bold text-slate-800">{s.name}</div>
                  <div className="text-[10px] text-slate-500">Tổ {Math.ceil(s.id / 12)}</div>
                </div>
              </label>
            ))}
            {filteredStudents.length === 0 && (
              <div className="text-center p-4 text-xs text-slate-500 italic">Không tìm thấy học sinh nào.</div>
            )}
          </div>
        </div>

        {/* Right Side: Score Action */}
        <div className="w-full md:w-1/2 flex flex-col h-[60vh] md:h-full bg-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition z-10"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="p-4 md:p-6 pb-2">
            <h3 className="font-bold text-slate-800 text-lg mb-1">Cộng / Trừ Điểm Đồng Loạt</h3>
            <p className="text-xs text-slate-500 mb-4">Sẽ áp dụng cho {selectedStudentIds.length} học sinh đang được chọn.</p>

            {/* Pillar */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                type="button"
                onClick={() => { setSelectedPillar('discipline'); setSelectedItemId(''); }}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
                  selectedPillar === 'discipline' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>Nề Nếp</span>
              </button>
              <button
                type="button"
                onClick={() => { setSelectedPillar('academic'); setSelectedItemId(''); }}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
                  selectedPillar === 'academic' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>Học Tập</span>
              </button>
              <button
                type="button"
                onClick={() => { setSelectedPillar('moral'); setSelectedItemId(''); }}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
                  selectedPillar === 'moral' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>Đạo Đức</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 md:px-6 space-y-1.5">
            {availableItems.map((item) => {
              const isSelected = selectedItemId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between gap-2 ${
                    isSelected ? 'border-indigo-600 bg-indigo-50/80 shadow-xs' : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800">{item.name}</div>
                  </div>
                  <div className={`font-black text-sm px-2 py-0.5 rounded-lg shrink-0 ${
                      item.basePoints > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {item.basePoints > 0 ? `+${item.basePoints}` : item.basePoints}đ
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="p-4 md:p-6 bg-slate-50 border-t border-slate-200 shrink-0">
            <div className="mb-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Ghi chú (Tùy chọn)</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Lý do chung..."
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                rows={2}
              />
            </div>
            <button
              type="submit"
              disabled={!selectedItem || selectedStudentIds.length === 0}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg disabled:opacity-50 transition flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{currentUserRole === 'teacher' ? `Áp dụng điểm cho ${selectedStudentIds.length} học sinh` : `Gửi đề xuất cho ${selectedStudentIds.length} học sinh`}</span>
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
