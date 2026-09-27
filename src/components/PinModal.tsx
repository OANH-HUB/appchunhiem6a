import React, { useState } from 'react';
import { Lock, X, KeyRound } from 'lucide-react';
import { UserRole } from '../types';

interface PinModalProps {
  targetRole: UserRole;
  expectedPin: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const PinModal: React.FC<PinModalProps> = ({
  targetRole,
  expectedPin,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const roleName = targetRole === 'teacher' ? 'Giáo viên' : 'Cán sự';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    
    if (pin === expectedPin) {
      onSuccess();
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-indigo-600 p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2 font-bold">
            <Lock className="w-5 h-5" />
            <span>Xác Thực Phân Quyền</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800">Quyền truy cập: {roleName}</h3>
            <p className="text-xs text-slate-500 mt-1">
              Vui lòng nhập mã PIN để xác nhận danh tính của bạn.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="password"
                value={pin}
                onChange={e => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="Nhập mã PIN..."
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-center tracking-[0.5em] font-bold text-lg focus:outline-hidden focus:ring-2 ${
                  error ? 'border-rose-300 focus:ring-rose-500 text-rose-600' : 'border-slate-200 focus:ring-indigo-500 text-slate-800'
                }`}
                autoFocus
                maxLength={6}
              />
              {error && (
                <p className="text-rose-500 text-xs font-semibold text-center mt-2 animate-bounce">
                  Mã PIN không chính xác!
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!pin}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md transition disabled:opacity-50"
            >
              Mở Khóa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
