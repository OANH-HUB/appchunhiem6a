import React, { useState, useEffect } from 'react';
import { X, KeyRound, Server, AlertCircle } from 'lucide-react';

interface ApiSettingsModalProps {
  onClose: () => void;
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({ onClose }) => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [selectedModel, setSelectedModel] = useState(localStorage.getItem('gemini_selected_model') || 'gemini-3-flash-preview');

  const models = [
    { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash', desc: 'Nhanh, mặc định', badge: 'Default' },
    { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro', desc: 'Suy luận sâu' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', desc: 'Mô hình cũ, ổn định' }
  ];

  const handleSave = () => {
    if (!apiKey.trim()) {
      alert('Vui lòng nhập API Key!');
      return;
    }
    localStorage.setItem('gemini_api_key', apiKey.trim());
    localStorage.setItem('gemini_selected_model', selectedModel);
    onClose();
    // Refresh to apply changes globally if needed, or just let it be.
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <KeyRound className="w-5 h-5" />
            <h2 className="font-bold text-lg">Thiết lập AI & API Key</h2>
          </div>
          {localStorage.getItem('gemini_api_key') && (
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm">
              <strong>Bắt buộc:</strong> Bạn cần có Gemini API Key để sử dụng tính năng Trợ lý AI sư phạm. 
              <br />
              Lấy key miễn phí tại: <a href="https://aistudio.google.com/api-keys" target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline">aistudio.google.com/api-keys</a>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nhập Google Gemini API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Chọn Mô hình AI (Model)</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {models.map(m => (
                <div
                  key={m.id}
                  onClick={() => setSelectedModel(m.id)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition relative ${
                    selectedModel === m.id ? 'border-rose-500 bg-rose-50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {m.badge && (
                    <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {m.badge}
                    </span>
                  )}
                  <Server className={`w-5 h-5 mb-1 ${selectedModel === m.id ? 'text-rose-600' : 'text-slate-400'}`} />
                  <div className="font-bold text-slate-800 text-sm">{m.name}</div>
                  <div className="text-[11px] text-slate-500 leading-tight mt-0.5">{m.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow-md transition"
          >
            Lưu Cấu Hình
          </button>
        </div>
      </div>
    </div>
  );
};
