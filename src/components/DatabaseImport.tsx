import React, { useRef, useState } from 'react';
import { Database, Upload, FileText, CheckCircle2, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import { Student } from '../types';

interface DatabaseImportProps {
  onImportSuccess: (students: Student[]) => void;
  onClose: () => void;
}

export const DatabaseImport: React.FC<DatabaseImportProps> = ({ onImportSuccess, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        await processExcel(file);
      } else if (file.name.endsWith('.docx')) {
        await processWord(file);
      } else {
        setError('Định dạng file không hỗ trợ. Vui lòng chọn file .xlsx, .xls hoặc .docx');
      }
    } catch (err) {
      console.error(err);
      setError('Đã xảy ra lỗi khi đọc file. Vui lòng kiểm tra lại cấu trúc file.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const processExcel = async (file: File) => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const json: any[] = XLSX.utils.sheet_to_json(worksheet);

    const importedStudents = json.map((row, index) => {
      // Trying to map row fields to student, assuming standard columns: Họ và tên, Giới tính
      const name = row['Họ và tên'] || row['Họ tên'] || row['Name'] || `Học sinh ${index + 1}`;
      const gender = row['Giới tính'] === 'Nữ' || row['Nữ'] ? 'Nữ' : 'Nam';
      return createNewStudent(index + 1, name, gender, index);
    });

    if (importedStudents.length > 0) {
      onImportSuccess(importedStudents);
    } else {
      setError('Không tìm thấy dữ liệu học sinh trong file Excel.');
    }
  };

  const processWord = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      // Try to convert to HTML first to parse tables easily
      const result = await mammoth.convertToHtml({ arrayBuffer: data });
      const parser = new DOMParser();
      const doc = parser.parseFromString(result.value, "text/html");
      
      const importedStudents: Student[] = [];
      const tables = doc.querySelectorAll('table');
      
      if (tables.length > 0) {
        // Parse from table
        let index = 0;
        tables.forEach(table => {
          const rows = table.querySelectorAll('tr');
          rows.forEach((row, rowIndex) => {
            if (rowIndex === 0) return; // Skip header usually
            const cells = row.querySelectorAll('td, th');
            if (cells.length >= 2) {
              // Assume first cell is STT, second is name. Or just find the cell that looks like a name
              let name = '';
              let gender: 'Nam' | 'Nữ' = 'Nam';
              
              const cellTexts = Array.from(cells).map(c => c.textContent?.trim() || '');
              
              // Find first cell that isn't just a number and has length > 3
              const nameCell = cellTexts.find(text => isNaN(Number(text)) && text.length > 3 && !text.toLowerCase().includes('họ và tên') && !text.toLowerCase().includes('stt'));
              
              if (nameCell) {
                name = nameCell;
                // Try to find gender in other cells
                if (cellTexts.some(t => t.toLowerCase() === 'nữ' || t.toLowerCase() === 'nu')) {
                  gender = 'Nữ';
                }
                importedStudents.push(createNewStudent(index + 1, name, gender, index));
                index++;
              }
            }
          });
        });
      }

      // Fallback to text parsing if no students found from table
      if (importedStudents.length === 0) {
        const rawResult = await mammoth.extractRawText({ arrayBuffer: data });
        const text = rawResult.value;
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        
        let index = 0;
        let isReadingList = false;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          
          // Match standard list format "1. Nguyen Van A" or "1 Nguyen Van A" or "- Nguyen Van A"
          const listMatch = line.match(/^(\d+[\.\-]?\s+|\-\s+)(.+)/);
          
          if (listMatch) {
            const namePart = listMatch[2].trim();
            if (namePart && namePart.length > 2 && !namePart.toLowerCase().includes('họ và tên')) {
              importedStudents.push(createNewStudent(index + 1, namePart, 'Nam', index));
              index++;
            }
          } else if (line.split(' ').length >= 2 && line.split(' ').length <= 7 && !line.toLowerCase().includes('họ và tên') && !line.match(/\d/)) {
            // Very lenient fallback: if it looks like a name (2-7 words, no numbers, no "họ và tên")
            // But only if we think we are in a list context (e.g. after finding at least one valid name, or skipping headers)
             // We just add it if it's Title Cased
             const isTitleCased = line.split(' ').every(w => w.length > 0 && w[0] === w[0].toUpperCase());
             if (isTitleCased && line.length > 5) {
               importedStudents.push(createNewStudent(index + 1, line, 'Nam', index));
               index++;
             }
          }
        }
      }

      if (importedStudents.length > 0) {
        onImportSuccess(importedStudents);
      } else {
        setError('Không thể trích xuất danh sách học sinh từ file Word. Vui lòng đảm bảo danh sách là một bảng hoặc danh sách có đánh số.');
      }
    } catch (err) {
      console.error("Word parse error:", err);
      setError('Lỗi khi đọc file Word.');
    }
  };

  const createNewStudent = (id: number, name: string, gender: "Nam" | "Nữ", index: number): Student => {
    // Determine row and col (assuming 9 columns, up to 5 rows)
    const row = Math.floor(index / 9) + 1;
    const col = (index % 9) + 1;

    return {
      id,
      name,
      gender,
      dob: '01/01/2015',
      ethnic: 'Kinh',
      avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(name)}`,
      seatRow: row,
      seatCol: col,
      parentName: 'Phụ huynh ' + name,
      parentPhone: '09xxxxxxxxx',
      address: 'Đồng Tâm',
      disciplinePoints: 40,
      academicPoints: 40,
      moralPoints: 20,
      totalPoints: 100,
      trend: 'stable',
      consecutiveDrops: 0,
      recentInfractions: {},
      badges: [],
      notes: '',
      weeklyTrendPoints: [100, 100, 100, 100, 100]
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-indigo-50/50">
          <div className="flex items-center space-x-2 text-indigo-800">
            <Database className="w-5 h-5" />
            <h3 className="font-bold text-lg">Kết nối Database</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-indigo-100 rounded-full text-indigo-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600">
            Import danh sách học sinh trực tuyến từ file Word (.docx) hoặc Excel (.xlsx, .xls) vào ứng dụng.
          </p>

          <div 
            className="border-2 border-dashed border-indigo-200 rounded-2xl p-8 text-center hover:bg-indigo-50/50 transition cursor-pointer flex flex-col items-center justify-center space-y-3"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Nhấn để chọn file</p>
              <p className="text-xs text-slate-500 mt-1">Hỗ trợ Excel và Word</p>
            </div>
          </div>
          
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx, .xls, .docx"
            className="hidden"
          />

          {isProcessing && (
            <div className="flex justify-center items-center py-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              <span className="ml-2 text-sm text-slate-600">Đang xử lý dữ liệu...</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
