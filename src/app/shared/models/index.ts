// ── User / Auth ──────────────────────────────────────────────
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  role: 'citizen' | 'admin';
  verified: boolean;
  createdAt: string;
}

export interface LoginPayload {
  identifier: string; // mobile or employee ID
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
}

// ── Issues / Applications ─────────────────────────────────────
export type IssueStatus = 'applied' | 'pending' | 'working' | 'verify' | 'completed';

export interface TimelineEntry {
  time: string;
  message: string;
  actor: 'citizen' | 'admin';
}

export interface Issue {
  id: number;
  appId: string;
  userId: string;
  userName: string;
  userMobile: string;
  service: string;
  type: string;
  description: string;
  district: string;
  aadhaar?: string;
  fileName: string;
  status: IssueStatus;
  adminNote: string;
  submittedAt: string;
  updatedAt: string;
  timeline: TimelineEntry[];
}

// ── Service Definitions ───────────────────────────────────────
export interface GovService {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  subServices: string[];
}

export const DISTRICTS = [
  'Chennai','Coimbatore','Madurai','Tiruchirappalli','Salem',
  'Tirunelveli','Vellore','Erode','Thoothukudi','Dindigul',
  'Thanjavur','Kanchipuram','Cuddalore','Villupuram','Nagapattinam',
  'Tiruvarur','Pudukkottai','Sivaganga','Virudhunagar','Ramanathapuram',
  'Tiruppur','Krishnagiri','Dharmapuri','Perambalur','Ariyalur',
  'Namakkal','Karur','Tiruvannamalai','Kallakurichi','Ranipet',
  'Chengalpattu','Tenkasi','Tirupathur','Mayiladuthurai',
];

export const GOV_SERVICES: GovService[] = [
  {
    id: 'aadhaar', title: 'Aadhaar Services', description: 'Name, address, DOB corrections',
    icon: '🪪', color: '#dbeafe',
    subServices: ['Name Change','Address Update','Date of Birth Correction','Mobile Number Update','Aadhaar Reprint','Photo Update'],
  },
  {
    id: 'ration', title: 'Ration Card', description: 'New card, corrections, member add/remove',
    icon: '🍚', color: '#fce7f3',
    subServices: ['New Ration Card','Member Addition','Member Removal','Address Change','Card Correction','Lost Card Reissue'],
  },
  {
    id: 'voter', title: 'Voter ID', description: 'Registration, corrections, address change',
    icon: '🗳', color: '#d1fae5',
    subServices: ['New Voter Registration','Name Correction','Address Change','Photo Change','Deletion of Voter','Voter Card Reprint'],
  },
  {
    id: 'patta', title: 'Patta & Chitta', description: 'Land ownership, patta, chitta records',
    icon: '📜', color: '#fef3c7',
    subServices: ['New Patta Request','Patta Transfer','Chitta Records','Land Survey Records','EC Application','Poramboke Verification'],
  },
  {
    id: 'ec', title: 'Encumbrance Certificate', description: 'EC for land & property',
    icon: '🏠', color: '#ede9fe',
    subServices: ['EC Application','EC Correction','Duplicate EC'],
  },
  {
    id: 'birth', title: 'Birth Certificate', description: 'New issuance, correction, duplicate',
    icon: '👶', color: '#ccfbf1',
    subServices: ['New Birth Certificate','Name Addition','Correction','Duplicate Copy'],
  },
  {
    id: 'death', title: 'Death Certificate', description: 'Registration, correction, duplicate',
    icon: '📋', color: '#f1f5f9',
    subServices: ['New Death Certificate','Correction','Duplicate Copy'],
  },
  {
    id: 'dl', title: 'Driving Licence', description: 'New licence, renewal, correction',
    icon: '🚗', color: '#e0e7ff',
    subServices: ['New DL Application','DL Renewal','Address Change','Name Correction','Duplicate DL'],
  },
  {
    id: 'health', title: 'Health Card', description: 'CM Insurance, Ayushman Bharat',
    icon: '🏥', color: '#dcfce7',
    subServices: ['New CM Health Card','Family Member Addition','Card Correction','Duplicate Card'],
  },
  {
    id: 'scholarship', title: 'Scholarship', description: 'BC/MBC/SC/ST scholarships',
    icon: '🎓', color: '#fef9c3',
    subServices: ['New Application','Status Inquiry','Correction','Renewal'],
  },
  {
    id: 'tneb', title: 'TNEB / Electricity', description: 'New connection, bill complaints',
    icon: '⚡', color: '#fef3c7',
    subServices: ['New Connection','Bill Complaint','Meter Fault','Disconnection Issue','Tariff Query'],
  },
  {
    id: 'water', title: 'Water & Sewage', description: 'CMWSSB/TWAD connections, complaints',
    icon: '💧', color: '#dbeafe',
    subServices: ['New Connection','Leak Complaint','Bill Issue','Disconnection Protest','Sewage Problem'],
  },
];
