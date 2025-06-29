import React, { useState, useRef } from 'react';
import { 
  ArrowLeft,
  Edit,
  Save,
  Plus,
  Trash2,
  Upload,
  Download,
  Eye,
  User,
  Users,
  Camera,
  FileText,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Shield,
  Send,
  ExternalLink,
  Tag,
  Paperclip,
  MessageSquare,
  Activity,
  Gavel,
  Home,
  CreditCard,
  Scale,
  Building,
  UserCheck,
  FileSearch,
  Handshake
} from 'lucide-react';
import { Case, Evidence, Suspect, Witness } from '../../types';
import { mockCases, mockEvidence, mockUsers } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

interface CaseDetailsProps {
  caseId: string;
  onBack: () => void;
}

const CaseDetails: React.FC<CaseDetailsProps> = ({ caseId, onBack }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [caseData, setCaseData] = useState<Case | null>(
    mockCases.find(c => c.id === caseId) || null
  );
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states for different tabs
  const [evidenceForm, setEvidenceForm] = useState({
    name: '',
    type: 'photo' as 'photo' | 'video' | 'document' | 'physical' | 'digital',
    description: '',
    location: '',
    tags: '',
    files: [] as File[]
  });

  const [suspectForm, setSuspectForm] = useState({
    fullName: '',
    age: '',
    gender: 'male' as 'male' | 'female' | 'other',
    address: '',
    phone: '',
    email: '',
    status: 'active' as 'active' | 'cleared' | 'wanted' | 'in_custody',
    notes: ''
  });

  const [witnessForm, setWitnessForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    statement: '',
    reliability: 'medium' as 'high' | 'medium' | 'low',
    isProtected: false
  });

  const [timelineEntry, setTimelineEntry] = useState({
    description: '',
    type: 'note_added' as any
  });

  // Civil case specific forms
  const [civilPartiesForm, setCivilPartiesForm] = useState({
    complainant: {
      name: '',
      contact: '',
      address: '',
      relationship: 'complainant'
    },
    respondent: {
      name: '',
      contact: '',
      address: '',
      relationship: 'respondent'
    }
  });

  const [mediationForm, setMediationForm] = useState({
    mediatorAssigned: '',
    sessionDate: '',
    outcome: '',
    agreementReached: false,
    followUpRequired: false,
    notes: ''
  });

  if (!caseData) {
    return (
      <div className="p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Case not found</p>
        <button
          onClick={onBack}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          Go back
        </button>
      </div>
    );
  }

  // Dynamic tabs based on case type
  const getTabsForCaseType = () => {
    const commonTabs = [
      { id: 'overview', label: 'Overview', icon: FileText, required: true },
      { id: 'timeline', label: 'Timeline', icon: Clock, required: false },
      { id: 'evidence', label: 'Evidence', icon: Camera, required: true },
      { id: 'documents', label: 'Documents', icon: Paperclip, required: false },
      { id: 'notes', label: 'Notes', icon: MessageSquare, required: false }
    ];

    if (caseData.type === 'criminal') {
      return [
        ...commonTabs.slice(0, 3), // overview, timeline, evidence
        { id: 'suspects', label: 'Suspects', icon: Users, required: true },
        { id: 'witnesses', label: 'Witnesses', icon: User, required: true },
        { id: 'charges', label: 'Charges', icon: Scale, required: true },
        ...commonTabs.slice(3) // documents, notes
      ];
    } else {
      return [
        ...commonTabs.slice(0, 3), // overview, timeline, evidence
        { id: 'parties', label: 'Parties Involved', icon: Users, required: true },
        { id: 'mediation', label: 'Mediation', icon: Handshake, required: false },
        { id: 'resolution', label: 'Resolution', icon: CheckCircle, required: false },
        ...commonTabs.slice(3) // documents, notes
      ];
    }
  };

  const tabs = getTabsForCaseType();

  const hasPermission = (permission: string) => {
    if (!user || !user.permissions || !Array.isArray(user.permissions)) {
      return false;
    }
    return user.permissions.includes(permission) || user.permissions.includes('all');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setEvidenceForm(prev => ({ ...prev, files: [...prev.files, ...files] }));
    }
  };

  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const colors = {
      open: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      investigation: 'bg-blue-100 text-blue-800',
      court: 'bg-purple-100 text-purple-800',
      forwarded_prosecution: 'bg-orange-100 text-orange-800'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    );
  };

  const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Case Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{caseData.title}</h2>
            <p className="text-gray-600 mt-1">Case #{caseData.caseNumber}</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <StatusBadge status={caseData.status} />
            <PriorityBadge priority={caseData.priority} />
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              caseData.type === 'criminal' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {caseData.type.charAt(0).toUpperCase() + caseData.type.slice(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Case Information</h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Type:</span> {caseData.type}</p>
              <p><span className="font-medium">Created:</span> {new Date(caseData.createdAt).toLocaleDateString()}</p>
              <p><span className="font-medium">Updated:</span> {new Date(caseData.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Assignment</h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Officer:</span> {caseData.assignedOfficer}</p>
              {caseData.assignedDetective && (
                <p><span className="font-medium">Detective:</span> {caseData.assignedDetective}</p>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
            <div className="flex items-start">
              <MapPin className="h-4 w-4 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">{caseData.location.address}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Statistics</h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Evidence:</span> {caseData.evidence.length} items</p>
              <p><span className="font-medium">Suspects:</span> {caseData.suspects.length}</p>
              <p><span className="font-medium">Witnesses:</span> {caseData.witnesses.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Case Description */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Case Description</h3>
        <p className="text-gray-700 leading-relaxed">{caseData.description}</p>
      </div>

      {/* Prosecution Status */}
      {caseData.prosecutionInfo && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Send className="h-5 w-5 mr-2 text-orange-600" />
            Prosecution Status
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Case Information</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Prosecution ID:</span> {caseData.prosecutionInfo.prosecutionCaseId}</p>
                <p><span className="font-medium">Forwarded By:</span> {caseData.prosecutionInfo.forwardedBy}</p>
                <p><span className="font-medium">Date:</span> {new Date(caseData.prosecutionInfo.forwardedAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Status</h4>
              <div className="space-y-2">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {caseData.prosecutionInfo.prosecutionStatus.replace('_', ' ').toUpperCase()}
                </span>
                {caseData.prosecutionInfo.prosecutorAssigned && (
                  <p className="text-sm"><span className="font-medium">Prosecutor:</span> {caseData.prosecutionInfo.prosecutorAssigned}</p>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Court Date</h4>
              {caseData.prosecutionInfo.courtDate ? (
                <p className="text-sm">{new Date(caseData.prosecutionInfo.courtDate).toLocaleDateString()}</p>
              ) : (
                <p className="text-sm text-gray-500">Not scheduled</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group">
            <div className="text-center">
              <Camera className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2" />
              <p className="font-medium text-gray-700 group-hover:text-blue-700 text-sm">Add Evidence</p>
            </div>
          </button>
          
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group">
            <div className="text-center">
              <Users className="h-8 w-8 text-gray-400 group-hover:text-green-500 mx-auto mb-2" />
              <p className="font-medium text-gray-700 group-hover:text-green-700 text-sm">Add {caseData.type === 'criminal' ? 'Suspect' : 'Party'}</p>
            </div>
          </button>
          
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors group">
            <div className="text-center">
              <User className="h-8 w-8 text-gray-400 group-hover:text-purple-500 mx-auto mb-2" />
              <p className="font-medium text-gray-700 group-hover:text-purple-700 text-sm">Add Witness</p>
            </div>
          </button>
          
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors group">
            <div className="text-center">
              <MessageSquare className="h-8 w-8 text-gray-400 group-hover:text-orange-500 mx-auto mb-2" />
              <p className="font-medium text-gray-700 group-hover:text-orange-700 text-sm">Add Note</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderEvidenceTab = () => (
    <div className="space-y-6">
      {/* Add Evidence Form */}
      {hasPermission('write_evidence') && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Evidence</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Evidence Name *</label>
              <input
                type="text"
                value={evidenceForm.name}
                onChange={(e) => setEvidenceForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter evidence name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={evidenceForm.type}
                onChange={(e) => setEvidenceForm(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="photo">Photo</option>
                <option value="video">Video</option>
                <option value="document">Document</option>
                <option value="physical">Physical</option>
                <option value="digital">Digital</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={3}
                value={evidenceForm.description}
                onChange={(e) => setEvidenceForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Detailed description of the evidence"
              />
            </div>
          </div>

          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 mb-2">Drop files here or click to upload</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Choose Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  const files = Array.from(e.target.files);
                  setEvidenceForm(prev => ({ ...prev, files: [...prev.files, ...files] }));
                }
              }}
            />
          </div>

          <div className="flex justify-end mt-4">
            <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <Plus className="h-4 w-4" />
              <span>Add Evidence</span>
            </button>
          </div>
        </div>
      )}

      {/* Evidence List */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Evidence Items ({caseData.evidence.length})</h3>
        
        {caseData.evidence.length === 0 ? (
          <div className="text-center py-8">
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No evidence uploaded yet</p>
            <p className="text-sm text-gray-400 mt-1">Evidence is required for case completion</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockEvidence.filter(e => caseData.evidence.includes(e.id)).map((evidence) => (
              <div key={evidence.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {evidence.type.toUpperCase()}
                  </span>
                  <div className="flex space-x-1">
                    <button className="p-1 text-gray-600 hover:text-blue-600">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-600 hover:text-green-600">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <h4 className="font-medium text-gray-900 mb-1">{evidence.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{evidence.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>By {evidence.uploadedBy}</span>
                  <span>{new Date(evidence.uploadedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderSuspectsTab = () => (
    <div className="space-y-6">
      {/* Add Suspect Form */}
      {hasPermission('write_suspects') && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Suspect</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                value={suspectForm.fullName}
                onChange={(e) => setSuspectForm(prev => ({ ...prev, fullName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter suspect's full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <input
                type="number"
                value={suspectForm.age}
                onChange={(e) => setSuspectForm(prev => ({ ...prev, age: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Age"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={suspectForm.status}
                onChange={(e) => setSuspectForm(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="cleared">Cleared</option>
                <option value="wanted">Wanted</option>
                <option value="in_custody">In Custody</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={suspectForm.phone}
                onChange={(e) => setSuspectForm(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Phone number"
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <Plus className="h-4 w-4" />
              <span>Add Suspect</span>
            </button>
          </div>
        </div>
      )}

      {/* Suspects List */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Suspects ({caseData.suspects.length})</h3>
        
        {caseData.suspects.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No suspects identified</p>
            <p className="text-sm text-gray-400 mt-1">Suspects are required for criminal cases</p>
          </div>
        ) : (
          <div className="space-y-4">
            {caseData.suspects.map((suspectId, index) => (
              <div key={suspectId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Suspect #{index + 1}</h4>
                      <p className="text-sm text-gray-600">Added to case</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderWitnessesTab = () => (
    <div className="space-y-6">
      {/* Add Witness Form */}
      {hasPermission('write_suspects') && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Witness</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                value={witnessForm.fullName}
                onChange={(e) => setWitnessForm(prev => ({ ...prev, fullName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter witness's full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
              <input
                type="tel"
                value={witnessForm.phone}
                onChange={(e) => setWitnessForm(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Phone number"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Statement</label>
              <textarea
                rows={4}
                value={witnessForm.statement}
                onChange={(e) => setWitnessForm(prev => ({ ...prev, statement: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Witness statement or testimony"
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <Plus className="h-4 w-4" />
              <span>Add Witness</span>
            </button>
          </div>
        </div>
      )}

      {/* Witnesses List */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Witnesses ({caseData.witnesses.length})</h3>
        
        {caseData.witnesses.length === 0 ? (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No witnesses recorded</p>
            <p className="text-sm text-gray-400 mt-1">Witnesses are required for case completion</p>
          </div>
        ) : (
          <div className="space-y-4">
            {caseData.witnesses.map((witnessId, index) => (
              <div key={witnessId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Witness #{index + 1}</h4>
                      <p className="text-sm text-gray-600">Statement recorded</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderChargesTab = () => (
    <div className="space-y-6">
      {/* Add Charges Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Criminal Charges</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Charge Type *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Select charge type...</option>
              <option value="felony">Felony</option>
              <option value="misdemeanor">Misdemeanor</option>
              <option value="infraction">Infraction</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Penal Code</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., PC 211"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Charge Description *</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Detailed description of the charges"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Add Charge</span>
          </button>
        </div>
      </div>

      {/* Charges List */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filed Charges</h3>
        
        <div className="text-center py-8">
          <Scale className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No charges filed yet</p>
          <p className="text-sm text-gray-400 mt-1">Charges are required for criminal cases</p>
        </div>
      </div>
    </div>
  );

  const renderPartiesTab = () => (
    <div className="space-y-6">
      {/* Parties Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Parties Involved</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Complainant Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={civilPartiesForm.complainant.name}
                  onChange={(e) => setCivilPartiesForm(prev => ({
                    ...prev,
                    complainant: { ...prev.complainant, name: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Complainant name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact</label>
                <input
                  type="text"
                  value={civilPartiesForm.complainant.contact}
                  onChange={(e) => setCivilPartiesForm(prev => ({
                    ...prev,
                    complainant: { ...prev.complainant, contact: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Phone or email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={civilPartiesForm.complainant.address}
                  onChange={(e) => setCivilPartiesForm(prev => ({
                    ...prev,
                    complainant: { ...prev.complainant, address: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Address"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Respondent Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={civilPartiesForm.respondent.name}
                  onChange={(e) => setCivilPartiesForm(prev => ({
                    ...prev,
                    respondent: { ...prev.respondent, name: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Respondent name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact</label>
                <input
                  type="text"
                  value={civilPartiesForm.respondent.contact}
                  onChange={(e) => setCivilPartiesForm(prev => ({
                    ...prev,
                    respondent: { ...prev.respondent, contact: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Phone or email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={civilPartiesForm.respondent.address}
                  onChange={(e) => setCivilPartiesForm(prev => ({
                    ...prev,
                    respondent: { ...prev.respondent, address: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Address"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Save className="h-4 w-4" />
            <span>Save Parties</span>
          </button>
        </div>
      </div>

      {/* Parties Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Parties Summary</h3>
        
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No parties recorded yet</p>
          <p className="text-sm text-gray-400 mt-1">Parties information is required for civil cases</p>
        </div>
      </div>
    </div>
  );

  const renderMediationTab = () => (
    <div className="space-y-6">
      {/* Mediation Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mediation Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mediator Assigned</label>
            <select
              value={mediationForm.mediatorAssigned}
              onChange={(e) => setMediationForm(prev => ({ ...prev, mediatorAssigned: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select mediator...</option>
              <option value="mediator1">John Mediator</option>
              <option value="mediator2">Sarah Mediator</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Session Date</label>
            <input
              type="datetime-local"
              value={mediationForm.sessionDate}
              onChange={(e) => setMediationForm(prev => ({ ...prev, sessionDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Outcome</label>
            <textarea
              rows={3}
              value={mediationForm.outcome}
              onChange={(e) => setMediationForm(prev => ({ ...prev, outcome: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Mediation outcome and agreements"
            />
          </div>
          
          <div className="md:col-span-2">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={mediationForm.agreementReached}
                  onChange={(e) => setMediationForm(prev => ({ ...prev, agreementReached: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Agreement reached</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={mediationForm.followUpRequired}
                  onChange={(e) => setMediationForm(prev => ({ ...prev, followUpRequired: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Follow-up required</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Save className="h-4 w-4" />
            <span>Save Mediation</span>
          </button>
        </div>
      </div>

      {/* Mediation History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mediation History</h3>
        
        <div className="text-center py-8">
          <Handshake className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No mediation sessions recorded</p>
        </div>
      </div>
    </div>
  );

  const renderTimelineTab = () => (
    <div className="space-y-6">
      {/* Add Timeline Entry */}
      {hasPermission('write_cases') && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Timeline Entry</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                rows={3}
                value={timelineEntry.description}
                onChange={(e) => setTimelineEntry(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe what happened..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Entry Type</label>
              <select
                value={timelineEntry.type}
                onChange={(e) => setTimelineEntry(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="note_added">Note Added</option>
                <option value="status_changed">Status Changed</option>
                <option value="evidence_added">Evidence Added</option>
                <option value="suspect_added">Suspect Added</option>
                <option value="witness_interviewed">Witness Interviewed</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <Plus className="h-4 w-4" />
              <span>Add Entry</span>
            </button>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Case Timeline</h3>
        
        <div className="space-y-6">
          {caseData.timeline.map((entry) => (
            <div key={entry.id} className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-gray-900">{entry.description}</p>
                  <span className="text-xs text-gray-500">by {entry.officer}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(entry.date).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotesTab = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Notes</h3>
      <div className="text-center py-12">
        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Notes feature coming soon</p>
      </div>
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Documents</h3>
      <div className="text-center py-12">
        <Paperclip className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Documents feature coming soon</p>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverviewTab();
      case 'evidence': return renderEvidenceTab();
      case 'suspects': return renderSuspectsTab();
      case 'witnesses': return renderWitnessesTab();
      case 'charges': return renderChargesTab();
      case 'parties': return renderPartiesTab();
      case 'mediation': return renderMediationTab();
      case 'timeline': return renderTimelineTab();
      case 'notes': return renderNotesTab();
      case 'documents': return renderDocumentsTab();
      default: return renderOverviewTab();
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Cases</span>
        </button>
        
        <div className="h-6 w-px bg-gray-300" />
        
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{caseData.title}</h1>
          <p className="text-gray-600">Case #{caseData.caseNumber}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isRequired = tab.required;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {isRequired && (
                  <span className="text-red-500 text-xs">*</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default CaseDetails;