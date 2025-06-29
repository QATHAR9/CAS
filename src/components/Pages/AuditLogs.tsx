import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  User, 
  Activity,
  Eye,
  Shield,
  Clock,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { mockAuditLogs } from '../../data/mockData';
import { AuditLogEntry } from '../../types';

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [filterResource, setFilterResource] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.userFullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesUser = filterUser === 'all' || log.userId === filterUser;
    const matchesResource = filterResource === 'all' || log.resource === filterResource;
    
    return matchesSearch && matchesAction && matchesUser && matchesResource;
  });

  const getActionIcon = (action: string) => {
    if (action.includes('CREATE')) return FileText;
    if (action.includes('VIEW')) return Eye;
    if (action.includes('UPDATE') || action.includes('EDIT')) return Activity;
    if (action.includes('DELETE')) return Alert;
    if (action.includes('UPLOAD')) return Upload;
    return Shield;
  };

  const getActionColor = (action: string) => {
    if (action.includes('CREATE')) return 'bg-green-100 text-green-800';
    if (action.includes('VIEW')) return 'bg-blue-100 text-blue-800';
    if (action.includes('UPDATE') || action.includes('EDIT')) return 'bg-yellow-100 text-yellow-800';
    if (action.includes('DELETE')) return 'bg-red-100 text-red-800';
    if (action.includes('UPLOAD')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getResourceIcon = (resource: string) => {
    switch (resource) {
      case 'case': return FileText;
      case 'criminal': return User;
      case 'evidence': return Camera;
      case 'user': return UserCheck;
      default: return Shield;
    }
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Resource', 'Resource ID', 'IP Address'].join(','),
      ...filteredLogs.map(log => [
        new Date(log.timestamp).toISOString(),
        log.userFullName,
        log.action,
        log.resource,
        log.resourceId,
        log.ipAddress
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const DetailsModal: React.FC = () => {
    if (!showDetailsModal || !selectedLog) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Audit Log Details</h3>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Action Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(selectedLog.action)}`}>
                      {selectedLog.action}
                    </span>
                  </div>
                  <p><span className="font-medium">Resource:</span> {selectedLog.resource}</p>
                  <p><span className="font-medium">Resource ID:</span> {selectedLog.resourceId}</p>
                  <p><span className="font-medium">Timestamp:</span> {new Date(selectedLog.timestamp).toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">User Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">User:</span> {selectedLog.userFullName}</p>
                  <p><span className="font-medium">User ID:</span> {selectedLog.userId}</p>
                  <p><span className="font-medium">IP Address:</span> {selectedLog.ipAddress}</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Action Details</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>
            </div>

            {/* User Agent */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">User Agent</h4>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg break-all">
                {selectedLog.userAgent}
              </p>
            </div>
          </div>
          
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={() => setShowDetailsModal(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Audit Logs</h2>
          <p className="text-gray-600 mt-1">Track all system activities and user actions</p>
        </div>
        <button
          onClick={exportLogs}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Export Logs</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs by action, user, or resource..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Actions</option>
              <option value="CREATE_CASE">Create Case</option>
              <option value="VIEW_CRIMINAL_RECORD">View Criminal</option>
              <option value="UPLOAD_EVIDENCE">Upload Evidence</option>
              <option value="UPDATE_USER">Update User</option>
              <option value="DELETE_RECORD">Delete Record</option>
            </select>
          </div>
          
          <div>
            <select
              value={filterResource}
              onChange={(e) => setFilterResource(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Resources</option>
              <option value="case">Cases</option>
              <option value="criminal">Criminals</option>
              <option value="evidence">Evidence</option>
              <option value="user">Users</option>
            </select>
          </div>
          
          <div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Actions</p>
              <p className="text-lg font-semibold text-gray-900">{filteredLogs.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <User className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Set(filteredLogs.map(log => log.userId)).size}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Today's Actions</p>
              <p className="text-lg font-semibold text-gray-900">
                {filteredLogs.filter(log => 
                  new Date(log.timestamp).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Critical Actions</p>
              <p className="text-lg font-semibold text-gray-900">
                {filteredLogs.filter(log => log.action.includes('DELETE')).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 sm:px-6 py-4 text-sm font-semibold text-gray-900">Timestamp</th>
                <th className="text-left px-4 sm:px-6 py-4 text-sm font-semibold text-gray-900">User</th>
                <th className="text-left px-4 sm:px-6 py-4 text-sm font-semibold text-gray-900">Action</th>
                <th className="text-left px-4 sm:px-6 py-4 text-sm font-semibold text-gray-900">Resource</th>
                <th className="text-left px-4 sm:px-6 py-4 text-sm font-semibold text-gray-900">IP Address</th>
                <th className="text-left px-4 sm:px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLogs.map((log) => {
                const ActionIcon = getActionIcon(log.action);
                const ResourceIcon = getResourceIcon(log.resource);
                
                return (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{log.userFullName}</p>
                          <p className="text-xs text-gray-500">ID: {log.userId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center">
                        <ActionIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <ResourceIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <div>
                          <p className="font-medium">{log.resource}</p>
                          <p className="text-xs text-gray-500">ID: {log.resourceId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 font-mono">
                      {log.ipAddress}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedLog(log);
                          setShowDetailsModal(true);
                        }}
                        className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No audit logs found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      <DetailsModal />
    </div>
  );
};

export default AuditLogs;