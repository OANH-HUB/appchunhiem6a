import React, { useState } from 'react';
import { SecretLetter } from '../types';
import { counselSecretLetter } from '../services/geminiService';
import {
  Mail,
  Lock,
  Unlock,
  Shield,
  Bot,
  Sparkles,
  Heart,
  Send,
  UserCheck,
  CheckCircle2,
  Plus,
  AlertCircle,
  Eye,
  MessageSquare
} from 'lucide-react';

interface SecretMailboxProps {
  letters: SecretLetter[];
  onUpdateLetter: (updated: SecretLetter) => void;
  onAddNewLetter: (letter: Omit<SecretLetter, 'id' | 'timestamp' | 'isRead'>) => void;
}

export const SecretMailbox: React.FC<SecretMailboxProps> = ({
  letters,
  onUpdateLetter,
  onAddNewLetter,
}) => {
  const [selectedLetterId, setSelectedLetterId] = useState<string>(letters[0]?.id || '');
  const [isPrivacyUnlocked, setIsPrivacyUnlocked] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isCounseling, setIsCounseling] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);

  // New letter form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<SecretLetter['category']>('Tâm tư tuổi dậy thì');
  const [newSenderName, setNewSenderName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);

  const selectedLetter = letters.find((l) => l.id === selectedLetterId) || letters[0];

  const handleSelectLetter = (letter: SecretLetter) => {
    setSelectedLetterId(letter.id);
    if (!letter.isRead) {
      onUpdateLetter({ ...letter, isRead: true });
    }
  };

  const handleGetAiCounsel = async () => {
    if (!selectedLetter) return;
    setIsCounseling(true);
    const advice = await counselSecretLetter(selectedLetter);
    onUpdateLetter({
      ...selectedLetter,
      aiAdvice: advice,
    });
    setIsCounseling(false);
  };

  const handleSaveTeacherReply = () => {
    if (!selectedLetter || !replyText.trim()) return;
    onUpdateLetter({
      ...selectedLetter,
      teacherResponse: replyText,
    });
    setReplyText('');
  };

  const handleCreateNewLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    onAddNewLetter({
      title: newTitle,
      content: newContent,
      category: newCategory,
      senderName: isAnonymous ? 'Ẩn danh (Học sinh lớp 6A)' : newSenderName.trim() || 'Học sinh 6A',
      isAnonymous,
    });

    setNewTitle('');
    setNewContent('');
    setNewSenderName('');
    setIsAnonymous(true);
    setShowComposeModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Confidential Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-pink-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-rose-300 text-xs font-bold border border-rose-300/30">
              <Shield className="w-3.5 h-3.5" />
              <span>KÊNH BẢO MẬT CAO CẤP NHẤT • CHỈ DÀNH CHO CÔ OANH</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
              <span>Hộp Thư Điều Thầm Kín Lớp 6A</span>
              <Heart className="w-6 h-6 text-rose-400 fill-rose-400" />
            </h2>
            <p className="text-xs sm:text-sm text-pink-100/90 max-w-2xl leading-relaxed">
              Nơi học sinh lớp 6 trải lòng về những lo âu tuổi dậy thì, áp lực học tập nội trú, xung đột bạn bè và tình cảm gia đình. 
              Trợ lý AI đồng hành phân tích tâm lý sư phạm, hỗ trợ Cô Oanh lắng nghe và nâng đỡ tâm hồn các em.
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start md:self-center">
            <button
              onClick={() => setShowComposeModal(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Ghi Nhận Thư Mới</span>
            </button>
            <button
              onClick={() => setIsPrivacyUnlocked(!isPrivacyUnlocked)}
              className={`p-2 rounded-xl text-xs font-bold border transition flex items-center space-x-1.5 ${
                isPrivacyUnlocked
                  ? 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                  : 'bg-rose-500 text-white border-rose-400'
              }`}
              title={isPrivacyUnlocked ? 'Khóa bảo mật riêng tư' : 'Mở khóa bảo mật'}
            >
              {isPrivacyUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Mailbox Content */}
      {!isPrivacyUnlocked ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Hộp Thư Đang Khóa Bảo Mật Riêng Tư
          </h3>
          <p className="text-xs text-slate-500">
            Để đảm bảo bí mật tuyệt đối tâm tư học sinh tuổi dậy thì, xin cô Oanh xác nhận để mở hòm thư.
          </p>
          <button
            onClick={() => setIsPrivacyUnlocked(true)}
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            Mở Khóa Xem Thư Thầm Kín
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Letters List Column (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-rose-600" />
                Hộp Thư ({letters.length} thư)
              </span>
              <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                {letters.filter((l) => !l.isRead).length} chưa đọc
              </span>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {letters.map((letter) => {
                const isSelected = selectedLetter?.id === letter.id;
                return (
                  <div
                    key={letter.id}
                    onClick={() => handleSelectLetter(letter)}
                    className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-rose-50 border-rose-300 shadow-xs ring-1 ring-rose-200'
                        : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5 truncate">
                        {!letter.isRead && (
                          <span className="w-2 h-2 rounded-full bg-rose-600 inline-block shrink-0"></span>
                        )}
                        {letter.isAnonymous ? 'Ẩn danh 6A' : letter.senderName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {letter.timestamp.split(' ')[0]}
                      </span>
                    </div>

                    <h4 className="font-semibold text-slate-900 mt-1 line-clamp-1">
                      {letter.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                      {letter.content}
                    </p>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 bg-white border border-slate-200 text-slate-600 rounded-md font-medium">
                        {letter.category}
                      </span>
                      {letter.teacherResponse && (
                        <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Đã trả lời
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Letter Detail & AI Counselor Column (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
            {selectedLetter ? (
              <>
                {/* Header of Letter */}
                <div className="border-b border-slate-100 pb-4 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                      Chủ đề: {selectedLetter.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Gửi lúc: {selectedLetter.timestamp}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedLetter.title}
                  </h3>
                  <div className="text-xs text-slate-600 flex items-center gap-2">
                    <span>Người gửi:</span>
                    <strong className="text-slate-800 font-bold">
                      {selectedLetter.isAnonymous ? 'Ẩn danh (Học sinh lớp 6A)' : selectedLetter.senderName}
                    </strong>
                    {selectedLetter.senderId && (
                      <span className="text-indigo-600 font-mono text-[11px]">
                        (Bàn #{selectedLetter.senderId})
                      </span>
                    )}
                  </div>
                </div>

                {/* Letter Content Card */}
                <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/60 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line italic">
                  "{selectedLetter.content}"
                </div>

                {/* AI Pedagogical & Psychological Counseling Panel */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-purple-50/60 to-rose-50/60 border border-indigo-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          Chuyên Gia Tâm Lý Học Đường AI
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Tư vấn tâm lý lứa tuổi 11-12 & Gợi ý kịch bản mở lời cho Cô Oanh
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleGetAiCounsel}
                      disabled={isCounseling}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center space-x-1.5 self-start sm:self-auto disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isCounseling ? 'Đang phân tích...' : 'Tham Vấn Tâm Lý AI'}</span>
                    </button>
                  </div>

                  {selectedLetter.aiAdvice ? (
                    <div className="p-3.5 bg-white/90 rounded-xl border border-indigo-100 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                      {selectedLetter.aiAdvice}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">
                      Bấm nút "Tham Vấn Tâm Lý AI" để nhận phân tích chuyên sâu về cảm xúc lõi của học sinh và gợi ý lời nói giúp cô Oanh thấu hiểu em một cách tinh tế nhất.
                    </p>
                  )}
                </div>

                {/* Teacher's Response Section */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    Phản Hồi & Kế Hoạch Hỗ Trợ Của Cô Bế Thị Oanh
                  </h4>

                  {selectedLetter.teacherResponse && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 leading-relaxed">
                      <div className="font-bold mb-1 text-emerald-900">
                        Lời nhắn gửi của Cô Oanh:
                      </div>
                      "{selectedLetter.teacherResponse}"
                    </div>
                  )}

                  <div className="space-y-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Cô Oanh viết lời động viên, hẹn gặp riêng giờ giải lao hoặc ghi chú sư phạm tại đây..."
                      rows={3}
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveTeacherReply}
                        disabled={!replyText.trim()}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center space-x-1.5 disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Lưu Lời Phản Hồi Sư Phạm</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <Mail className="w-12 h-12 mx-auto mb-2 opacity-40" />
                <p className="text-xs">Chọn một lá thư bên trái để đọc và phản hồi.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal to simulate adding a new student letter */}
      {showComposeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-rose-600" />
              <span>Ghi Nhận Thư Mới Vào Hộp Thư Thầm Kín</span>
            </h3>
            <p className="text-xs text-slate-500">
              Nhập thư tay của học sinh gửi qua khe hòm thư lớp 6A hoặc học sinh gửi trực tuyến.
            </p>

            <form onSubmit={handleCreateNewLetter} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Chủ đề tâm tư
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Tâm tư tuổi dậy thì">Tâm tư tuổi dậy thì</option>
                  <option value="Áp lực học tập">Áp lực học tập</option>
                  <option value="Quan hệ bạn bè">Quan hệ bạn bè</option>
                  <option value="Gia đình">Gia đình & Nỗi nhớ nhà nội trú</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tiêu đề bức thư
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="VD: Cô Oanh ơi, em có chuyện này muốn hỏi cô..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nội dung tâm sự của học sinh
                </label>
                <textarea
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Ghi lại toàn bộ tâm tư của em học sinh..."
                  rows={4}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anon"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded-sm"
                />
                <label htmlFor="anon" className="text-xs text-slate-700 cursor-pointer">
                  Học sinh muốn giấu tên (Ẩn danh)
                </label>
              </div>

              {!isAnonymous && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tên học sinh
                  </label>
                  <input
                    type="text"
                    value={newSenderName}
                    onChange={(e) => setNewSenderName(e.target.value)}
                    placeholder="VD: Em Lương Gia Bảo"
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              )}

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowComposeModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Lưu Thư Vào Hệ Thống
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
