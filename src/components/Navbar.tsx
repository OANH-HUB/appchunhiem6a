import React from 'react';
import {
  GraduationCap,
  LayoutGrid,
  Trophy,
  Mail,
  Wallet,
  Camera,
  FileSpreadsheet,
  Bot,
  AlertTriangle,
  HeartHandshake,
  Users,
  ShieldCheck,
  UserCog,
  Settings
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAiDrawer: () => void;
  onOpenBulkScore: () => void;
  unreadLettersCount: number;
  warningStudentsCount: number;
  averageScore: number;
  currentUserRole: 'teacher' | 'monitor' | 'student';
  onChangeRole: (role: 'teacher' | 'monitor' | 'student') => void;
  pendingProposalsCount: number;
  onOpenApiSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openAiDrawer,
  onOpenBulkScore,
  unreadLettersCount,
  warningStudentsCount,
  averageScore,
  currentUserRole,
  onChangeRole,
  pendingProposalsCount,
  onOpenApiSettings,
}) => {
  let navItems = [
    {
      id: 'seating',
      label: 'Sơ đồ lớp 45 bàn',
      icon: LayoutGrid,
    },
    {
      id: 'leaderboard',
      label: 'Thi đua & Bảng vàng',
      icon: Trophy,
    },
    {
      id: 'secret-mailbox',
      label: 'Hộp thư thầm kín',
      icon: Mail,
      badge: unreadLettersCount > 0 ? unreadLettersCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'fund',
      label: 'Quỹ lớp 6A',
      icon: Wallet,
    },
    {
      id: 'memories',
      label: 'Kho kỷ niệm',
      icon: Camera,
    },
    {
      id: 'report',
      label: 'Xuất báo cáo BGH',
      icon: FileSpreadsheet,
    },
  ];

  if (currentUserRole === 'teacher') {
    navItems.splice(2, 0, {
      id: 'approvals',
      label: 'Duyệt điểm',
      icon: ShieldCheck,
      badge: pendingProposalsCount > 0 ? pendingProposalsCount : undefined,
      badgeColor: 'bg-indigo-500 text-white',
    });
  }

  if (currentUserRole === 'student' || currentUserRole === 'monitor') {
    navItems = navItems.filter(i => !['fund', 'report'].includes(i.id));
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner with Identity */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Lớp 6A • Khóa 2026-2030
                </span>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  Trường PTNT TH & THCS Đồng Tâm
                </span>
              </div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                CHỦ NHIỆM 6A
                <span className="text-sm font-normal text-slate-500">| GVCN: Cô Bế Thị Oanh</span>
              </h1>
            </div>
          </div>

          {/* Quick Stat Indicators & AI Assistant Trigger */}
          <div className="flex items-center space-x-2 sm:space-x-3 self-end sm:self-center">
            {warningStudentsCount > 0 && (
              <div 
                onClick={() => setActiveTab('leaderboard')}
                title={`${warningStudentsCount} học sinh có cảnh báo sụt giảm 3 phiên`}
                className="cursor-pointer flex items-center space-x-1.5 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg text-xs font-semibold text-amber-800 transition"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
                <span>{warningStudentsCount} cảnh báo</span>
              </div>
            )}

            <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
              <UserCog className="w-3.5 h-3.5 text-indigo-600" />
              <select 
                value={currentUserRole}
                onChange={(e) => onChangeRole(e.target.value as any)}
                className="bg-transparent border-none outline-none font-bold text-slate-700 cursor-pointer"
              >
                <option value="teacher">Giáo viên (Toàn quyền)</option>
                <option value="monitor">Cán sự (Chỉ đề xuất)</option>
                <option value="student">Học sinh (Chỉ xem)</option>
              </select>
            </div>

            {currentUserRole !== 'student' && (
              <button
                onClick={onOpenBulkScore}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold transition shadow-xs"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Chấm điểm đồng loạt</span>
              </button>
            )}

            {currentUserRole === 'teacher' && (
              <>
                <button
                  onClick={onOpenApiSettings}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-100 transition shadow-xs"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Lấy API key để sử dụng app</span>
                  <span className="md:hidden">API Key</span>
                </button>

                <button
                  onClick={openAiDrawer}
                  className="relative inline-flex items-center space-x-2 px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-indigo-200 hover:shadow-lg transition-all active:scale-95"
                >
                  <Bot className="w-4 h-4 animate-pulse" />
                  <span>Trợ lý AI Cô Oanh</span>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300"></span>
                  </span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                      item.badgeColor || 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Slogan Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-indigo-100 text-[11px] sm:text-xs py-1 px-4 text-center flex items-center justify-center space-x-2">
        <span className="font-semibold tracking-wider uppercase text-amber-300">Slogan Hành Động:</span>
        <span className="italic">"Quản trị bằng dữ liệu - Giáo dục bằng tình thương"</span>
      </div>
    </header>
  );
};
