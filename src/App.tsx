import React, { useState, useEffect } from 'react';
import {
  Student,
  ScoreItem,
  ScoreHistoryEntry,
  SecretLetter,
  FundTransaction,
  ClassMemory,
  ScoreProposal
} from './types';
import {
  INITIAL_STUDENTS,
  INITIAL_SECRET_LETTERS,
  INITIAL_FUND_TRANSACTIONS,
  INITIAL_CLASS_MEMORIES,
  DIGITAL_BADGES,
  STANDARD_SCORE_ITEMS
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { SeatingChart } from './components/SeatingChart';
import { BadgesAndLeaderboard } from './components/BadgesAndLeaderboard';
import { SecretMailbox } from './components/SecretMailbox';
import { ClassFund } from './components/ClassFund';
import { MemoryArchive } from './components/MemoryArchive';
import { OfficialReport } from './components/OfficialReport';
import { StudentModal } from './components/StudentModal';
import { ScoreActionModal } from './components/ScoreActionModal';
import { ParentNotifierModal } from './components/ParentNotifierModal';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { DatabaseImport } from './components/DatabaseImport';
import { ScoreSettingsModal } from './components/ScoreSettingsModal';
import { BulkScoreModal } from './components/BulkScoreModal';
import { ApprovalsDashboard } from './components/ApprovalsDashboard';
import { PinModal } from './components/PinModal';
import { ApiSettingsModal } from './components/ApiSettingsModal';
import { CheckCircle2, RotateCcw, Database, CalendarDays, Settings, UsersRound } from 'lucide-react';

import { useFirebaseSync } from './hooks/useFirebaseSync';

const STORAGE_KEY_STUDENTS = 'oanh_class6a_students_v1';
const STORAGE_KEY_HISTORY = 'oanh_class6a_history_v1';
const STORAGE_KEY_LETTERS = 'oanh_class6a_letters_v1';
const STORAGE_KEY_FUNDS = 'oanh_class6a_funds_v1';
const STORAGE_KEY_MEMORIES = 'oanh_class6a_memories_v1';
const STORAGE_KEY_SCORE_ITEMS = 'oanh_class6a_score_items_v1';

export default function App() {
  const [scoreItems, setScoreItems, isScoreItemsLoaded] = useFirebaseSync<ScoreItem[]>('scoreItems', (() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SCORE_ITEMS);
      return saved ? JSON.parse(saved) : STANDARD_SCORE_ITEMS;
    } catch { return STANDARD_SCORE_ITEMS; }
  })());

  const [students, setStudents, isStudentsLoaded] = useFirebaseSync<Student[]>('students', (() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDENTS);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch { return INITIAL_STUDENTS; }
  })());

  const [historyEntries, setHistoryEntries, isHistoryLoaded] = useFirebaseSync<ScoreHistoryEntry[]>('historyEntries', (() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  })());

  const [letters, setLetters, isLettersLoaded] = useFirebaseSync<SecretLetter[]>('letters', (() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LETTERS);
      return saved ? JSON.parse(saved) : INITIAL_SECRET_LETTERS;
    } catch { return INITIAL_SECRET_LETTERS; }
  })());

  const [transactions, setTransactions, isTransactionsLoaded] = useFirebaseSync<FundTransaction[]>('transactions', (() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FUNDS);
      return saved ? JSON.parse(saved) : INITIAL_FUND_TRANSACTIONS;
    } catch { return INITIAL_FUND_TRANSACTIONS; }
  })());

  const [memories, setMemories, isMemoriesLoaded] = useFirebaseSync<ClassMemory[]>('memories', (() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MEMORIES);
      return saved ? JSON.parse(saved) : INITIAL_CLASS_MEMORIES;
    } catch { return INITIAL_CLASS_MEMORIES; }
  })());

  const [activeTab, setActiveTab] = useState<string>('seating');

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [scoringStudent, setScoringStudent] = useState<{
    student: Student;
    defaultType: 'plus' | 'minus';
  } | null>(null);
  const [parentNotifyTarget, setParentNotifyTarget] = useState<{
    student: Student;
    reason?: string;
    points?: number;
    evidence?: string;
  } | null>(null);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isScoreSettingsOpen, setIsScoreSettingsOpen] = useState(false);
  const [isBulkScoreOpen, setIsBulkScoreOpen] = useState(false);
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [currentUserRole, setCurrentUserRole] = useState<'teacher' | 'monitor' | 'student'>('student');
  const [pendingRoleChange, setPendingRoleChange] = useState<'teacher' | 'monitor' | 'student' | null>(null);
  
  const [pendingProposals, setPendingProposals, isProposalsLoaded] = useFirebaseSync<ScoreProposal[]>('pendingProposals', (() => {
    try {
      const saved = localStorage.getItem('oanh_class6a_proposals_v1');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  })());

  const [pins, setPins, isPinsLoaded] = useFirebaseSync<{ teacher: string; monitor: string }>('pins', (() => {
    try {
      const saved = localStorage.getItem('oanh_class6a_pins_v1');
      return saved ? JSON.parse(saved) : { teacher: '6789', monitor: '1122' };
    } catch { return { teacher: '6789', monitor: '1122' }; }
  })());

  useEffect(() => {
    localStorage.setItem('oanh_class6a_pins_v1', JSON.stringify(pins));
  }, [pins]);

  useEffect(() => {
    localStorage.setItem('oanh_class6a_proposals_v1', JSON.stringify(pendingProposals));
  }, [pendingProposals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SCORE_ITEMS, JSON.stringify(scoreItems));
  }, [scoreItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(historyEntries));
  }, [historyEntries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LETTERS, JSON.stringify(letters));
  }, [letters]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FUNDS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MEMORIES, JSON.stringify(memories));
  }, [memories]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleResetData = () => {
    if (window.confirm('Cô Oanh có muốn khôi phục lại dữ liệu mẫu ban đầu của Lớp 6A (45 học sinh)?')) {
      setStudents(INITIAL_STUDENTS);
      setHistoryEntries([]);
      setLetters(INITIAL_SECRET_LETTERS);
      setTransactions(INITIAL_FUND_TRANSACTIONS);
      setMemories(INITIAL_CLASS_MEMORIES);
      localStorage.clear();
      showToast('Đã khôi phục dữ liệu ban đầu của Lớp 6A thành công!');
    }
  };

  const handleStartNewWeek = () => {
    if (window.confirm('Chốt tuần và Khởi tạo tuần mới? Những học sinh không vi phạm sẽ được +10đ. Sau đó tất cả sẽ được đưa về 100 điểm để bắt đầu tuần mới.')) {
      
      const timestamp = new Date().toISOString();
      const bonusEntries: ScoreHistoryEntry[] = [];
      
      setStudents(prev => prev.map(s => {
        let finalScore = s.totalPoints;
        const noInfractions = Object.keys(s.recentInfractions).length === 0;
        
        if (noInfractions) {
          finalScore += 10;
          bonusEntries.push({
            id: `bonus-${Date.now()}-${s.id}`,
            studentId: s.id,
            studentName: s.name,
            timestamp,
            pillar: 'discipline',
            actionName: 'Không vi phạm trong tuần',
            basePoints: 10,
            calculatedPoints: 10,
            multiplierReason: 'Thưởng chốt tuần',
            note: 'Tự động thưởng vì không có vi phạm nào trong tuần'
          });
        }
        
        const weeklyTrend = [...s.weeklyTrendPoints, finalScore];
        if (weeklyTrend.length > 5) weeklyTrend.shift();
        
        return {
          ...s,
          totalPoints: 100,
          disciplinePoints: 40,
          academicPoints: 40,
          moralPoints: 20,
          consecutiveDrops: 0,
          trend: 'stable',
          recentInfractions: {},
          weeklyTrendPoints: weeklyTrend
        };
      }));
      
      if (bonusEntries.length > 0) {
        setHistoryEntries(prev => [...bonusEntries, ...prev]);
      }
      
      showToast(`Đã chốt tuần! Thưởng +10đ cho ${bonusEntries.length} học sinh không vi phạm & Reset lớp về 100đ.`);
    }
  };

  const handleApplyScore = (
    studentId: number,
    item: ScoreItem,
    calculatedPoints: number,
    multiplierReason: string | undefined,
    note: string,
    evidenceUrl?: string,
    notifyParent?: boolean
  ) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    if (currentUserRole !== 'teacher') {
      const proposal: ScoreProposal = {
        id: `prop-${Date.now()}`,
        studentIds: [studentId],
        studentNames: [student.name],
        item,
        note: note || (multiplierReason ? `(${multiplierReason})` : ''),
        timestamp: new Date().toISOString(),
        proposedBy: currentUserRole === 'monitor' ? 'Lớp trưởng' : 'Tổ trưởng'
      };
      setPendingProposals(prev => [proposal, ...prev]);
      showToast(`Đã gửi đề xuất điểm thành công! Vui lòng chờ Giáo viên duyệt.`);
      return;
    }

    const newEntry: ScoreHistoryEntry = {
      id: Date.now().toString(),
      studentId,
      studentName: student.name,
      timestamp: new Date().toISOString(),
      pillar: item.pillar,
      actionName: item.name,
      basePoints: item.basePoints,
      calculatedPoints,
      multiplierReason,
      note,
      evidenceUrl,
    };

    setHistoryEntries((prev) => [newEntry, ...prev]);

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;

        const newDiscipline =
          item.pillar === 'discipline' ? s.disciplinePoints + calculatedPoints : s.disciplinePoints;
        const newAcademic =
          item.pillar === 'academic' ? s.academicPoints + calculatedPoints : s.academicPoints;
        const newMoral =
          item.pillar === 'moral' ? s.moralPoints + calculatedPoints : s.moralPoints;
        const newTotal = s.totalPoints + calculatedPoints;

        const newInfractions = { ...s.recentInfractions };
        if (calculatedPoints < 0) {
          newInfractions[item.name] = (newInfractions[item.name] || 0) + 1;
        }

        let trend = s.trend;
        let consecutiveDrops = s.consecutiveDrops;
        if (calculatedPoints > 0) {
          trend = 'up';
          consecutiveDrops = 0;
        } else if (calculatedPoints < 0) {
          trend = 'down';
          consecutiveDrops += 1;
        }

        const weeklyTrend = [...s.weeklyTrendPoints];
        weeklyTrend[weeklyTrend.length - 1] = newTotal;

        return {
          ...s,
          disciplinePoints: Math.max(0, newDiscipline),
          academicPoints: Math.max(0, newAcademic),
          moralPoints: Math.max(0, newMoral),
          totalPoints: Math.max(0, newTotal),
          trend,
          consecutiveDrops,
          recentInfractions: newInfractions,
          weeklyTrendPoints: weeklyTrend,
        };
      })
    );

    showToast(
      `Đã ${calculatedPoints > 0 ? 'cộng' : 'trừ'} ${Math.abs(calculatedPoints)}đ cho em ${student.name}${
        multiplierReason ? ` (${multiplierReason})` : ''
      }`
    );

    if (notifyParent) {
      setParentNotifyTarget({
        student,
        reason: item.name,
        points: calculatedPoints,
        evidence: note || 'Nhật ký thi đua Lớp 6A',
      });
    }
  };

  const handleApplyBulkScore = (
    studentIds: number[],
    item: ScoreItem,
    note: string
  ) => {
    if (currentUserRole !== 'teacher') {
      const proposal: ScoreProposal = {
        id: `prop-${Date.now()}`,
        studentIds,
        studentNames: students.filter(s => studentIds.includes(s.id)).map(s => s.name),
        item,
        note,
        timestamp: new Date().toISOString(),
        proposedBy: currentUserRole === 'monitor' ? 'Lớp trưởng' : 'Tổ trưởng'
      };
      setPendingProposals(prev => [proposal, ...prev]);
      showToast(`Đã gửi đề xuất điểm đồng loạt thành công! Vui lòng chờ Giáo viên duyệt.`);
      return;
    }

    const timestamp = new Date().toISOString();
    const newEntries: ScoreHistoryEntry[] = [];
    
    setStudents(prev => prev.map(s => {
      if (!studentIds.includes(s.id)) return s;
      
      const calculatedPoints = item.basePoints; // Simple mode, no multiplier logic for bulk to avoid complexity

      const newDiscipline = item.pillar === 'discipline' ? s.disciplinePoints + calculatedPoints : s.disciplinePoints;
      const newAcademic = item.pillar === 'academic' ? s.academicPoints + calculatedPoints : s.academicPoints;
      const newMoral = item.pillar === 'moral' ? s.moralPoints + calculatedPoints : s.moralPoints;
      const newTotal = s.totalPoints + calculatedPoints;

      const newInfractions = { ...s.recentInfractions };
      if (calculatedPoints < 0) {
        newInfractions[item.name] = (newInfractions[item.name] || 0) + 1;
      }

      let trend = s.trend;
      let consecutiveDrops = s.consecutiveDrops;
      if (calculatedPoints > 0) {
        trend = 'up';
        consecutiveDrops = 0;
      } else if (calculatedPoints < 0) {
        trend = 'down';
        consecutiveDrops += 1;
      }

      const weeklyTrend = [...s.weeklyTrendPoints];
      weeklyTrend[weeklyTrend.length - 1] = newTotal;

      newEntries.push({
        id: `bulk-${Date.now()}-${s.id}`,
        studentId: s.id,
        studentName: s.name,
        timestamp,
        pillar: item.pillar,
        actionName: item.name,
        basePoints: item.basePoints,
        calculatedPoints,
        note,
      });

      return {
        ...s,
        disciplinePoints: Math.max(0, newDiscipline),
        academicPoints: Math.max(0, newAcademic),
        moralPoints: Math.max(0, newMoral),
        totalPoints: Math.max(0, newTotal),
        trend,
        consecutiveDrops,
        recentInfractions: newInfractions,
        weeklyTrendPoints: weeklyTrend,
      };
    }));

    setHistoryEntries(prev => [...newEntries, ...prev]);
    showToast(`Đã áp dụng điểm cho ${studentIds.length} học sinh thành công!`);
  };

  const handleUndoScore = (historyId: string) => {
    const entry = historyEntries.find(e => e.id === historyId);
    if (!entry) return;

    if (!window.confirm(`Bạn có chắc muốn hoàn tác lượt ${entry.calculatedPoints > 0 ? 'cộng' : 'trừ'} ${Math.abs(entry.calculatedPoints)}đ của học sinh ${entry.studentName}?`)) return;

    // Remove from history
    setHistoryEntries(prev => prev.filter(e => e.id !== historyId));

    // Revert points on student
    setStudents(prev => prev.map(s => {
      if (s.id !== entry.studentId) return s;

      // Reverse points
      const newDiscipline = entry.pillar === 'discipline' ? s.disciplinePoints - entry.calculatedPoints : s.disciplinePoints;
      const newAcademic = entry.pillar === 'academic' ? s.academicPoints - entry.calculatedPoints : s.academicPoints;
      const newMoral = entry.pillar === 'moral' ? s.moralPoints - entry.calculatedPoints : s.moralPoints;
      const newTotal = s.totalPoints - entry.calculatedPoints;

      // Reverse infractions count if it was a penalty
      const newInfractions = { ...s.recentInfractions };
      if (entry.calculatedPoints < 0 && newInfractions[entry.actionName]) {
        newInfractions[entry.actionName] = Math.max(0, newInfractions[entry.actionName] - 1);
        if (newInfractions[entry.actionName] === 0) {
          delete newInfractions[entry.actionName];
        }
      }

      const weeklyTrend = [...s.weeklyTrendPoints];
      weeklyTrend[weeklyTrend.length - 1] = newTotal;

      return {
        ...s,
        disciplinePoints: Math.max(0, newDiscipline),
        academicPoints: Math.max(0, newAcademic),
        moralPoints: Math.max(0, newMoral),
        totalPoints: Math.max(0, newTotal),
        recentInfractions: newInfractions,
        weeklyTrendPoints: weeklyTrend,
      };
    }));

    showToast(`Đã hoàn tác thao tác điểm của em ${entry.studentName}`);
  };

  const handleApproveProposal = (proposalId: string) => {
    const proposal = pendingProposals.find(p => p.id === proposalId);
    if (!proposal) return;

    // Temporary set role to teacher so handleApplyBulkScore processes it directly
    const prevRole = currentUserRole;
    setCurrentUserRole('teacher');

    handleApplyBulkScore(proposal.studentIds, proposal.item, proposal.note);

    setCurrentUserRole(prevRole);
    setPendingProposals(prev => prev.filter(p => p.id !== proposalId));
  };

  const handleRejectProposal = (proposalId: string) => {
    setPendingProposals(prev => prev.filter(p => p.id !== proposalId));
    showToast('Đã từ chối đề xuất điểm.');
  };

  const handleToggleBadge = (studentId: number, badgeId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const has = s.badges.includes(badgeId);
        const newBadges = has ? s.badges.filter((b) => b !== badgeId) : [...s.badges, badgeId];
        return { ...s, badges: newBadges };
      })
    );
    const badge = DIGITAL_BADGES.find((b) => b.id === badgeId);
    showToast(`Đã cập nhật huy hiệu "${badge?.title}" cho học sinh!`);
  };

  const handleUpdateLetter = (updated: SecretLetter) => {
    setLetters((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    showToast('Đã lưu phản hồi cho bức thư thầm kín!');
  };

  const handleAddNewLetter = (letterData: Omit<SecretLetter, 'id' | 'timestamp' | 'isRead'>) => {
    const newLetter: SecretLetter = {
      ...letterData,
      id: `letter-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      isRead: false,
    };
    setLetters((prev) => [newLetter, ...prev]);
    showToast('Đã tiếp nhận thư mới vào Hộp thư thầm kín 6A!');
  };

  const handleAddTransaction = (trans: Omit<FundTransaction, 'id'>) => {
    const newTrans: FundTransaction = {
      ...trans,
      id: `ft-${Date.now()}`,
    };
    setTransactions((prev) => [newTrans, ...prev]);
    showToast(`Đã ghi sổ phiếu ${trans.type === 'thu' ? 'Thu' : 'Chi'} thành công!`);
  };

  const handleAddMemory = (memoryData: Omit<ClassMemory, 'id'>) => {
    const newMem: ClassMemory = {
      ...memoryData,
      id: `mem-${Date.now()}`,
    };
    setMemories((prev) => [newMem, ...prev]);
    showToast('Đã lưu khoảnh khắc kỷ niệm mới của Lớp 6A!');
  };

  const handleExecuteCommand = (cmd: string) => {
    setIsAiDrawerOpen(false);
    const lower = cmd.toLowerCase();
    if (lower.includes('sơ đồ') || lower.includes('lớp')) {
      setActiveTab('seating');
    } else if (lower.includes('bảng xếp hạng') || lower.includes('thi đua') || lower.includes('huy hiệu')) {
      setActiveTab('leaderboard');
    } else if (lower.includes('thầm kín') || lower.includes('hộp thư')) {
      setActiveTab('secret-mailbox');
    } else if (lower.includes('quỹ')) {
      setActiveTab('fund');
    } else if (lower.includes('báo cáo') || lower.includes('pdf') || lower.includes('excel')) {
      setActiveTab('report');
    } else if (lower.includes('kỷ niệm')) {
      setActiveTab('memories');
    } else {
      showToast(`Đã nhận lệnh: ${cmd}`);
    }
  };

  const handleImportSuccess = (importedStudents: Student[]) => {
    setStudents(importedStudents);
    setIsImportOpen(false);
    showToast(`Đã import thành công ${importedStudents.length} học sinh từ database!`);
  };

  const unreadLettersCount = letters.filter((l) => !l.isRead).length;
  const warningStudentsCount = students.filter((s) => s.consecutiveDrops >= 3).length;
  const averageScore =
    students.reduce((sum, s) => sum + s.totalPoints, 0) / (students.length || 1);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAiDrawer={() => setIsAiDrawerOpen(true)}
        onOpenBulkScore={() => setIsBulkScoreOpen(true)}
        unreadLettersCount={unreadLettersCount}
        warningStudentsCount={warningStudentsCount}
        averageScore={averageScore}
        currentUserRole={currentUserRole}
        onChangeRole={(role) => {
          if (role === 'teacher' || role === 'monitor') {
            setPendingRoleChange(role);
          } else {
            setCurrentUserRole(role);
            if (activeTab === 'fund' || activeTab === 'report' || activeTab === 'approvals') {
              setActiveTab('seating');
            }
          }
        }}
        pendingProposalsCount={pendingProposals.length}
        onOpenApiSettings={() => setIsApiSettingsOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'seating' && (
          <SeatingChart
            students={students}
            onSelectStudent={(student) => setSelectedStudent(student)}
            onOpenScoreModal={(student, defaultType = 'plus') =>
              setScoringStudent({ student, defaultType })
            }
            onOpenParentNotify={(student) =>
              setParentNotifyTarget({ student })
            }
          />
        )}

        {activeTab === 'leaderboard' && (
          <BadgesAndLeaderboard
            students={students}
            onSelectStudent={(student) => setSelectedStudent(student)}
            onOpenScoreModal={(student, defaultType = 'plus') =>
              setScoringStudent({ student, defaultType })
            }
            onOpenParentNotify={(student) =>
              setParentNotifyTarget({ student })
            }
            onAwardBadge={(studentId, badgeId) =>
              handleToggleBadge(studentId, badgeId)
            }
          />
        )}

        {activeTab === 'secret-mailbox' && (
          <SecretMailbox
            letters={letters}
            onUpdateLetter={handleUpdateLetter}
            onAddNewLetter={handleAddNewLetter}
          />
        )}

        {activeTab === 'fund' && (
          <ClassFund
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
          />
        )}

        {activeTab === 'memories' && (
          <MemoryArchive
            memories={memories}
            onAddMemory={handleAddMemory}
          />
        )}

        {activeTab === 'report' && <OfficialReport students={students} />}

        {activeTab === 'approvals' && (
          <ApprovalsDashboard
            proposals={pendingProposals}
            onApprove={handleApproveProposal}
            onReject={handleRejectProposal}
          />
        )}
      </main>

      {selectedStudent && (
        <StudentModal
          student={selectedStudent}
          historyEntries={historyEntries}
          onClose={() => setSelectedStudent(null)}
          onOpenScoreModal={(s, defType = 'plus') => {
            setSelectedStudent(null);
            setScoringStudent({ student: s, defaultType: defType });
          }}
          onOpenParentNotify={(s) => {
            setSelectedStudent(null);
            setParentNotifyTarget({ student: s });
          }}
          onToggleBadge={handleToggleBadge}
          onUndoScore={handleUndoScore}
        />
      )}

      {scoringStudent && (
        <ScoreActionModal
          student={scoringStudent.student}
          defaultType={scoringStudent.defaultType}
          scoreItems={scoreItems}
          onClose={() => setScoringStudent(null)}
          onApplyScore={handleApplyScore}
          currentUserRole={currentUserRole}
        />
      )}

      {parentNotifyTarget && (
        <ParentNotifierModal
          student={parentNotifyTarget.student}
          defaultReason={parentNotifyTarget.reason}
          defaultPoints={parentNotifyTarget.points}
          defaultEvidence={parentNotifyTarget.evidence}
          onClose={() => setParentNotifyTarget(null)}
          onSendSuccess={() =>
            showToast(
              `Đã gửi thông báo thành công đến phụ huynh em ${parentNotifyTarget.student.name}!`
            )
          }
        />
      )}

      <AiAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        students={students}
        letters={letters}
        transactions={transactions}
        onExecuteCommand={handleExecuteCommand}
      />
      
      {isImportOpen && (
        <DatabaseImport 
          onImportSuccess={handleImportSuccess}
          onClose={() => setIsImportOpen(false)}
        />
      )}

      {isBulkScoreOpen && (
        <BulkScoreModal
          students={students}
          scoreItems={scoreItems}
          onClose={() => setIsBulkScoreOpen(false)}
          onApplyBulkScore={handleApplyBulkScore}
          currentUserRole={currentUserRole}
        />
      )}

      {isScoreSettingsOpen && (
        <ScoreSettingsModal
          scoreItems={scoreItems}
          onSave={setScoreItems}
          onClose={() => setIsScoreSettingsOpen(false)}
          pins={pins}
          onSavePins={setPins}
        />
      )}

      {isApiSettingsOpen && (
        <ApiSettingsModal onClose={() => setIsApiSettingsOpen(false)} />
      )}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <footer className="no-print border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">
              Lớp 6A • Trường PTNT TH & THCS Đồng Tâm
            </span>
            <span>•</span>
            <span>GVCN: Cô Bế Thị Oanh</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="italic">"Quản trị bằng dữ liệu - Giáo dục bằng tình thương"</span>
            
            <button
              onClick={handleStartNewWeek}
              className="hover:text-emerald-600 transition flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md"
              title="Bắt đầu tuần mới (100 điểm)"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Tuần mới</span>
            </button>

            <button
              onClick={() => setIsImportOpen(true)}
              className="hover:text-indigo-600 transition flex items-center gap-1 font-semibold"
              title="Kết nối database trực tuyến (Word, Excel)"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Import Data</span>
            </button>
            <button
              onClick={() => setIsScoreSettingsOpen(true)}
              className="hover:text-indigo-600 transition flex items-center gap-1 font-semibold"
              title="Cấu hình điểm thi đua"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Cấu hình</span>
            </button>
            
            <button
              onClick={handleResetData}
              className="hover:text-indigo-600 transition flex items-center gap-1 font-semibold"
              title="Đặt lại dữ liệu ban đầu"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục mẫu</span>
            </button>
          </div>
        </div>
      </footer>

      {pendingRoleChange && (
        <PinModal
          targetRole={pendingRoleChange}
          expectedPin={pendingRoleChange === 'teacher' ? pins.teacher : pins.monitor}
          onClose={() => setPendingRoleChange(null)}
          onSuccess={() => {
            setCurrentUserRole(pendingRoleChange);
            if (pendingRoleChange !== 'teacher' && activeTab === 'approvals') {
              setActiveTab('seating');
            }
            if ((pendingRoleChange === 'student' || pendingRoleChange === 'monitor') && (activeTab === 'fund' || activeTab === 'report')) {
              setActiveTab('seating');
            }
            setPendingRoleChange(null);
            showToast(`Đã xác thực quyền: ${pendingRoleChange === 'teacher' ? 'Giáo viên' : 'Cán sự'}`);
          }}
        />
      )}
    </div>
  );
}

