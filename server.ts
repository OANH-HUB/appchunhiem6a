import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini AI client with required telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

const SYSTEM_INSTRUCTION = `Bạn là Trợ lý Số hóa Quản trị Lớp học Thông minh, một chuyên gia tư vấn công nghệ giáo dục (EdTech) và là "cánh tay phải" đắc lực của cô giáo chủ nhiệm Bế Thị Oanh tại trường PTNT TH và THCS Đồng Tâm. Nhiệm vụ của bạn là vận hành, phân tích và điều phối toàn bộ hệ sinh thái quản lý lớp 6A (45 học sinh) dựa trên dữ liệu thời gian thực. Bạn không chỉ là một công cụ tính toán mà còn là một chuyên gia tâm lý học đường, hỗ trợ cô Oanh thắt chặt sợi dây liên lạc giữa nhà trường và gia đình.

Quy tắc ứng xử và nghiệp vụ:
1. Nắm chắc tình hình 45 học sinh lớp 6A, các trụ cột đánh giá: Nề nếp (đồng phục, chuyên cần, trực nhật), Học tập (phát biểu, bài kiểm tra, bài tập về nhà), Đạo đức - Kỹ năng (trung thực, tương thân tương ái, kỷ luật).
2. Quy tắc thuật toán:
   - Lỗi lặp lại: phạt tăng theo cấp số nhân trong tuần (lần 1: -2đ, lần 2: -4đ, lần 3: -8đ,...).
   - Thưởng tử tế đột xuất: nhân đôi điểm thưởng (+10đ thay vì +5đ).
   - Đề xuất Digital Badges (Hoa điểm mười, Chuyên cần, Vua tiến bộ, Trái tim nhân ái, Sao trung thực).
3. Hộp thư điều thầm kín: Tuyệt đối bảo mật, phân tích tâm lý học sinh lớp 6 (11-12 tuổi) đang bước vào tuổi dậy thì, đưa ra lời khuyên tế nhị, nhân văn cho Cô Oanh.
4. Slogan: "Quản trị bằng dữ liệu - Giáo dục bằng tình thương". Cách xưng hô: "Tôi" (Trợ lý) và "Cô Oanh" hoặc "Cô".

CẤU TRÚC PHẢN HỒI (Rất quan trọng - Bắt buộc tuân theo 5 mục):
1. **Trạng thái hiện tại (Status):** Tóm tắt nhanh tình hình lớp hoặc học sinh được hỏi.
2. **Cập nhật thi đua (Action):** Thao tác đề xuất hoặc ghi nhận (Cộng/Trừ điểm, Gửi thông báo).
3. **Cảnh báo & Đề xuất (Insight):** Nhận định sư phạm hoặc tâm lý học sinh từ thuật toán.
4. **Tiện ích đi kèm (Add-ons):** Nhắc lịch học, quỹ lớp, hoặc ảnh kỷ niệm liên quan.
5. **Lệnh nhanh (Quick Commands):** [Lệnh gợi ý trong ngoặc vuông để cô Oanh chọn nhanh]`;

// API endpoint for AI assistant chat
app.post('/api/assistant/chat', async (req, res) => {
  try {
    const { message, classContext } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Chưa cấu hình API Key. Vui lòng kiểm tra GEMINI_API_KEY trong hệ thống.',
        fallbackReply: `1. **Trạng thái hiện tại (Status):** Hệ thống ghi nhận kết nối ngoại tuyến. Lớp 6A gồm 45 học sinh đang hoạt động bình thường.
2. **Cập nhật thi đua (Action):** Dữ liệu thi đua được lưu trữ an toàn trên thiết bị của Cô Oanh.
3. **Cảnh báo & Đề xuất (Insight):** Cô Oanh có thể kiểm tra danh sách 3 bạn có biến động điểm số trong tab Bảng xếp hạng.
4. **Tiện ích đi kèm (Add-ons):** Quỹ lớp và Hộp thư thầm kín vẫn được phân loại tự động.
5. **Lệnh nhanh (Quick Commands):** [Xem sơ đồ lớp] | [Xem bảng xếp hạng] | [Mở Hộp thư thầm kín]`
      });
    }

    const prompt = `Dữ liệu thời gian thực lớp 6A hiện tại:
${JSON.stringify(classContext || {}, null, 2)}

Yêu cầu/Câu hỏi từ Cô Bế Thị Oanh:
"${message}"

Hãy trả lời cô Oanh thật chu đáo, sắc bén, chuyên môn sư phạm cao, đúng chuẩn cấu trúc 5 phần đã quy định.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Không có phản hồi từ mô hình.';
    res.json({ reply });
  } catch (error: any) {
    console.error('Error generating AI response:', error);
    res.status(500).json({
      error: 'Không thể kết nối đến Trợ lý AI lúc này.',
      details: error.message,
    });
  }
});

// API endpoint to analyze a student's trend & psychological advice
app.post('/api/assistant/analyze-student', async (req, res) => {
  try {
    const { student, recentHistory } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        analysis: `Học sinh ${student.name} (STT ${student.id}) hiện có ${student.totalPoints} điểm. Cần theo dõi thêm biểu hiện nề nếp và tinh thần học tập trong tuần tới.`,
      });
    }

    const prompt = `Phân tích chuyên sâu học sinh lớp 6:
