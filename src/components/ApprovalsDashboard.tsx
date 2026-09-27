import React from 'react';
import { ScoreProposal, Student } from '../types';
import { Check, X, Clock, ShieldCheck } from 'lucide-react';

interface ApprovalsDashboardProps {
  proposals: ScoreProposal[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const ApprovalsDashboard: React.FC<ApprovalsDashboardProps> = ({
  proposals,
  onApprove,
  onReject,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <span>Hàng Chờ Duyệt Điểm</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Các đề xuất cộng/trừ điểm từ Lớp trưởng và Tổ trưởng cần Cô Oanh phê duyệt.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>Đang chờ: {proposals.length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {proposals.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-3xl border border-slate-200 shadow-xs">
            <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-slate-500 font-bold">Không có đề xuất nào đang chờ duyệt.</h3>
            <p className="text-xs text-slate-400 mt-1">Mọi thứ đã được giải quyết xong!</p>
          </div>
        ) : (
          proposals.map(p => (
            <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-md text-[10px] font-bold uppercase tracking-wide">
                    {p.proposedBy} Đề xuất
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(p.timestamp).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className="font-bold text-slate-800 text-sm mb-1">
                  {p.item.name}
                  <span className={`ml-2 inline-block px-2 py-0.5 rounded-lg text-xs font-black ${p.item.basePoints > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {p.item.basePoints > 0 ? `+${p.item.basePoints}` : p.item.basePoints}đ
                  </span>
                </div>
                <div className="text-xs text-slate-600 font-medium mb-1">
                  Học sinh: <span className="text-indigo-600">{p.studentNames.join(', ')}</span>
                </div>
                {p.note && (
                  <div className="text-[11px] text-slate-500 italic border-l-2 border-slate-200 pl-2 mt-2">
                    Lý do: {p.note}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => onReject(p.id)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  <span>Từ chối</span>
                </button>
                <button
                  onClick={() => onApprove(p.id)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Duyệt</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
