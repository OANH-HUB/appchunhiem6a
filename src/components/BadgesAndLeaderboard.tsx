import React, { useState, useMemo } from 'react';
import { Student, DigitalBadge } from '../types';
import { DIGITAL_BADGES } from '../data/mockData';
import {
  Trophy,
  Award,
  Crown,
  Sparkles,
  TrendingDown,
  AlertTriangle,
  Medal,
  CheckCircle2,
  Send,
  Eye,
  PlusCircle,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BadgesAndLeaderboardProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onOpenScoreModal: (student: Student, defaultType?: 'plus' | 'minus') => void;
  onOpenParentNotify: (student: Student) => void;
  onAwardBadge: (studentId: number, badgeId: string) => void;
}

export const BadgesAndLeaderboard: React.FC<BadgesAndLeaderboardProps> = ({
  students,
  onSelectStudent,
  onOpenScoreModal,
  onOpenParentNotify,
  onAwardBadge,
}) => {
  const [rankingPillar, setRankingPillar] = useState<'total' | 'discipline' | 'academic' | 'moral'>('total');

  // Sort students according to selected pillar
  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => {
      if (rankingPillar === 'discipline') return b.disciplinePoints - a.disciplinePoints;
      if (rankingPillar === 'academic') return b.academicPoints - a.academicPoints;
      if (rankingPillar === 'moral') return b.moralPoints - a.moralPoints;
      return b.totalPoints - a.totalPoints;
    });
  }, [students, rankingPillar]);

  // Students with 3-drop warning
  const warningStudents = useMemo(() => {
    return students.filter((s) => s.consecutiveDrops >= 3);
  }, [students]);

  // Compute Badge suggestions automatically
  const badgeSuggestions = useMemo(() => {
    return DIGITAL_BADGES.map((badge) => {
      let qualifyingStudents: Student[] = [];
      if (badge.id === 'chuyen-can') {
        qualifyingStudents = students.filter(
          (s) => s.disciplinePoints >= 24 && Object.keys(s.recentInfractions).length === 0
        );
      } else if (badge.id === 'hoa-diem-10') {
        qualifyingStudents = students.filter((s) => s.academicPoints >= 30);
      } else if (badge.id === 'ban-tot-viec-hay') {
        qualifyingStudents = students.filter((s) => s.moralPoints >= 26);
      } else if (badge.id === 'vua-tien-bo') {
        qualifyingStudents = students.filter((s) => s.trend === 'up' && s.totalPoints >= 75);
      } else if (badge.id === 'sao-trung-thuc') {
        qualifyingStudents = students.filter((s) => s.id === 5 || s.badges.includes(badge.id));
      } else {
        qualifyingStudents = students.slice(0, 5);
      }

      return {
        badge,
        candidates: qualifyingStudents,
      };
    });
  }, [students]);

  const handleCelebrate = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleAwardAllSuggested = () => {
    handleCelebrate();
    badgeSuggestions.forEach(({ badge, candidates }) => {
      candidates.forEach((student) => {
        if (!student.badges.includes(badge.id)) {
          onAwardBadge(student.id, badge.id);
        }
      });
    });
  };

  const top1 = sortedStudents[0];
  const top2 = sortedStudents[1];
  const top3 = sortedStudents[2];

  // Group Leaderboard
  const groupStats = useMemo(() => {
    const groups = [
      { id: 1, name: 'Tổ 1', students: [] as Student[], totalPoints: 0 },
      { id: 2, name: 'Tổ 2', students: [] as Student[], totalPoints: 0 },
      { id: 3, name: 'Tổ 3', students: [] as Student[], totalPoints: 0 },
      { id: 4, name: 'Tổ 4', students: [] as Student[], totalPoints: 0 },
    ];

    students.forEach(s => {
      let groupIndex = 0;
      if (s.id <= 12) groupIndex = 0;
      else if (s.id <= 23) groupIndex = 1;
      else if (s.id <= 34) groupIndex = 2;
      else groupIndex = 3;

      groups[groupIndex].students.push(s);
      groups[groupIndex].totalPoints += s.totalPoints;
    });

    return groups.sort((a, b) => b.totalPoints - a.totalPoints);
  }, [students]);

  return (
    <div className="space-y-8">
      {/* Early Warning Alert Section (Crucial requirement from prompt) */}
      {warningStudents.length > 0 && (
        <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 border-2 border-rose-300 rounded-3xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-200">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-rose-950 flex items-center gap-2">
                  <span>Cảnh Báo Sớm: {warningStudents.length} Học Sinh Giảm Điểm 3 Phiên Liên Tiếp</span>
                </h3>
                <p className="text-xs text-rose-700 mt-0.5">
                  Thuật toán phát hiện sự sụt giảm nề nếp/học tập • Đề xuất can thiệp sư phạm và thắt chặt kết nối gia đình
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {warningStudents.map((student) => (
              <div
                key={student.id}
                className="bg-white p-3.5 rounded-2xl border border-rose-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-9 h-9 rounded-full object-cover border border-rose-200"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {student.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          STT #{student.id} • Dân tộc {student.ethnic}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                      {student.totalPoints}đ (3🔻)
                    </span>
                  </div>

                  <p className="text-[11px] text-rose-700 mt-2 line-clamp-2 bg-rose-50/60 p-2 rounded-lg">
                    {student.notes}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                  <button
                    onClick={() => onSelectStudent(student)}
                    className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Hồ Sơ</span>
                  </button>
                  <button
                    onClick={() => onOpenParentNotify(student)}
                    className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[11px] font-bold shadow-xs transition flex items-center justify-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Báo PH</span>
                  </button>
                  <button
                    onClick={() => onOpenScoreModal(student, 'plus')}
                    className="py-1.5 px-2 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 rounded-xl text-[11px] font-bold transition"
                    title="Khích lệ điểm cộng"
                  >
                    + Khích lệ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top 3 Podium Ceremony */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/10">
            <Trophy className="w-3.5 h-3.5" />
            <span>BẢNG VÀNG THI ĐUA LỚP 6A • TUẦN NÀY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Vinh Danh Ngôi Sao Dẫn Đầu
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200">
            Biểu dương tinh thần học tập, nề nếp và đạo đức xuất sắc của các bạn học sinh
          </p>
        </div>

        {/* 3 Pedestals */}
        <div className="relative z-10 mt-8 grid grid-cols-3 gap-2 sm:gap-4 items-end max-w-2xl mx-auto">
          {/* Rank 2 (Silver) */}
          {top2 && (
            <div
              onClick={() => onSelectStudent(top2)}
              className="cursor-pointer bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-4 text-center transition transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full p-1 bg-gradient-to-tr from-slate-300 to-slate-100 shadow-md">
                <img
                  src={top2.avatar}
                  alt={top2.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-slate-800 text-xs font-black my-1.5 shadow-sm">
                2
              </div>
              <h4 className="text-xs sm:text-sm font-bold truncate">{top2.name}</h4>
              <div className="text-xs sm:text-sm font-black text-amber-300 mt-0.5">
                {top2.totalPoints}đ
              </div>
              <div className="text-[10px] text-indigo-200 truncate">Hạng Nhì Lớp</div>
            </div>
          )}

          {/* Rank 1 (Gold) */}
          {top1 && (
            <div
              onClick={() => onSelectStudent(top1)}
              className="cursor-pointer bg-white/20 hover:bg-white/30 backdrop-blur-lg border-2 border-amber-300 rounded-3xl p-4 sm:p-6 text-center transition transform hover:-translate-y-2 shadow-2xl relative"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Crown className="w-8 h-8 text-amber-400 drop-shadow-md animate-bounce" />
              </div>
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full p-1.5 bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 shadow-lg mt-1">
                <img
                  src={top1.avatar}
                  alt={top1.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-amber-950 text-sm font-black my-1.5 shadow-md">
                1
              </div>
              <h4 className="text-sm sm:text-base font-extrabold truncate text-white">
                {top1.name}
              </h4>
              <div className="text-base sm:text-lg font-black text-amber-300 mt-0.5">
                {top1.totalPoints}đ
              </div>
              <div className="text-xs text-amber-200 font-bold uppercase tracking-wider">
                Thủ Khoa 6A
              </div>
            </div>
          )}

          {/* Rank 3 (Bronze) */}
          {top3 && (
            <div
              onClick={() => onSelectStudent(top3)}
              className="cursor-pointer bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-4 text-center transition transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full p-1 bg-gradient-to-tr from-amber-700 to-orange-400 shadow-md">
                <img
                  src={top3.avatar}
                  alt={top3.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-black my-1.5 shadow-sm">
                3
              </div>
              <h4 className="text-xs sm:text-sm font-bold truncate">{top3.name}</h4>
              <div className="text-xs sm:text-sm font-black text-amber-300 mt-0.5">
                {top3.totalPoints}đ
              </div>
              <div className="text-[10px] text-indigo-200 truncate">Hạng Ba Lớp</div>
            </div>
          )}
        </div>

        {/* Confetti Trigger */}
        <div className="text-center mt-6 relative z-10">
          <button
            onClick={handleCelebrate}
            className="px-5 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-amber-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition active:scale-95 inline-flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Bắn Pháo Hoa Tuyên Dương Cả Lớp 6A 🎉</span>
          </button>
        </div>
      </div>

      {/* Group Leaderboard */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-indigo-600" />
            <span>Bảng Xếp Hạng Theo Tổ</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Tổng điểm thi đua của tất cả thành viên trong mỗi tổ
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {groupStats.map((group, index) => (
            <div key={group.id} className="relative bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col items-center overflow-hidden">
              {index === 0 && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-400 to-transparent flex items-start justify-end p-2 opacity-50">
                  <Crown className="w-6 h-6 text-amber-600" />
                </div>
              )}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-black mb-3 ${
                index === 0 ? 'bg-amber-100 text-amber-700' :
                index === 1 ? 'bg-slate-200 text-slate-700' :
                index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
              }`}>
                #{index + 1}
              </div>
              <h4 className="font-bold text-slate-800 text-lg">{group.name}</h4>
              <div className="text-3xl font-black text-indigo-600 my-2">{group.totalPoints}đ</div>
              <div className="text-xs text-slate-500">{group.students.length} thành viên</div>
              
              <div className="mt-4 flex -space-x-2">
                {group.students.slice(0, 5).map(s => (
                  <img key={s.id} src={s.avatar} alt={s.name} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100" title={s.name} />
                ))}
                {group.students.length > 5 && (
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 text-[10px] font-bold text-slate-600 flex items-center justify-center">
                    +{group.students.length - 5}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Digital Badges Auto-Recommendation System */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <span>Hệ Thống Đề Xuất Trao Huy Hiệu Điện Tử (Digital Badges)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tự động rà soát điều kiện điểm số & hành vi để đề xuất danh sách trao thưởng cuối tuần
            </p>
          </div>

          <button
            onClick={handleAwardAllSuggested}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 transition flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Phê Duyệt Trao Tất Cả Huy Hiệu</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badgeSuggestions.map(({ badge, candidates }) => (
            <div
              key={badge.id}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition space-y-3"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-sm bg-gradient-to-tr ${badge.color}`}
                >
                  ★
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{badge.title}</h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1">{badge.description}</p>
                </div>
              </div>

              <div className="text-[11px] text-indigo-700 font-semibold bg-indigo-50/80 p-2 rounded-xl border border-indigo-100">
                Tiêu chuẩn: {badge.criteria}
              </div>

              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Đề xuất ({candidates.length} học sinh đủ điều kiện):
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {candidates.slice(0, 4).map((student) => {
                    const alreadyHas = student.badges.includes(badge.id);
                    return (
                      <span
                        key={student.id}
                        onClick={() => onAwardBadge(student.id, badge.id)}
                        className={`text-[11px] px-2 py-0.5 rounded-lg border font-medium cursor-pointer transition ${
                          alreadyHas
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-white hover:bg-indigo-50 text-slate-700 border-slate-200'
                        }`}
                        title={alreadyHas ? 'Đã trao huy hiệu' : 'Bấm để trao huy hiệu'}
                      >
                        {student.name} {alreadyHas ? '✓' : '+'}
                      </span>
                    );
                  })}
                  {candidates.length > 4 && (
                    <span className="text-[11px] text-slate-400 self-center">
                      +{candidates.length - 4} bạn
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full 45-Student Emulation Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Bảng Tổng Hợp Thi Đua Toàn Bộ 45 Học Sinh Lớp 6A
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Xếp hạng theo các trụ cột đánh giá của nhà trường
            </p>
          </div>

          {/* Pillar Filter Tabs */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl text-xs">
            <button
              onClick={() => setRankingPillar('total')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                rankingPillar === 'total'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tổng Điểm
            </button>
            <button
              onClick={() => setRankingPillar('discipline')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                rankingPillar === 'discipline'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Nề Nếp
            </button>
            <button
              onClick={() => setRankingPillar('academic')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                rankingPillar === 'academic'
                  ? 'bg-white text-emerald-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Học Tập
            </button>
            <button
              onClick={() => setRankingPillar('moral')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                rankingPillar === 'moral'
                  ? 'bg-white text-purple-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Đạo Đức
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-3 w-12 text-center">Hạng</th>
                <th className="py-3 px-3">Học Sinh</th>
                <th className="py-3 px-3 text-center">STT Bàn</th>
                <th className="py-3 px-3 text-center">Nề Nếp</th>
                <th className="py-3 px-3 text-center">Học Tập</th>
                <th className="py-3 px-3 text-center">Đạo Đức</th>
                <th className="py-3 px-3 text-center">Tổng Điểm</th>
                <th className="py-3 px-3 text-center">Xu Hướng</th>
                <th className="py-3 px-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedStudents.map((student, index) => {
                const isWarning = student.consecutiveDrops >= 3;
                return (
                  <tr
                    key={student.id}
                    className={`hover:bg-slate-50 transition cursor-pointer ${
                      isWarning ? 'bg-rose-50/40' : ''
                    }`}
                    onClick={() => onSelectStudent(student)}
                  >
                    <td className="py-2.5 px-3 text-center font-bold">
                      {index === 0 && <span className="text-amber-500 font-black">🥇 1</span>}
                      {index === 1 && <span className="text-slate-400 font-black">🥈 2</span>}
                      {index === 2 && <span className="text-amber-700 font-black">🥉 3</span>}
                      {index > 2 && <span className="text-slate-500">{index + 1}</span>}
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="flex items-center space-x-2">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-800 flex items-center gap-1.5">
                            {student.name}
                            {isWarning && (
                              <span className="text-[10px] text-rose-600 font-bold bg-rose-100 px-1 rounded-sm">
                                3🔻
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Dân tộc {student.ethnic}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-2.5 px-3 text-center font-mono text-slate-500">
                      Bàn #{student.id}
                    </td>

                    <td className="py-2.5 px-3 text-center font-bold text-blue-700">
                      {student.disciplinePoints}đ
                    </td>

                    <td className="py-2.5 px-3 text-center font-bold text-emerald-700">
                      {student.academicPoints}đ
                    </td>

                    <td className="py-2.5 px-3 text-center font-bold text-purple-700">
                      {student.moralPoints}đ
                    </td>

                    <td className="py-2.5 px-3 text-center font-black text-indigo-900 text-sm">
                      {student.totalPoints}đ
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      {student.trend === 'up' && (
                        <span className="text-emerald-600 font-bold">▲ Tăng</span>
                      )}
                      {student.trend === 'down' && (
                        <span className="text-rose-600 font-bold">▼ Giảm</span>
                      )}
                      {student.trend === 'stable' && (
                        <span className="text-slate-400 font-bold">— Ổn định</span>
                      )}
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      <div
                        className="inline-flex items-center space-x-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => onOpenScoreModal(student, 'plus')}
                          title="Cộng điểm"
                          className="p-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenParentNotify(student)}
                          title="Báo phụ huynh"
                          className="p-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white transition"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
