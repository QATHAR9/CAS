import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin,
  Calendar,
  User,
  Clock,
  AlertTriangle,
  FileText,
  Camera,
  Users,
  Send,
  CheckCircle,
  XCircle,
  Gavel,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { mockCases, mockEvidence, mockUsers } from '../../data/mockData';
import { Case } from '../../types';
import { useAuth } from '../../context/AuthContext';
import CaseDetails from './CaseDetails';

const CaseManagement: React.FC = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>(mockCases);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeView, setActiveView] = useState<'list' | 'details'>('list');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [showProsecutionModal, setShowProsecutionModal] = useState(false);
  const [prosecutionNotes, setProsecutionNotes] = useState('');

  const filteredCases = cases.filter(case_ => {
    const matchesSearch = case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.caseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || case_.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || case_.priority === filterPriority;
    const matchesType = filterType === 'all' || case_.type === filterType;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  const hasPermission = (permission: string) => {
    if (!user || !user.permissions || !Array.isArray(user.permissions)) {
      return false;
    }
    return user.permissions.includes(permission) || user.permissions.includes('all');
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
    
    const labels = {
      open: 'Open',
      closed: 'Closed',
      pending: 'Pending',
      investigation: 'Investigation',
      court: 'Court',
      forwarded_prosecution: 'Forwarded to Prosecution'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status as keyof typeof labels] || status.charAt(0).toUpperCase() + status.slice(1)}
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

  const ProsecutionStatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const colors = {
      pending_review: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      pending_review: 'Pending Review',
      accepted: 'Accepted',
      rejected: 'Rejected',
      in_progress: 'In Progress',
      completed: 'Completed'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const handleView = (case_: Case) => {
    setSelectedCaseId(case_.id);
    setActiveView('details');
  };

  const handleEdit = (case_: Case) => {
    setSelectedCase(case_);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this case?')) {
      setCases(cases.filter(c => c.id !== id));
    }
  };

  const handleAddNew = () => {
    setSelectedCase(null);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleForwardToProsecution = (case_: Case) => {
    setSelectedCase(case_);
    setProsecutionNotes('');
    setShowProsecutionModal(true);
  };

  const submitToProsecution = async () => {
    if (!selectedCase) return;

    try {
      // Simulate API call to prosecution system
      await new Promise(resolve => setTimeout(resolve, 2000));

      const prosecutionCaseId = `PROS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      
      const updatedCase = {
        ...selectedCase,
        status: 'forwarded_prosecution' as const,
        prosecutionInfo: {
          forwardedAt: new Date().toISOString(),
          forwardedBy: user?.fullName || 'Unknown Officer',
          prosecutionCaseId,
          prosecutionStatus: 'pending_review' as const,
          prosecutionNotes: prosecutionNotes,
          lastUpdated: new Date().toISOString()
        },
        timeline: [
          ...selectedCase.timeline,
          {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            type: 'forwarded_prosecution' as const,
            description: `Case forwarded to prosecution office with ID: ${prosecutionCaseId}`,
            officer: user?.fullName || 'Unknown Officer',
            details: { prosecutionCaseId, notes: prosecutionNotes }
          }
        ],
        updatedAt: new Date().toISOString()
      };

      setCases(cases.map(c => c.id === selectedCase.id ? updatedCase : c));
      setShowProsecutionModal(false);
      setSelectedCase(updatedCase);
      
      alert(`Case successfully forwarded to prosecution!\nProsecution Case ID: ${prosecutionCaseId}`);
    } catch (error) {
      console.error('Error forwarding case to prosecution:', error);
      alert('Error forwarding case to prosecution. Please try again.');
    }
  };

  const ProsecutionModal: React.FC = () => {
    if (!showProsecutionModal || !selectedCase) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Send className="h-5 w-5 mr-2 text-blue-600" />
              Forward Case to Prosecution
            </h3>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Case Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Case Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><span className="font-medium">Case Number:</span> {selectedCase.caseNumber}</p>
                  <p><span className="font-medium">Title:</span> {selectedCase.title}</p>
                  <p><span className="font-medium">Type:</span> {selectedCase.type}</p>
                </div>
                <div>
                  <p><span className="font-medium">Priority:</span> {selectedCase.priority}</p>
                  <p><span className="font-medium">Assigned Officer:</span> {selectedCase.assignedOfficer}</p>
                  <p><span className="font-medium">Evidence Count:</span> {selectedCase.evidence.length}</p>
                </div>
              </div>
            </div>

            {/* Prosecution Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes for Prosecution Office
              </label>
              <textarea
                rows={4}
                value={prosecutionNotes}
                onChange={(e) => setProsecutionNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add any important notes or recommendations for the prosecution office..."
              />
            </div>

            {/* Checklist */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Pre-Submission Checklist</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">All evidence has been properly documented</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">Witness statements are complete</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">Chain of custody is properly maintained</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">Case file is complete and ready for prosecution</span>
                </label>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Important Notice</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Once forwarded to prosecution, this case will be transferred to the external prosecution system. 
                    You will receive updates on the prosecution status through notifications.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={() => setShowProsecutionModal(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={submitToProsecution}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send className="h-4 w-4" />
              <span>Forward to Prosecution</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Modal: React.FC = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">
              {isEditing ? (selectedCase ? 'Edit Case' : 'Create New Case') : 'Case Details'}
            </h3>
          </div>
          
          <div className="p-6">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Case Title</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    defaultValue={selectedCase?.title || ''}
                    placeholder="Enter case title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Case Number</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    defaultValue={selectedCase?.caseNumber || ''}
                    placeholder="Auto-generated"
                    disabled
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Case Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="criminal">Criminal</option>
                    <option value="civil">Civil</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="open">Open</option>
                    <option value="investigation">Investigation</option>
                    <option value="pending">Pending</option>
                    <option value="court">Court</option>
                    <option value="forwarded_prosecution">Forwarded to Prosecution</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Officer</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select an officer...</option>
                    {mockUsers.filter(u => u.isActive).map((officer) => (
                      <option key={officer.id} value={officer.fullName}>
                        {officer.fullName} - {officer.badge} ({officer.role.charAt(0).toUpperCase() + officer.role.slice(1)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue={selectedCase?.location.address || ''}
                  placeholder="Enter incident location"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Case Description</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue={selectedCase?.description || ''}
                  placeholder="Enter detailed case description"
                />
              </div>
            </form>
          </div>
          
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              {selectedCase ? 'Update Case' : 'Create Case'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (activeView === 'details' && selectedCaseId) {
    return (
      <CaseDetails 
        caseId={selectedCaseId} 
        onBack={() => {
          setActiveView('list');
          setSelectedCaseId(null);
        }} 
      />
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Case Management</h2>
          <p className="text-gray-600 mt-1">Track and manage case investigations</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Case</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or case number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="investigation">Investigation</option>
              <option value="pending">Pending</option>
              <option value="court">Court</option>
              <option value="forwarded_prosecution">Forwarded to Prosecution</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          
          <div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="criminal">Criminal</option>
              <option value="civil">Civil</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 sm:px-6 py-4 text-sm font-semibold text-gray-900">Case</th>
                <th className="text-left px-4 sm:px-6 py-4 text-sm font-semibold text-gray-900">Type</th>
                <th className="text-left px-4 sm:px-6 py-4 text-sm font-semibold text-gray-900">Priority</th>
                <th className="text-left px-4 sm:px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                <th className="text-left px-4 sm:px-6 py-4 text-sm font-semibold text-gray-900">Officer</th>
                <th className="text-left px-4 sm:px-6 py-4 text-sm font-semibold text-gray-900">Created</th>
                <th className="text-left px-4 sm:px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCases.map((case_) => (
                <tr key={case_.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 sm:px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{case_.title}</p>
                      <p className="text-sm text-gray-600">#{case_.caseNumber}</p>
                      {case_.prosecutionInfo && (
                        <div className="flex items-center mt-1">
                          <ExternalLink className="h-3 w-3 text-orange-600 mr-1" />
                          <span className="text-xs text-orange-600">{case_.prosecutionInfo.prosecutionCaseId}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 capitalize">{case_.type}</td>
                  <td className="px-4 sm:px-6 py-4">
                    <PriorityBadge priority={case_.priority} />
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <StatusBadge status={case_.status} />
                    {case_.prosecutionInfo && (
                      <div className="mt-1">
                        <ProsecutionStatusBadge status={case_.prosecutionInfo.prosecutionStatus} />
                      </div>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">{case_.assignedOfficer}</td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(case_.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(case_)}
                        className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {case_.status !== 'forwarded_prosecution' && case_.type === 'criminal' && hasPermission('forward_prosecution') && (
                        <button
                          onClick={() => handleForwardToProsecution(case_)}
                          className="p-1 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                          title="Forward to Prosecution"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(case_)}
                        className="p-1 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(case_.id)}
                        className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredCases.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No cases found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      <Modal />
      <ProsecutionModal />
    </div>
  );
};

export default CaseManagement;