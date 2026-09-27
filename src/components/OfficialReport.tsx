import React, { useRef } from 'react';
import * as XLSX from 'xlsx';
import { Student } from '../types';
import {
  Printer,
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  Building,
  GraduationCap
} from 'lucide-react';

interface OfficialReportProps {
  students: Student[];
}

export const OfficialReport: React.FC<OfficialReportProps> = ({ students }) => {
  const [copied, setCopied] = React.useState(false);

  // Compute summary stats
  const totalStudents = students.length;
  const excellentCount = students.filter((s) => s.totalPoints >= 80).length;
  const goodCount = students.filter((s) => s.totalPoints >= 65 && s.totalPoints < 80).length;
  const averageCount = students.filter((s) => s.totalPoints >= 50 && s.totalPoints < 65).length;
  const weakCount = students.filter((s) => s.totalPoints < 50).length;

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    const data = students.map((s) => {
      let rating = 'Tốt';
      if (s.totalPoints < 50) rating = 'Cần cố gắng';
      else if (s.totalPoints < 65) rating = 'Đạt';
      else if (s.totalPoints < 80) rating = 'Khá';

      return {
        'STT': s.id,
        'Họ và Tên': s.name,
        'Giới tính': s.gender,
        'Ngày sinh': s.dob,
        'Dân tộc': s.ethnic,
        'Nơi cư trú': s.address,
        'Tổ': `Tổ ${Math.ceil(s.id / 12)}`,
        'Điểm Nề nếp': s.disciplinePoints,
        'Điểm Học tập': s.academicPoints,
        'Điểm Đạo đức': s.moralPoints,
        'Tổng điểm': s.totalPoints,
        'Xếp loại': rating,
        'Ghi chú / Khen thưởng': s.notes || '',
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Auto-size columns
    const colWidths = [
      { wch: 5 }, // STT
      { wch: 20 }, // Họ tên
      { wch: 10 }, // Giới tính
      { wch: 12 }, // Ngày sinh
      { wch: 10 }, // Dân tộc
      { wch: 15 }, // Nơi cư trú
      { wch: 10 }, // Tổ
      { wch: 15 }, // Nề nếp
      { wch: 15 }, // Học tập
      { wch: 15 }, // Đạo đức
      { wch: 12 }, // Tổng điểm
      { wch: 15 }, // Xếp loại
      { wch: 30 }, // Ghi chú
    ];
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ThiDuaLop6A");
    
    XLSX.writeFile(workbook, `Bao_Cao_Thi_Dua_Lop_6A_Dong_Tam_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Control Action Bar */}
      <div className="no-print bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <span>Báo Cáo Tổng Hợp Thi Đua Lớp 6A Nộp Ban Giám Hiệu</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mẫu văn bản hành chính sư phạm chính quy của Trường PTNT TH & THCS Đồng Tâm
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportExcel}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Tệp Excel (.xlsx)</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>In Báo Cáo / Xuất PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet View */}
      <div
        id="printable-report"
        className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md text-slate-900 max-w-4xl mx-auto space-y-8"
      >
        {/* National Crest & School Header */}
        <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-300 text-center">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
              ỦY BAN NHÂN DÂN HUYỆN...
            </div>
            <div className="text-xs font-extrabold uppercase text-slate-900 mt-0.5">
              TRƯỜNG PTNT TH & THCS ĐỒNG TÂM
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Số: ... /BC-L6A</div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </div>
            <div className="text-xs font-bold text-slate-700 mt-0.5">
              Độc lập - Tự do - Hạnh phúc
            </div>
            <div className="w-24 h-0.5 bg-slate-400 mx-auto mt-1"></div>
            <div className="text-[11px] italic text-slate-500 mt-1">
              Đồng Tâm, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-1">
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
            BÁO CÁO TỔNG KẾT THI ĐUA NỀ NẾP & HỌC TẬP LỚP 6A
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-700">
            Học kỳ I • Năm học 2026 - 2027
          </p>
          <p className="text-xs text-slate-500">
            Giáo viên chủ nhiệm: <strong>Cô Bế Thị Oanh</strong> • Sĩ số: <strong>45/45 học sinh</strong>
          </p>
        </div>

        {/* Evaluation Summary Metrics */}
        <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl space-y-2 text-xs">
          <div className="font-bold uppercase text-slate-800">
            I. ĐÁNH GIÁ CHUNG VỀ TÌNH HÌNH LỚP
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-2">
            <div className="p-2 bg-white border border-slate-200 rounded-lg">
              <span className="text-slate-500 text-[10px]">Xếp Loại Tốt (≥80đ)</span>
              <div className="text-base font-bold text-emerald-700">{excellentCount} HS ({((excellentCount / 45) * 100).toFixed(1)}%)</div>
            </div>
            <div className="p-2 bg-white border border-slate-200 rounded-lg">
              <span className="text-slate-500 text-[10px]">Xếp Loại Khá (65-79đ)</span>
              <div className="text-base font-bold text-blue-700">{goodCount} HS ({((goodCount / 45) * 100).toFixed(1)}%)</div>
            </div>
            <div className="p-2 bg-white border border-slate-200 rounded-lg">
              <span className="text-slate-500 text-[10px]">Xếp Loại Đạt (50-64đ)</span>
              <div className="text-base font-bold text-amber-700">{averageCount} HS ({((averageCount / 45) * 100).toFixed(1)}%)</div>
            </div>
            <div className="p-2 bg-white border border-slate-200 rounded-lg">
              <span className="text-slate-500 text-[10px]">Cần Cố Gắng (&lt;50đ)</span>
              <div className="text-base font-bold text-rose-700">{weakCount} HS ({((weakCount / 45) * 100).toFixed(1)}%)</div>
            </div>
          </div>
          <p className="text-[11px] text-slate-600 pt-1 leading-relaxed">
            * 100% học sinh chấp hành tốt kỷ luật nội trú; các trường hợp có biến động điểm số đã được GVCN kịp thời kích hoạt thuật toán cảnh báo sớm và liên hệ trao đổi cùng gia đình.
          </p>
        </div>

        {/* Detailed 45 Students Table */}
        <div className="space-y-2 text-xs">
          <div className="font-bold uppercase text-slate-800">
            II. DANH SÁCH CHI TIẾT 45 HỌC SINH LỚP 6A
          </div>
          <div className="border border-slate-300 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 text-[11px]">
                  <th className="p-2 border-r border-slate-300 text-center w-10">STT</th>
                  <th className="p-2 border-r border-slate-300">Họ và Tên</th>
                  <th className="p-2 border-r border-slate-300 text-center w-16">Dân tộc</th>
                  <th className="p-2 border-r border-slate-300 text-center w-16">Nề nếp</th>
                  <th className="p-2 border-r border-slate-300 text-center w-16">Học tập</th>
                  <th className="p-2 border-r border-slate-300 text-center w-16">Đạo đức</th>
                  <th className="p-2 border-r border-slate-300 text-center w-16">Tổng</th>
                  <th className="p-2 border-r border-slate-300 text-center w-20">Xếp loại</th>
                  <th className="p-2">Ghi Chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[11px]">
                {students.map((s, index) => {
                  let rating = 'Tốt';
                  if (s.totalPoints < 50) rating = 'Cần cố gắng';
                  else if (s.totalPoints < 65) rating = 'Đạt';
                  else if (s.totalPoints < 80) rating = 'Khá';

                  return (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-2 border-r border-slate-200 text-center font-bold">
                        {s.id}
                      </td>
                      <td className="p-2 border-r border-slate-200 font-semibold">
                        {s.name}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-center">
                        {s.ethnic}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-center font-mono">
                        {s.disciplinePoints}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-center font-mono">
                        {s.academicPoints}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-center font-mono">
                        {s.moralPoints}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-center font-bold font-mono">
                        {s.totalPoints}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-center font-semibold">
                        <span
                          className={
                            rating === 'Tốt'
                              ? 'text-emerald-700'
                              : rating === 'Khá'
                              ? 'text-blue-700'
                              : rating === 'Đạt'
                              ? 'text-amber-700'
                              : 'text-rose-700 font-bold'
                          }
                        >
                          {rating}
                        </span>
                      </td>
                      <td className="p-2 text-slate-500 truncate max-w-[150px]">
                        {s.consecutiveDrops >= 3
                          ? '⚠️ Cảnh báo giảm 3 phiên'
                          : s.notes}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Signatures Section */}
        <div className="grid grid-cols-3 gap-4 pt-8 text-center text-xs">
          <div>
            <div className="font-bold uppercase text-slate-800">
              BAN ĐẠI DIỆN CMHS
            </div>
            <div className="italic text-slate-500 text-[10px] mt-0.5">
              (Ký và ghi rõ họ tên)
            </div>
            <div className="h-20"></div>
            <div className="font-bold text-slate-800">Dương Văn Hải</div>
          </div>

          <div>
            <div className="font-bold uppercase text-slate-800">
              BAN GIÁM HIỆU PHÊ DUYỆT
            </div>
            <div className="italic text-slate-500 text-[10px] mt-0.5">
              (Ký, đóng dấu)
            </div>
            <div className="h-20"></div>
            <div className="font-bold text-slate-800">Hiệu trưởng</div>
          </div>

          <div>
            <div className="font-bold uppercase text-slate-800">
              GIÁO VIÊN CHỦ NHIỆM
            </div>
            <div className="italic text-slate-500 text-[10px] mt-0.5">
              (Ký và ghi rõ họ tên)
            </div>
            <div className="h-20"></div>
            <div className="font-bold text-slate-800">Bế Thị Oanh</div>
          </div>
        </div>
      </div>
    </div>
  );
};
