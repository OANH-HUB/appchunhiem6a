import React, { useState } from 'react';
import { ScoreItem, PillarType } from '../types';
import { X, PlusCircle, Save, Trash2, Edit2 } from 'lucide-react';

interface ScoreSettingsModalProps {
  scoreItems: ScoreItem[];
  onSave: (items: ScoreItem[]) => void;
  onClose: () => void;
  pins: { teacher: string; monitor: string };
  onSavePins: (pins: { teacher: string; monitor: string }) => void;
}

export const ScoreSettingsModal: React.FC<ScoreSettingsModalProps> = ({ scoreItems, onSave, onClose, pins, onSavePins }) => {
  const [items, setItems] = useState<ScoreItem[]>([...scoreItems]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'scores' | 'security'>('scores');
  const [localTeacherPin, setLocalTeacherPin] = useState(pins.teacher);
  const [localMonitorPin, setLocalMonitorPin] = useState(pins.monitor);
  
  // Form state
  const [name, setName] = useState('');
  const [pillar, setPillar] = useState<PillarType>('discipline');
  const [basePoints, setBasePoints] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [isKindnessBonus, setIsKindnessBonus] = useState(false);

  const handleEdit = (item: ScoreItem) => {
    setEditingId(item.id);
    setName(item.name);
    setPillar(item.pillar);
    setBasePoints(item.basePoints);
    setDescription(item.description);
    setIsKindnessBonus(item.isKindnessBonus || false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tiêu chí này không?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleSaveItem = () => {
    if (!name.trim()) {
      alert('Vui lòng nhập tên hành vi/tiêu chí');
      return;
    }

    if (editingId) {
      setItems(items.map(item => item.id === editingId ? {
        ...item,
        name,
        pillar,
        basePoints,
        description,
        isKindnessBonus
      } : item));
    } else {
      setItems([...items, {
        id: `custom-${Date.now()}`,
        name,
        pillar,
        basePoints,
        description,
        isKindnessBonus
      }]);
    }
    
    // Reset form
    setEditingId(null);
    setName('');
    setBasePoints(0);
    setDescription('');
    setIsKindnessBonus(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setBasePoints(0);
    setDescription('');
    setIsKindnessBonus(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[85vh]">
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 p-5 text-white flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold">Cấu hình Hệ thống</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex bg-slate-100 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('scores')}
            className={`flex-1 py-3 text-sm font-bold transition ${activeTab === 'scores' ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-600 hover:bg-slate-200'}`}
          >
            Tiêu Chí Điểm Số
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-3 text-sm font-bold transition ${activeTab === 'security' ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-600 hover:bg-slate-200'}`}
          >
            Mã PIN Bảo Mật
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 bg-slate-50">
          {activeTab === 'scores' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Form */}
          <div className="md:col-span-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 h-fit space-y-4">
            <h3 className="font-bold text-slate-800 border-b pb-2">
              {editingId ? 'Sửa Tiêu Chí' : 'Thêm Tiêu Chí Mới'}
            </h3>
            
            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên hành vi</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden" placeholder="VD: Không làm bài tập" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Loại (Trụ cột)</label>
                <select value={pillar} onChange={e => setPillar(e.target.value as PillarType)} className="w-full p-2 border border-slate-300 rounded-lg outline-hidden">
                  <option value="discipline">Nề nếp</option>
                  <option value="academic">Học tập</option>
                  <option value="moral">Đạo đức - Kỹ năng</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Số điểm (cộng hoặc trừ)</label>
                <input type="number" value={basePoints} onChange={e => setBasePoints(Number(e.target.value))} className="w-full p-2 border border-slate-300 rounded-lg outline-hidden" placeholder="VD: -5 hoặc 5" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả chi tiết</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg outline-hidden" rows={2}></textarea>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="kindness" checked={isKindnessBonus} onChange={e => setIsKindnessBonus(e.target.checked)} className="rounded-sm" />
                <label htmlFor="kindness" className="text-xs font-semibold text-slate-700 cursor-pointer">Cho phép nhân đôi x2 (hành động đột xuất)</label>
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={handleSaveItem} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 flex justify-center items-center gap-1">
                  {editingId ? <Save className="w-4 h-4"/> : <PlusCircle className="w-4 h-4"/>}
                  {editingId ? 'Lưu' : 'Thêm'}
                </button>
                {editingId && (
                  <button onClick={handleCancelEdit} className="px-3 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-300">
                    Hủy
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* List */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-bold text-slate-800">Danh sách hiện tại ({items.length} tiêu chí)</h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-sm text-[10px] text-white ${item.pillar === 'discipline' ? 'bg-blue-500' : item.pillar === 'academic' ? 'bg-emerald-500' : 'bg-purple-500'}`}>
                        {item.pillar === 'discipline' ? 'Nề nếp' : item.pillar === 'academic' ? 'Học tập' : 'Đạo đức'}
                      </span>
                      {item.name}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{item.description}</div>
                  </div>
                  <div className={`font-bold ${item.basePoints > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {item.basePoints > 0 ? `+${item.basePoints}` : item.basePoints}
                  </div>
                  <div className="flex flex-col gap-1 ml-2">
                    <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4"/></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
          )}

          {activeTab === 'security' && (
            <div className="max-w-xl mx-auto space-y-6 mt-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                  Mã PIN Giáo viên
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Sử dụng để cấp toàn quyền Duyệt điểm, Sửa cấu hình, Nhập database. 
                  Chỉ cung cấp cho Giáo viên chủ nhiệm.
                </p>
                <div>
                  <input
                    type="text"
                    value={localTeacherPin}
                    onChange={e => setLocalTeacherPin(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center tracking-[0.5em] font-bold text-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    placeholder="Mã PIN Giáo viên"
                    maxLength={6}
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                  Mã PIN Cán sự (Lớp trưởng, Tổ trưởng)
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Sử dụng để mở khóa quyền Đề xuất điểm (chờ duyệt).
                  Có thể tiết lộ cho Ban cán sự lớp.
                </p>
                <div>
                  <input
                    type="text"
                    value={localMonitorPin}
                    onChange={e => setLocalMonitorPin(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center tracking-[0.5em] font-bold text-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    placeholder="Mã PIN Cán sự"
                    maxLength={6}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 bg-white flex justify-end shrink-0 gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100">
            Đóng
          </button>
          <button onClick={() => { 
            onSave(items); 
            onSavePins({ teacher: localTeacherPin, monitor: localMonitorPin });
            onClose(); 
          }} className="px-6 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 shadow-md">
            Lưu Toàn Bộ Cấu Hình
          </button>
        </div>
      </div>
    </div>
  );
};