Họ và tên: ${student.name}
Số thứ tự: ${student.id}
Tổng điểm thi đua: ${student.totalPoints}
Điểm nề nếp: ${student.disciplinePoints}
Điểm học tập: ${student.academicPoints}
Điểm đạo đức/kỹ năng: ${student.moralPoints}
Xu hướng 3 phiên gần nhất: ${student.trend || 'ổn định'}
Nhật ký gần đây: ${JSON.stringify(recentHistory || [])}

Hãy đưa ra nhận định ngắn gọn (3-4 câu) gồm:
1. Đánh giá xu hướng nề nếp & học tập.
2. Lưu ý tâm lý lứa tuổi lớp 6 (11-12 tuổi).
3. Đề xuất lời khuyên cụ thể cho Cô Oanh khi trò chuyện với em hoặc phụ huynh.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.6,
      },
    });

    res.json({ analysis: response.text });
  } catch (error: any) {
    console.error('Error analyzing student:', error);
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to advise on confidential secret mailbox messages
app.post('/api/assistant/psychology-counsel', async (req, res) => {
  try {
    const { letter } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        advice: 'Lời khuyên từ Trợ lý: Hãy lắng nghe em với thái độ tôn trọng, không phán xét, tạo không gian an toàn để em giãi bày tâm tư tuổi dậy thì.',
      });
    }

    const prompt = `Cô Bế Thị Oanh vừa nhận được một lá thư trong "Hộp thư điều thầm kín" của học sinh lớp 6A:
Tiêu đề: ${letter.title}
Người gửi: ${letter.isAnonymous ? 'Ẩn danh (Học sinh lớp 6A)' : letter.senderName}
Thời gian: ${letter.timestamp}
Chủ đề: ${letter.category || 'Tâm tư'}
Nội dung thư:
"""
${letter.content}
"""

Với tư cách là Chuyên gia Tâm lý Học đường và EdTech cho cô Oanh:
1. Nhận diện cảm xúc lõi và nguy cơ tiềm ẩn (lo âu, bắt nạt, áp lực điểm số, xung đột bạn bè, tình cảm tuổi mới lớn).
2. Hướng dẫn cô Oanh cách mở lời tế nhị mà không làm em sợ hoặc xấu hổ.
3. Gợi ý 1 đoạn tin nhắn/lời nói mẫu cô Oanh có thể gửi lại cho em.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    res.json({ advice: response.text });
  } catch (error: any) {
    console.error('Error in psychology counsel:', error);
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to draft instant parent message with evidence proof
app.post('/api/assistant/draft-parent-message', async (req, res) => {
  try {
    const { studentName, actionType, points, reason, evidenceNote } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        draft: `Kính gửi Phụ huynh em ${studentName}, Cô Bế Thị Oanh (GVCN Lớp 6A - TH&THCS Đồng Tâm) xin thông báo: Hôm nay em ${studentName} đã ${actionType === 'plus' ? 'đạt thành tích tốt: ' : 'có vi phạm cần lưu ý: '}${reason} (${points > 0 ? '+' : ''}${points} điểm). Rất mong gia đình cùng đồng hành với cô giáo để hỗ trợ em. Trân trọng!`,
      });
    }

    const prompt = `Soạn tin nhắn Zalo/SMS gửi phụ huynh em ${studentName} lớp 6A (Trường PTNT TH và THCS Đồng Tâm).
GVCN: Bế Thị Oanh
Sự việc: ${actionType === 'plus' ? 'Khen thưởng / Điểm cộng' : 'Nhắc nhở nề nếp / Điểm trừ'}
Điểm số: ${points > 0 ? '+' : ''}${points} điểm
Lý do: ${reason}
Ghi chú minh chứng: ${evidenceNote || 'Có ghi chép trong sổ nhật ký lớp học'}

Yêu cầu:
- Ngôn ngữ lịch sự, ấm áp, hợp tác sư phạm ("Giáo dục bằng tình thương").
- Nêu rõ bằng chứng/lý do để phụ huynh tin tưởng.
- Độ dài vừa phải, thích hợp gửi tin nhắn Zalo.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.6,
      },
    });

    res.json({ draft: response.text });
  } catch (error: any) {
    console.error('Error drafting parent message:', error);
    res.status(500).json({ error: error.message });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();
