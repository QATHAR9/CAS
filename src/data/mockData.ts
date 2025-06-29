import { Criminal, Case, Suspect, Witness, Notification, Evidence, AuditLogEntry, MapIncident, CrimeHotspot, User } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    fullName: 'Admin Officer',
    badge: 'ADM001',
    department: 'Administration',
    role: 'admin',
    permissions: [
      'read_dashboard',
      'read_cases',
      'write_cases',
      'delete_cases',
      'case_intake',
      'forward_prosecution',
      'read_criminals',
      'write_criminals',
      'delete_criminals',
      'read_evidence',
      'write_evidence',
      'delete_evidence',
      'read_suspects',
      'write_suspects',
      'read_map',
      'read_search',
      'read_notifications',
      'read_audit',
      'manage_users',
      'manage_roles',
      'read_settings',
      'write_settings'
    ],
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
    lastLogin: '2024-01-25T08:30:00Z',
    isActive: true
  },
  {
    id: '2',
    username: 'officer',
    fullName: 'John Smith',
    badge: 'OFF001',
    department: 'Patrol Division',
    role: 'officer',
    permissions: [
      'read_dashboard',
      'read_cases',
      'write_cases',
      'case_intake',
      'read_criminals',
      'read_evidence',
      'write_evidence',
      'read_suspects',
      'write_suspects',
      'read_map',
      'read_search',
      'read_notifications'
    ],
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
    lastLogin: '2024-01-25T09:15:00Z',
    isActive: true
  },
  {
    id: '3',
    username: 'detective',
    fullName: 'Sarah Brown',
    badge: 'DET001',
    department: 'Criminal Investigation Division',
    role: 'detective',
    permissions: [
      'read_dashboard',
      'read_cases',
      'write_cases',
      'case_intake',
      'forward_prosecution',
      'read_criminals',
      'write_criminals',
      'read_evidence',
      'write_evidence',
      'read_suspects',
      'write_suspects',
      'read_map',
      'read_search',
      'read_notifications',
      'read_audit'
    ],
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    lastLogin: '2024-01-25T07:45:00Z',
    isActive: true
  },
  {
    id: '4',
    username: 'supervisor',
    fullName: 'Michael Johnson',
    badge: 'SUP001',
    department: 'Operations',
    role: 'supervisor',
    permissions: [
      'read_dashboard',
      'read_cases',
      'write_cases',
      'case_intake',
      'forward_prosecution',
      'read_criminals',
      'write_criminals',
      'read_evidence',
      'write_evidence',
      'read_suspects',
      'write_suspects',
      'read_map',
      'read_search',
      'read_notifications',
      'read_audit',
      'read_settings'
    ],
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100',
    lastLogin: '2024-01-25T08:00:00Z',
    isActive: true
  }
];

