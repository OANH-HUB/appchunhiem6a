import React, { useState } from 'react';
import { ClassMemory } from '../types';
import { Camera, Plus, Calendar, Tag, Image as ImageIcon, Sparkles, X } from 'lucide-react';

interface MemoryArchiveProps {
  memories: ClassMemory[];
  onAddMemory: (memory: Omit<ClassMemory, 'id'>) => void;
}

export const MemoryArchive: React.FC<MemoryArchiveProps> = ({
  memories,
  onAddMemory,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tag, setTag] = useState('Sinh hoạt lớp');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddMemory({
      title,
      caption,
      imageUrl:
        imageUrl ||
        'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
      date: new Date().toLocaleDateString('vi-VN'),
      tag,
    });

    setTitle('');
    setCaption('');
    setImageUrl('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-bold border border-white/10 mb-2">
            <Camera className="w-3.5 h-3.5" />
            <span>KHO KỶ NIỆM VÀ KHOẢNH KHẮC ĐẸP</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Nhật Ký Ảnh Lớp 6A • Khóa 2026-2030
          </h2>
          <p className="text-xs sm:text-sm text-orange-100 mt-1 max-w-xl">
            Lưu giữ những nụ cười, hoạt động trải nghiệm, lao động trồng hoa nội trú và các kỳ cuộc thi đua đáng nhớ của 45 bạn nhỏ cùng cô giáo Bế Thị Oanh.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-white text-orange-950 hover:bg-orange-50 text-xs font-bold rounded-xl shadow-lg transition flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-orange-600" />
          <span>Lưu Khoảnh Khắc Mới</span>
        </button>
      </div>

      {/* Grid of Photo Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories.map((mem) => (
          <div
            key={mem.id}
            className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <img
                src={mem.imageUrl}
                alt={mem.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
                {mem.tag}
              </span>
              <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 text-slate-800 shadow-sm flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" />
                {mem.date}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
                  {mem.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 line-clamp-3 leading-relaxed">
                  {mem.caption}
                </p>
              </div>

              <div className="pt-2 text-[10px] text-slate-400 font-mono">
                Lớp 6A • PTNT TH & THCS Đồng Tâm
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-orange-600" />
              <span>Thêm Khoảnh Khắc Kỷ Niệm 6A</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tiêu đề hoạt động
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: Hội thi văn nghệ 20/11..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Chủ đề / Thẻ tag
                </label>
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Khai giảng">Khai giảng</option>
                  <option value="Lao động nội trú">Lao động nội trú</option>
                  <option value="Học tập trải nghiệm">Học tập trải nghiệm</option>
                  <option value="Văn hóa & Lễ hội">Văn hóa & Lễ hội</option>
                  <option value="Thi đua nề nếp">Thi đua nề nếp</option>
                  <option value="Sinh hoạt lớp">Sinh hoạt lớp</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Đường dẫn hình ảnh (URL)
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... hoặc để trống để dùng ảnh mẫu"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lời bình / Cảm xúc của cô giáo & học sinh
                </label>
                <textarea
                  rows={3}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Ghi lại kỷ niệm đáng nhớ về tiết học hoặc hoạt động này..."
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
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Lưu Vào Album Lớp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
