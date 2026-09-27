import React, { useState, useMemo } from 'react';
import { Student } from '../types';
import {
  Search,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  PlusCircle,
  MinusCircle,
  UserCheck,
  Send,
  Eye,
  SlidersHorizontal,
  Flame,
  Filter
} from 'lucide-react';

interface SeatingChartProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onOpenScoreModal: (student: Student, defaultType?: 'plus' | 'minus') => void;
  onOpenParentNotify: (student: Student) => void;
}

export const SeatingChart: React.FC<SeatingChartProps> = ({
  students,
  onSelectStudent,
  onOpenScoreModal,
  onOpenParentNotify,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all'); // all | warning | top | low | to1 | to2 | to3 | to4
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  // Filter students based on search and selected criteria
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toString() === searchTerm.trim() ||
        s.ethnic.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchSearch) return false;

      if (filterType === 'warning') return s.consecutiveDrops >= 3;
      if (filterType === 'top') return s.totalPoints >= 80;
      if (filterType === 'low') return s.totalPoints < 60;
      if (filterType === 'to1') return s.id <= 12;
      if (filterType === 'to2') return s.id > 12 && s.id <= 23;
      if (filterType === 'to3') return s.id > 23 && s.id <= 34;
      if (filterType === 'to4') return s.id > 34;
      return true;
    });
  }, [students, searchTerm, filterType]);

  // Group 45 students by rows (5 rows, each with 9 desks)
  const rows = [1, 2, 3, 4, 5];

  return (
    <div className="space-y-6">
      {/* Top Classroom Controls & Stats Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Sơ Đồ Lớp Học Tương Tác 6A</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                45 Bàn Học Sinh
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Chấm điểm thi đua nề nếp tức thời • Tự động áp dụng thuật toán cấp số nhân cho lỗi lặp lại
            </p>
          </div>

          {/* Quick Search & Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm tên, STT (1-45)..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center space-x-1 overflow-x-auto text-xs">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-xl font-medium transition ${
                  filterType === 'all'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tất cả (45)
              </button>
              <button
                onClick={() => setFilterType('warning')}
                className={`px-3 py-1.5 rounded-xl font-medium flex items-center space-x-1 transition ${
                  filterType === 'warning'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Cảnh báo sụt giảm</span>
              </button>
              <button
                onClick={() => setFilterType('top')}
                className={`px-3 py-1.5 rounded-xl font-medium transition ${
                  filterType === 'top'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                Top xuất sắc (&gt;80đ)
              </button>
              <button
                onClick={() => setFilterType('low')}
                className={`px-3 py-1.5 rounded-xl font-medium transition ${
                  filterType === 'low'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                }`}
              >
                Cần cố gắng (&lt;60đ)
              </button>
            </div>
          </div>
        </div>

        {/* Algorithm Legend Indicator */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <span className="font-semibold text-slate-800 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
            Cơ chế trọng số:
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
            <Flame className="w-3 h-3 text-rose-600" />
            Lỗi lặp lại trong tuần: Phạt cấp số nhân (x2, x4, x8)
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Award className="w-3 h-3 text-emerald-600" />
            Hành động tử tế: Nhân đôi thưởng (+10đ thay vì +5đ)
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Điểm xu hướng giảm 3 phiên: Kích hoạt cảnh báo sư phạm
          </span>
        </div>
      </div>

      {/* Classroom Layout with Podium and Desks */}
      <div className="bg-slate-100/80 p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-inner relative overflow-hidden">
        {/* Front of Class: Teacher's Podium & Chalkboard */}
        <div className="max-w-xl mx-auto mb-8 bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-800 text-emerald-50 rounded-2xl p-4 shadow-md text-center border-2 border-emerald-700/50 relative">
          <div className="flex items-center justify-between px-3">
            <span className="text-[11px] font-mono text-emerald-300">CỬA LỚP HỌC</span>
            <div className="flex flex-col items-center">
              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-300">
                BẢNG LỚP HỌC & BÀN GIÁO VIÊN
              </span>
              <span className="text-xs text-emerald-200">
                GVCN: Cô Bế Thị Oanh • Trường PTNT TH & THCS Đồng Tâm
              </span>
            </div>
            <div className="flex items-center space-x-1 text-[11px] bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-600/30">
              <UserCheck className="w-3 h-3 text-emerald-400" />
              <span>Sĩ số: 45/45</span>
            </div>
          </div>
          <div className="w-32 h-1 bg-amber-400/80 mx-auto mt-2 rounded-full"></div>
        </div>

        {/* 5 Rows of Desks (9 Desks per Row, arranged in 3 Blocks of 3 columns for realistic aisles) */}
        <div className="space-y-5">
          {rows.map((rowNum) => {
            const rowStudents = students.filter((s) => s.seatRow === rowNum);
            return (
              <div key={rowNum} className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 px-2">
                  <span>HÀNG GHẾ THỨ {rowNum}</span>
                  <span className="text-slate-500 font-normal">
                    {rowStudents.length} học sinh (Bàn {rowNum * 9 - 8} - Bàn {rowNum * 9})
                  </span>
                </div>

                {/* 3 blocks with aisles */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Block 1: Desks 1, 2, 3 */}
                  <div className="grid grid-cols-3 gap-2 bg-white/60 p-2 rounded-2xl border border-slate-200/60">
                    {rowStudents
                      .filter((s) => s.seatCol >= 1 && s.seatCol <= 3)
                      .map((student) => (
                        <DeskCard
                          key={student.id}
                          student={student}
                          isSelected={selectedSeat === student.id}
                          onSelect={() => setSelectedSeat(student.id)}
                          onViewProfile={() => onSelectStudent(student)}
                          onOpenScoreModal={onOpenScoreModal}
                          onOpenParentNotify={onOpenParentNotify}
                          isHighlighted={
                            filteredStudents.some((fs) => fs.id === student.id)
                          }
                        />
                      ))}
                  </div>

                  {/* Block 2: Desks 4, 5, 6 */}
                  <div className="grid grid-cols-3 gap-2 bg-white/60 p-2 rounded-2xl border border-slate-200/60">
                    {rowStudents
                      .filter((s) => s.seatCol >= 4 && s.seatCol <= 6)
                      .map((student) => (
                        <DeskCard
                          key={student.id}
                          student={student}
                          isSelected={selectedSeat === student.id}
                          onSelect={() => setSelectedSeat(student.id)}
                          onViewProfile={() => onSelectStudent(student)}
                          onOpenScoreModal={onOpenScoreModal}
                          onOpenParentNotify={onOpenParentNotify}
                          isHighlighted={
                            filteredStudents.some((fs) => fs.id === student.id)
                          }
                        />
                      ))}
                  </div>

                  {/* Block 3: Desks 7, 8, 9 */}
                  <div className="grid grid-cols-3 gap-2 bg-white/60 p-2 rounded-2xl border border-slate-200/60">
                    {rowStudents
                      .filter((s) => s.seatCol >= 7 && s.seatCol <= 9)
                      .map((student) => (
                        <DeskCard
                          key={student.id}
                          student={student}
                          isSelected={selectedSeat === student.id}
                          onSelect={() => setSelectedSeat(student.id)}
                          onViewProfile={() => onSelectStudent(student)}
                          onOpenScoreModal={onOpenScoreModal}
                          onOpenParentNotify={onOpenParentNotify}
                          isHighlighted={
                            filteredStudents.some((fs) => fs.id === student.id)
                          }
                        />
                      ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Back of Class Marker */}
        <div className="mt-8 text-center text-xs text-slate-600 font-medium">
          <span className="px-4 py-1 bg-white/80 border border-slate-200 rounded-full shadow-xs">
            Cuối lớp • Tủ sách & Khu vực vệ sinh dụng cụ nề nếp 6A
          </span>
        </div>
      </div>
    </div>
  );
};

interface DeskCardProps {
  student: Student;
  isSelected: boolean;
  onSelect: () => void;
  onViewProfile: () => void;
  onOpenScoreModal: (student: Student, defaultType?: 'plus' | 'minus') => void;
  onOpenParentNotify: (student: Student) => void;
  isHighlighted: boolean;
}

const DeskCard: React.FC<DeskCardProps> = ({
  student,
  isSelected,
  onSelect,
  onViewProfile,
  onOpenScoreModal,
  onOpenParentNotify,
  isHighlighted,
}) => {
  const hasWarning = student.consecutiveDrops >= 3;
  const infractionCount = Object.values(student.recentInfractions).reduce((a, b) => a + b, 0);

  // Score color based on total points
  const getScoreColor = (points: number) => {
    if (points >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (points >= 60) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (points >= 50) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-xl p-2.5 transition-all duration-200 cursor-pointer ${
        hasWarning
          ? 'bg-rose-50/90 border-2 border-rose-300 shadow-xs'
          : isSelected
          ? 'bg-indigo-50 border-2 border-indigo-500 shadow-md ring-2 ring-indigo-200'
          : 'bg-white border border-slate-200/80 hover:border-indigo-300 hover:shadow-md'
      } ${!isHighlighted ? 'opacity-30' : 'opacity-100'}`}
    >
      {/* Top Row: STT Badge & Warning Icon */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center border border-slate-200">
          {student.id}
        </span>

        <div className="flex items-center space-x-1">
          {hasWarning && (
            <span
              title="Cảnh báo: Điểm sụt giảm 3 phiên liên tiếp!"
              className="flex items-center text-rose-600 bg-rose-100 px-1 py-0.5 rounded-sm text-[10px] font-bold animate-pulse"
            >
              <AlertTriangle className="w-3 h-3 mr-0.5" /> 3🔻
            </span>
          )}

          {student.trend === 'up' && (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          )}
          {student.trend === 'down' && !hasWarning && (
            <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
          )}
          {student.trend === 'stable' && (
            <Minus className="w-3.5 h-3.5 text-slate-400" />
          )}
        </div>
      </div>

      {/* Avatar & Student Name */}
      <div className="flex items-center space-x-2">
        <img
          src={student.avatar}
          alt={student.name}
          className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold text-slate-800 truncate" title={student.name}>
            {student.name}
          </div>
          <div className="text-[10px] text-slate-600 truncate flex items-center gap-1">
            <span>Dân tộc {student.ethnic}</span>
          </div>
        </div>
      </div>

      {/* Points & Sub-scores */}
      <div className="mt-2 flex items-center justify-between">
        <div
          className={`px-2 py-0.5 rounded-lg border text-xs font-black ${getScoreColor(
            student.totalPoints
          )}`}
        >
          {student.totalPoints}đ
        </div>

        <div className="flex items-center space-x-1 text-[10px] text-slate-600 font-mono">
          <span title="Điểm nề nếp" className="text-blue-700">N:{student.disciplinePoints}</span>
          <span>•</span>
          <span title="Điểm học tập" className="text-emerald-700">H:{student.academicPoints}</span>
        </div>
      </div>

      {/* Multiplier Alert Indicator if has repeated infraction */}
      {infractionCount > 0 && (
        <div className="mt-1.5 text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded-sm font-semibold truncate flex items-center gap-0.5">
          <Flame className="w-2.5 h-2.5 text-amber-700" />
          <span>Có lỗi lặp lại (Áp dụng x2)</span>
        </div>
      )}

      {/* Hover Action Drawer for Fast Teacher Interaction */}
      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenScoreModal(student, 'plus');
          }}
          title="Cộng điểm thi đua"
          className="flex-1 py-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 rounded-md text-[11px] font-bold flex items-center justify-center transition"
        >
          <PlusCircle className="w-3 h-3 mr-0.5" /> +
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenScoreModal(student, 'minus');
          }}
          title="Trừ điểm nề nếp / lỗi"
          className="flex-1 py-1 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 rounded-md text-[11px] font-bold flex items-center justify-center transition"
        >
          <MinusCircle className="w-3 h-3 mr-0.5" /> -
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewProfile();
          }}
          title="Xem hồ sơ chi tiết"
          className="px-1.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] transition"
        >
          <Eye className="w-3 h-3" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenParentNotify(student);
          }}
          title="Gửi tin nhắn phụ huynh"
          className="px-1.5 py-1 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 rounded-md text-[11px] transition"
        >
          <Send className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