export const mockCriminals: Criminal[] = [
  {
    id: '1',
    caseNumber: 'CR-2024-001',
    fullName: 'John Anderson',
    photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    aliases: ['Johnny A', 'J. Anderson'],
    gender: 'male',
    age: 32,
    dateOfBirth: '1992-03-15',
    height: '5\'10"',
    weight: '180 lbs',
    eyeColor: 'Brown',
    hairColor: 'Black',
    distinguishingMarks: ['Scar on left cheek', 'Tattoo on right arm'],
    biometrics: {
      fingerprints: ['fp_001', 'fp_002'],
      facialRecognition: 'fr_001'
    },
    location: {
      address: '123 Main St, Downtown',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    crimeType: 'criminal',
    status: 'open',
    dateOfArrest: '2024-01-15',
    description: 'Arrested for armed robbery at convenience store',
    assignedOfficer: 'Officer Smith',
    history: [
      {
        id: '1',
        date: '2024-01-15',
        type: 'arrest',
        description: 'Arrested for armed robbery',
        officer: 'Officer Smith',
        location: '123 Main St'
      },
      {
        id: '2',
        date: '2024-01-16',
        type: 'court_appearance',
        description: 'Initial court appearance',
        officer: 'Detective Brown'
      }
    ],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z'
  },
  {
    id: '2',
    caseNumber: 'CR-2024-002',
    fullName: 'Sarah Johnson',
    photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
    aliases: ['S. Johnson'],
    gender: 'female',
    age: 28,
    dateOfBirth: '1996-07-22',
    height: '5\'6"',
    weight: '140 lbs',
    eyeColor: 'Blue',
    hairColor: 'Blonde',
    distinguishingMarks: ['Small birthmark on neck'],
    biometrics: {},
    location: {
      address: '456 Oak Ave, Suburbs',
      coordinates: { lat: 40.7580, lng: -73.9855 }
    },
    crimeType: 'civil',
    status: 'pending',
    dateOfArrest: '2024-01-18',
    description: 'Property dispute and harassment charges',
    assignedOfficer: 'Detective Brown',
    history: [
      {
        id: '3',
        date: '2024-01-18',
        type: 'arrest',
        description: 'Arrested for harassment',
        officer: 'Detective Brown',
        location: '456 Oak Ave'
      }
    ],
    createdAt: '2024-01-18T09:15:00Z',
    updatedAt: '2024-01-20T11:45:00Z'
  }
];

export const mockEvidence: Evidence[] = [
  {
    id: '1',
    caseId: '1',
    type: 'video',
    name: 'Security Camera Footage',
    description: 'CCTV footage from store cameras showing the robbery',
    fileUrl: '/evidence/video_001.mp4',
    thumbnailUrl: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=200',
    chainOfCustody: [
      {
        id: '1',
        officer: 'Officer Smith',
        action: 'collected',
        timestamp: '2024-01-15T11:00:00Z',
        location: 'Crime Scene',
        notes: 'Collected from store security system'
      },
      {
        id: '2',
        officer: 'Evidence Tech Jones',
        action: 'stored',
        timestamp: '2024-01-15T14:00:00Z',
        location: 'Evidence Locker A-15'
      }
    ],
    tags: ['robbery', 'surveillance', 'primary'],
    uploadedBy: 'Officer Smith',
    uploadedAt: '2024-01-15T11:00:00Z',
    location: 'Evidence Locker A-15',
    isSecure: true
  },
  {
    id: '2',
    caseId: '1',
    type: 'photo',
    name: 'Crime Scene Photos',
    description: 'Photos of the convenience store after the robbery',
    fileUrl: '/evidence/photos_001.zip',
    thumbnailUrl: 'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=200',
    chainOfCustody: [
      {
        id: '3',
        officer: 'Crime Scene Tech Davis',
        action: 'collected',
        timestamp: '2024-01-15T12:30:00Z',
        location: 'Crime Scene'
      }
    ],
    tags: ['crime scene', 'photos'],
    uploadedBy: 'Crime Scene Tech Davis',
    uploadedAt: '2024-01-15T12:30:00Z',
    isSecure: true
  }
];

export const mockCases: Case[] = [
  {
    id: '1',
    caseNumber: 'CASE-2024-001',
    title: 'Downtown Convenience Store Robbery',
    type: 'criminal',
    priority: 'high',
    status: 'investigation',
    assignedOfficer: 'Officer Smith',
    assignedDetective: 'Detective Brown',
    description: 'Armed robbery at 7-Eleven on Main Street. Suspect fled on foot with approximately $300 in cash.',
    location: {
      address: '123 Main St, Downtown',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    evidence: ['1', '2'],
    suspects: ['1'],
    witnesses: ['1'],
    timeline: [
      {
        id: '1',
        date: '2024-01-15T10:00:00Z',
        type: 'created',
        description: 'Case created following robbery report',
        officer: 'Officer Smith'
      },
      {
        id: '2',
        date: '2024-01-15T11:00:00Z',
        type: 'evidence_added',
        description: 'Security footage collected',
        officer: 'Officer Smith'
      },
      {
        id: '3',
        date: '2024-01-15T14:30:00Z',
        type: 'suspect_added',
        description: 'Primary suspect identified',
        officer: 'Detective Brown'
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T14:20:00Z'
  },
  {
    id: '2',
    caseNumber: 'CASE-2024-002',
    title: 'Residential Property Dispute',
    type: 'civil',
    priority: 'medium',
    status: 'pending',
    assignedOfficer: 'Detective Brown',
    description: 'Neighbor dispute over property boundaries and noise complaints.',
    location: {
      address: '456 Oak Ave, Suburbs',
      coordinates: { lat: 40.7580, lng: -73.9855 }
    },
    evidence: [],
    suspects: ['2'],
    witnesses: ['2'],
    timeline: [
      {
        id: '4',
        date: '2024-01-18T09:00:00Z',
        type: 'created',
        description: 'Case created following complaint',
        officer: 'Detective Brown'
      }
    ],
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-20T11:45:00Z'
  },
  {
    id: '3',
    caseNumber: 'CASE-2024-003',
    title: 'Aggravated Assault Case',
    type: 'criminal',
    priority: 'urgent',
    status: 'forwarded_prosecution',
    assignedOfficer: 'Detective Brown',
    assignedDetective: 'Detective Brown',
    description: 'Serious assault case with multiple witnesses and substantial evidence.',
    location: {
      address: '789 Park Ave, Downtown',
      coordinates: { lat: 40.7589, lng: -73.9851 }
    },
    evidence: [],
    suspects: [],
    witnesses: [],
    prosecutionInfo: {
      forwardedAt: '2024-01-20T14:30:00Z',
      forwardedBy: 'Detective Brown',
      prosecutionCaseId: 'PROS-2024-001',
      prosecutorAssigned: 'ADA Jennifer Martinez',
      prosecutionStatus: 'in_progress',
      prosecutionNotes: 'Strong evidence package. Proceeding with charges.',
      courtDate: '2024-02-15T09:00:00Z',
      lastUpdated: '2024-01-22T10:15:00Z'
    },
    timeline: [
      {
        id: '5',
        date: '2024-01-18T09:00:00Z',
        type: 'created',
        description: 'Case created following assault report',
        officer: 'Detective Brown'
      },
      {
        id: '6',
        date: '2024-01-20T14:30:00Z',
        type: 'forwarded_prosecution',
        description: 'Case forwarded to prosecution office',
        officer: 'Detective Brown',
        details: { prosecutionCaseId: 'PROS-2024-001' }
      }
    ],
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-22T10:15:00Z'
  }
];

export const mockSuspects: Suspect[] = [
  {
    id: '1',
    fullName: 'John Anderson',
    photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    age: 32,
    gender: 'male',
    address: '123 Main St, Downtown',
    phone: '555-0101',
    email: 'j.anderson@email.com',
    associatedCases: ['1'],
    notes: 'Known for previous robbery charges. Has associates in local gang.',
    status: 'in_custody',
    aliases: ['Johnny A', 'J. Anderson'],
    knownAssociates: ['Mike Torres', 'Danny Rodriguez'],
    createdAt: '2024-01-15T10:30:00Z'
  }
];

export const mockWitnesses: Witness[] = [
  {
    id: '1',
    fullName: 'Robert Wilson',
    phone: '555-0201',
    email: 'robert.wilson@email.com',
    address: '125 Main St, Downtown',
    statement: 'I was walking by when I saw the suspect enter the store. He was wearing a dark hoodie and appeared nervous.',
    associatedCases: ['1'],
    reliability: 'high',
    isProtected: false,
    createdAt: '2024-01-15T12:00:00Z'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'new_case',
    title: 'New Case Assigned',
    message: 'You have been assigned to case CASE-2024-005',
    priority: 'high',
    isRead: false,
    actionUrl: '/cases/5',
    createdAt: '2024-01-25T09:00:00Z'
  },
  {
    id: '2',
    type: 'evidence_added',
    title: 'New Evidence Added',
    message: 'Evidence has been added to case CASE-2024-001',
    priority: 'medium',
    isRead: false,
    actionUrl: '/cases/1/evidence',
    createdAt: '2024-01-24T14:30:00Z'
  },
  {
    id: '3',
    type: 'court_date',
    title: 'Court Date Reminder',
    message: 'Court appearance scheduled for case CASE-2024-001 tomorrow at 9:00 AM',
    priority: 'urgent',
    isRead: false,
    actionUrl: '/cases/1',
    createdAt: '2024-01-24T16:00:00Z'
  },
  {
    id: '4',
    type: 'prosecution_update',
    title: 'Prosecution Update',
    message: 'Case CASE-2024-003 has been accepted by prosecution office',
    priority: 'medium',
    isRead: false,
    actionUrl: '/cases/3',
    createdAt: '2024-01-22T10:15:00Z'
  }
];

export const mockAuditLogs: AuditLogEntry[] = [
  {
    id: '1',
    userId: '1',
    userFullName: 'Admin Officer',
    action: 'CREATE_CASE',
    resource: 'case',
    resourceId: '1',
    details: { caseNumber: 'CASE-2024-001', title: 'Downtown Convenience Store Robbery' },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    userId: '2',
    userFullName: 'John Smith',
    action: 'VIEW_CRIMINAL_RECORD',
    resource: 'criminal',
    resourceId: '1',
    details: { caseNumber: 'CR-2024-001' },
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: '2024-01-15T11:30:00Z'
  },
  {
    id: '3',
    userId: '1',
    userFullName: 'Admin Officer',
    action: 'UPLOAD_EVIDENCE',
    resource: 'evidence',
    resourceId: '1',
    details: { fileName: 'security_footage.mp4', caseId: '1' },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: '2024-01-15T11:00:00Z'
  },
  {
    id: '4',
    userId: '3',
    userFullName: 'Sarah Brown',
    action: 'FORWARD_TO_PROSECUTION',
    resource: 'case',
    resourceId: '3',
    details: { caseNumber: 'CASE-2024-003', prosecutionCaseId: 'PROS-2024-001' },
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: '2024-01-20T14:30:00Z'
  }
];

export const mockMapIncidents: MapIncident[] = [
  {
    id: '1',
    caseId: '1',
    type: 'crime',
    severity: 'high',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    address: '123 Main St, Downtown',
    description: 'Armed robbery at convenience store',
    timestamp: '2024-01-15T10:00:00Z',
    status: 'investigating'
  },
  {
    id: '2',
    type: 'patrol',
    severity: 'low',
    coordinates: { lat: 40.7580, lng: -73.9855 },
    address: '456 Oak Ave, Suburbs',
    description: 'Routine patrol check',
    timestamp: '2024-01-25T08:30:00Z',
    status: 'resolved'
  },
  {
    id: '3',
    type: 'emergency',
    severity: 'critical',
    coordinates: { lat: 40.7505, lng: -73.9934 },
    address: '789 Broadway, Midtown',
    description: 'Domestic disturbance call',
    timestamp: '2024-01-25T09:45:00Z',
    status: 'active'
  }
];

export const mockCrimeHotspots: CrimeHotspot[] = [
  {
    id: '1',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    radius: 500,
    crimeType: 'robbery',
    incidentCount: 15,
    riskLevel: 'high',
    timeframe: 'Last 30 days'
  },
  {
    id: '2',
    coordinates: { lat: 40.7580, lng: -73.9855 },
    radius: 300,
    crimeType: 'theft',
    incidentCount: 8,
    riskLevel: 'medium',
    timeframe: 'Last 30 days'
  }
];