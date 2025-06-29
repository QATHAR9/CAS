export interface User {
  id: string;
  username: string;
  fullName: string;
  badge: string;
  department: string;
  role: 'officer' | 'detective' | 'admin' | 'supervisor';
  permissions: string[];
  avatar?: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface Criminal {
  id: string;
  caseNumber: string;
  fullName: string;
  photo?: string;
  aliases: string[];
  gender: 'male' | 'female' | 'other';
  age: number;
  dateOfBirth: string;
  height: string;
  weight: string;
  eyeColor: string;
  hairColor: string;
  distinguishingMarks: string[];
  biometrics: {
    fingerprints?: string[];
    dnaProfile?: string;
    facialRecognition?: string;
  };
  location: {
    address: string;
    coordinates?: { lat: number; lng: number };
  };
  crimeType: 'civil' | 'criminal';
  status: 'open' | 'closed' | 'pending' | 'wanted';
  dateOfArrest: string;
  description: string;
  assignedOfficer: string;
  history: CriminalHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface CriminalHistoryEntry {
  id: string;
  date: string;
  type: 'arrest' | 'conviction' | 'release' | 'transfer' | 'court_appearance';
  description: string;
  officer: string;
  location?: string;
}

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  type: 'civil' | 'criminal';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'closed' | 'pending' | 'investigation' | 'court' | 'forwarded_prosecution';
  assignedOfficer: string;
  assignedDetective?: string;
  description: string;
  location: {
    address: string;
    coordinates?: { lat: number; lng: number };
  };
  evidence: Evidence[];
  suspects: string[];
  witnesses: string[];
  timeline: CaseTimelineEntry[];
  prosecutionInfo?: ProsecutionInfo;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export interface ProsecutionInfo {
  forwardedAt: string;
  forwardedBy: string;
  prosecutionCaseId?: string;
  prosecutorAssigned?: string;
  prosecutionStatus: 'pending_review' | 'accepted' | 'rejected' | 'in_progress' | 'completed';
  prosecutionNotes?: string;
  courtDate?: string;
  lastUpdated: string;
}

export interface CaseTimelineEntry {
  id: string;
  date: string;
  type: 'created' | 'evidence_added' | 'suspect_added' | 'witness_interviewed' | 'status_changed' | 'note_added' | 'forwarded_prosecution';
  description: string;
  officer: string;
  details?: any;
}

export interface Evidence {
  id: string;
  caseId: string;
  type: 'document' | 'photo' | 'video' | 'physical' | 'digital';
  name: string;
  description: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  chainOfCustody: ChainOfCustodyEntry[];
  tags: string[];
  uploadedBy: string;
  uploadedAt: string;
  location?: string;
  isSecure: boolean;
}

export interface ChainOfCustodyEntry {
  id: string;
  officer: string;
  action: 'collected' | 'transferred' | 'analyzed' | 'stored' | 'returned';
  timestamp: string;
  location: string;
  notes?: string;
  signature?: string;
}

export interface Suspect {
  id: string;
  fullName: string;
  photo?: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  address: string;
  phone?: string;
  email?: string;
  associatedCases: string[];
  notes: string;
  status: 'active' | 'cleared' | 'wanted' | 'in_custody';
  aliases: string[];
  knownAssociates: string[];
  createdAt: string;
}

export interface Witness {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  statement: string;
  associatedCases: string[];
  reliability: 'high' | 'medium' | 'low';
  isProtected: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'case_update' | 'new_case' | 'alert' | 'reminder' | 'evidence_added' | 'court_date' | 'prosecution_update';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userFullName: string;
  action: string;
  resource: string;
  resourceId: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

export interface MapIncident {
  id: string;
  caseId?: string;
  type: 'crime' | 'patrol' | 'emergency' | 'traffic';
  severity: 'low' | 'medium' | 'high' | 'critical';
  coordinates: { lat: number; lng: number };
  address: string;
  description: string;
  timestamp: string;
  status: 'active' | 'resolved' | 'investigating';
}

export interface CrimeHotspot {
  id: string;
  coordinates: { lat: number; lng: number };
  radius: number;
  crimeType: string;
  incidentCount: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  timeframe: string;
}