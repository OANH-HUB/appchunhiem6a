import React, { useState, useMemo } from 'react';
import { FundTransaction } from '../types';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  FileText,
  DollarSign,
  Calendar,
  CheckCircle2,
  Receipt
} from 'lucide-react';

interface ClassFundProps {
  transactions: FundTransaction[];
  onAddTransaction: (transaction: Omit<FundTransaction, 'id'>) => void;
}

export const ClassFund: React.FC<ClassFundProps> = ({
  transactions,
  onAddTransaction,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [type, setType] = useState<'thu' | 'chi'>('chi');
  const [amount, setAmount] = useState<number>(100000);
  const [category, setCategory] = useState('Khen thưởng thi đua');
  const [description, setDescription] = useState('');
  const [handler, setHandler] = useState('Cô Bế Thị Oanh');
  const [receiptNo, setReceiptNo] = useState('');

  // Calculations
  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === 'thu')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === 'chi')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    return { totalIncome, totalExpense, balance };
  }, [transactions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || amount <= 0) return;

    onAddTransaction({
      date: new Date().toISOString().split('T')[0],
      type,
      amount,
      category,
      description,
      handler,
      receiptNo: receiptNo || `${type === 'thu' ? 'PT' : 'PC'}-0${transactions.length + 1}/6A`,
    });

    setDescription('');
    setAmount(100000);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-bold border border-white/10 mb-2">
              <Receipt className="w-3.5 h-3.5" />
              <span>SỔ THU CHI MINH BẠCH LỚP 6A</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Quản Trị Quỹ Phụ Huynh & Thi Đua Lớp 6A
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
              Minh bạch 100% mọi khoản thu/chi hoạt động nề nếp, phần thưởng hoa điểm 10, sinh hoạt nội trú và hỗ trợ học sinh có hoàn cảnh khó khăn.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-bold rounded-xl shadow-lg transition flex items-center space-x-1.5 self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Thêm Phiếu Thu / Chi</span>
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4">
            <span className="text-xs text-emerald-200 font-semibold flex items-center gap-1">
              <ArrowDownRight className="w-3.5 h-3.5 text-emerald-300" />
              Tổng Thu Quỹ Kỳ I
            </span>
            <div className="text-2xl font-black text-white mt-1">
              {stats.totalIncome.toLocaleString('vi-VN')} đ
            </div>
            <span className="text-[11px] text-emerald-300">45/45 học sinh hoàn thành</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4">
            <span className="text-xs text-rose-200 font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-rose-300" />
              Tổng Chi Hoạt Động
            </span>
            <div className="text-2xl font-black text-white mt-1">
              {stats.totalExpense.toLocaleString('vi-VN')} đ
            </div>
            <span className="text-[11px] text-rose-200">Khen thưởng, dụng cụ, liên hoan</span>
          </div>

          <div className="bg-white/20 backdrop-blur-md border border-amber-300/40 rounded-2xl p-4">
            <span className="text-xs text-amber-200 font-semibold flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-amber-300" />
              Số Dư Quỹ Hiện Tại
            </span>
            <div className="text-2xl font-black text-amber-300 mt-1">
              {stats.balance.toLocaleString('vi-VN')} đ
            </div>
            <span className="text-[11px] text-amber-100">Bảo toàn quỹ lớp</span>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Nhật Ký Giao Dịch Quỹ Lớp 6A
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-3">Mã Phiếu</th>
                <th className="py-3 px-3">Ngày</th>
                <th className="py-3 px-3">Hạng Mục</th>
                <th className="py-3 px-3">Nội Dung Chi Tiết</th>
                <th className="py-3 px-3">Người Thực Hiện</th>
                <th className="py-3 px-3 text-right">Số Tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-mono font-bold text-slate-700">
                    {t.receiptNo}
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-mono">
                    {t.date}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                      {t.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-800 font-medium max-w-xs">
                    {t.description}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {t.handler}
                  </td>
                  <td className="py-3 px-3 text-right font-black text-sm">
                    <span
                      className={
                        t.type === 'thu' ? 'text-emerald-600' : 'text-rose-600'
                      }
                    >
                      {t.type === 'thu' ? '+' : '-'}
                      {t.amount.toLocaleString('vi-VN')} đ
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-600" />
              <span>Lập Phiếu Thu / Chi Quỹ Lớp</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('chi')}
                  className={`py-2 rounded-xl text-xs font-bold transition ${
                    type === 'chi'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Phiếu Chi Tiền (-)
                </button>
                <button
                  type="button"
                  onClick={() => setType('thu')}
                  className={`py-2 rounded-xl text-xs font-bold transition ${
                    type === 'thu'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Phiếu Thu Tiền (+)
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Số tiền (VNĐ)
                </label>
                <input
                  type="number"
                  step={10000}
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hạng mục
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Khen thưởng thi đua">Khen thưởng thi đua & Hoa điểm 10</option>
                  <option value="Vệ sinh & Nề nếp">Dụng cụ vệ sinh & Khăn lau bảng</option>
                  <option value="Hoạt động trải nghiệm">Hoạt động trải nghiệm & Lễ hội</option>
                  <option value="Hỗ trợ nội trú">Hỗ trợ thuốc men y tế nội trú</option>
                  <option value="Thu quỹ phụ huynh">Thu quỹ phụ huynh định kỳ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Diễn giải nội dung
                </label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="VD: Mua 10 quyển vở thưởng cho học sinh đạt hoa điểm 10..."
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Người phụ trách thực hiện
                </label>
                <input
                  type="text"
                  value={handler}
                  onChange={(e) => setHandler(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Lưu Giao Dịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
