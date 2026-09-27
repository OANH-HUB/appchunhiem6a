export type PillarType = 'discipline' | 'academic' | 'moral';

export interface ScoreItem {
  id: string;
  name: string;
  pillar: PillarType;
  basePoints: number; // Positive for rewards, negative for penalties
  isKindnessBonus?: boolean; // Eligible for 2x kindness bonus
  description: string;
}

export interface ScoreHistoryEntry {
  id: string;
  studentId: number;
  studentName: string;
  timestamp: string; // ISO string
  pillar: PillarType;
  actionName: string;
  basePoints: number;
  calculatedPoints: number;
  multiplierReason?: string; // e.g. "Lỗi lặp lại lần 2 (x2)", "Hành động tử tế đột xuất (x2)"
  note?: string;
  evidenceUrl?: string;
}

export interface DigitalBadge {
  id: string;
  name: string;
  title: string;
  description: string;
  iconName: string;
  color: string;
  criteria: string;
}

export interface Student {
  id: number; // 1 to 45
  name: string;
  gender: 'Nam' | 'Nữ';
  dob: string;
  ethnic: string; // Tày, Nùng, Dao, Kinh, H'Mông...
  avatar: string;
  seatRow: number; // 1 to 5
  seatCol: number; // 1 to 9
  parentName: string;
  parentPhone: string;
  address: string;
  disciplinePoints: number; // Nề nếp
  academicPoints: number;   // Học tập
  moralPoints: number;      // Đạo đức - Kỹ năng
  totalPoints: number;
  trend: 'up' | 'down' | 'stable';
  consecutiveDrops: number; // When >= 3, early warning triggers!
  recentInfractions: { [actionName: string]: number }; // Count of infraction this week
  badges: string[]; // Badge IDs
  notes: string;
  weeklyTrendPoints: number[]; // points over last 5 weeks
}

export interface SecretLetter {
  id: string;
  senderId?: number; // Optional if not anonymous
  senderName: string;
  isAnonymous: boolean;
  timestamp: string;
  title: string;
  content: string;
  category: 'Tâm tư tuổi dậy thì' | 'Áp lực học tập' | 'Quan hệ bạn bè' | 'Gia đình' | 'Khác';
  isRead: boolean;
  teacherResponse?: string;
  aiAdvice?: string;
}

export interface FundTransaction {
  id: string;
  date: string;
  type: 'thu' | 'chi';
  amount: number;
  category: string;
  description: string;
  handler: string; // e.g. "Ban đại diện CMHS" / "Cô Oanh"
  receiptNo?: string;
}

export interface ClassMemory {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  caption: string;
  tag: string;
}

export type UserRole = 'teacher' | 'monitor' | 'student';

export interface ScoreProposal {
  id: string;
  studentIds: number[];
  studentNames: string[];
  item: ScoreItem;
  note: string;
  timestamp: string;
  proposedBy: string;
}
