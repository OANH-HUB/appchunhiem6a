import { Student, SecretLetter } from '../types';

export interface AssistantChatResponse {
  reply: string;
  error?: string;
}

async function fetchGeminiWithFallback(prompt: string): Promise<string> {
  const apiKey = localStorage.getItem('gemini_api_key');
  const userModel = localStorage.getItem('gemini_selected_model') || 'gemini-3-pro-preview';
  
  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

  const fallbackModels = [
    'gemini-3-flash-preview',
    'gemini-3-pro-preview',
    'gemini-2.5-flash'
  ];
  
  // Try user selected model first, then fallbacks
  const modelsToTry = [userModel, ...fallbackModels.filter(m => m !== userModel)];
  
  let lastError: any;

  for (const model of modelsToTry) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7 }
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`${data.error?.code || response.status} ${data.error?.message || data.error?.status || 'Unknown error'}`);
      }

      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Empty response from API');
      }
    } catch (error: any) {
      console.warn(`Model ${model} failed:`, error.message);
      lastError = error;
    }
  }
  
  throw lastError;
}

export async function askAiAssistant(message: string, classContext: any): Promise<AssistantChatResponse> {
  try {
    const prompt = `Bạn là Trợ lý AI của Cô Oanh, chủ nhiệm lớp 6A.
Thông tin lớp học hiện tại:
${JSON.stringify(classContext, null, 2)}

Câu hỏi của Cô Oanh: "${message}"

Hãy trả lời ngắn gọn, chuyên nghiệp, đưa ra các phân tích sư phạm sâu sắc dựa trên dữ liệu. Trình bày bằng tiếng Việt, dùng markdown để highlight điểm quan trọng.`;
    
    const reply = await fetchGeminiWithFallback(prompt);
    return { reply };
  } catch (err: any) {
    if (err.message === 'MISSING_API_KEY') {
      return { reply: '', error: 'MISSING_API_KEY' };
    }
    console.warn('AI Assistant error:', err);
    return {
      reply: '',
      error: `Lỗi kết nối API: ${err.message}`,
    };
  }
}

export async function analyzeStudentPsychology(student: Student, recentHistory: any[]): Promise<string> {
  try {
    const prompt = `Phân tích tâm lý học sinh lớp 6A (11-12 tuổi).
Học sinh: ${student.name}
Tổng điểm: ${student.totalPoints}
Điểm nề nếp: ${student.disciplinePoints}, Điểm học tập: ${student.academicPoints}, Điểm đạo đức: ${student.moralPoints}
Vi phạm gần đây: ${JSON.stringify(student.recentInfractions)}
Xu hướng: ${student.trend === 'up' ? 'Đang tiến bộ' : student.trend === 'down' ? 'Đang sa sút' : 'Bình thường'}
Lịch sử gần đây: ${JSON.stringify(recentHistory)}

Dựa vào các dữ liệu này, hãy viết 1 đoạn ngắn (3-4 câu) nhận định tâm lý và gợi ý cách cô Oanh tiếp cận để động viên em.`;

    return await fetchGeminiWithFallback(prompt);
  } catch (err: any) {
    if (err.message === 'MISSING_API_KEY') throw err;
    return `Lỗi phân tích: ${err.message}. Học sinh ${student.name} hiện đạt ${student.totalPoints} điểm.`;
  }
}

export async function counselSecretLetter(letter: SecretLetter): Promise<string> {
  try {
    const prompt = `Một học sinh lớp 6A (giấu tên) đã gửi bức thư tâm sự sau cho Cô Oanh:
Tiêu đề: ${letter.title}
Nội dung: ${letter.content}
Tag: ${letter.category}

Dưới góc độ chuyên gia tâm lý học đường, hãy gợi ý cho Cô Oanh cách xử lý tinh tế, an toàn, và mẫu câu phản hồi ngắn gọn để trấn an học sinh này.`;

    return await fetchGeminiWithFallback(prompt);
  } catch (err: any) {
    if (err.message === 'MISSING_API_KEY') throw err;
    return `Lỗi kết nối API: ${err.message}`;
  }
}

export async function draftParentMessage(params: {
  studentName: string;
  actionType: 'plus' | 'minus';
  points: number;
  reason: string;
  evidenceNote?: string;
}): Promise<string> {
  try {
    const prompt = `Soạn 1 tin nhắn ngắn gửi phụ huynh em ${params.studentName} lớp 6A.
Sự việc: Em ${params.actionType === 'plus' ? 'đạt thành tích tốt' : 'vi phạm nề nếp'}
Lý do: ${params.reason}
Điểm thi đua: ${params.points > 0 ? '+' : ''}${params.points} điểm.
Minh chứng/Ghi chú: ${params.evidenceNote || 'Không có'}
Người gửi: Cô Bế Thị Oanh (GVCN)

Tin nhắn cần lịch sự, mang tính phối hợp giáo dục, không quá gay gắt nếu là lỗi vi phạm. (Chỉ trả về nội dung tin nhắn, không cần rào trước đón sau)`;

    return await fetchGeminiWithFallback(prompt);
  } catch (err: any) {
    if (err.message === 'MISSING_API_KEY') throw err;
    const { studentName, actionType, points, reason, evidenceNote } = params;
    return `Kính gửi Phụ huynh em ${studentName},\nCô Bế Thị Oanh (GVCN Lớp 6A) xin thông báo: Hôm nay em ${studentName} ${
      actionType === 'plus' ? 'đã đạt thành tích' : 'có vi phạm'
    }: "${reason}" (${points > 0 ? '+' : ''}${points}đ).\nGhi chú: ${evidenceNote || 'Không'}.\nTrân trọng cảm ơn!`;
  }
}
