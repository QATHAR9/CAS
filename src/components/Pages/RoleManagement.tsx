import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  Settings, 
  Save, 
  RotateCcw, 
  Eye, 
  EyeOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lock,
  Unlock,
  UserCheck,
  FileText,
  Camera,
  Map,
  Search,
  Bell,
  Activity,
  Plus,
  Edit,
  Trash2,
  Send
} from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<any>;
  critical?: boolean;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystemRole: boolean;
  color: string;
}

const RoleManagement: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('officer');
  const [showPermissionDetails, setShowPermissionDetails] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');

  // Available permissions organized by category
  const availablePermissions: Permission[] = [
    // Dashboard
    { id: 'read_dashboard', name: 'View Dashboard', description: 'Access to main dashboard and statistics', category: 'Dashboard', icon: Shield },
    
    // Cases
    { id: 'read_cases', name: 'View Cases', description: 'View case information and details', category: 'Cases', icon: FileText },
    { id: 'write_cases', name: 'Create/Edit Cases', description: 'Create new cases and edit existing ones', category: 'Cases', icon: Edit },
    { id: 'delete_cases', name: 'Delete Cases', description: 'Delete case records', category: 'Cases', icon: Trash2, critical: true },
    { id: 'case_intake', name: 'Case Intake', description: 'Access to case intake forms', category: 'Cases', icon: Plus },
    { id: 'forward_prosecution', name: 'Forward to Prosecution', description: 'Forward cases to prosecution system', category: 'Cases', icon: Send, critical: true },
    
    // Criminal Records
    { id: 'read_criminals', name: 'View Criminal Records', description: 'Access criminal record information', category: 'Criminal Records', icon: Users },
    { id: 'write_criminals', name: 'Create/Edit Criminal Records', description: 'Create and modify criminal records', category: 'Criminal Records', icon: Edit },
    { id: 'delete_criminals', name: 'Delete Criminal Records', description: 'Delete criminal records', category: 'Criminal Records', icon: Trash2, critical: true },
    
    // Evidence
    { id: 'read_evidence', name: 'View Evidence', description: 'Access evidence files and chain of custody', category: 'Evidence', icon: Camera },
    { id: 'write_evidence', name: 'Upload/Edit Evidence', description: 'Upload new evidence and edit existing', category: 'Evidence', icon: Edit },
    { id: 'delete_evidence', name: 'Delete Evidence', description: 'Delete evidence records', category: 'Evidence', icon: Trash2, critical: true },
    
    // Suspects & Witnesses
    { id: 'read_suspects', name: 'View Suspects/Witnesses', description: 'Access suspect and witness information', category: 'Suspects & Witnesses', icon: UserCheck },
    { id: 'write_suspects', name: 'Manage Suspects/Witnesses', description: 'Add and edit suspect/witness records', category: 'Suspects & Witnesses', icon: Edit },
    
    // Map & Location
    { id: 'read_map', name: 'View Crime Map', description: 'Access crime mapping and location data', category: 'Map & Location', icon: Map },
    
    // Search & Filter
    { id: 'read_search', name: 'Search System', description: 'Use search and filter functionality', category: 'Search & Filter', icon: Search },
    
    // Notifications
    { id: 'read_notifications', name: 'View Notifications', description: 'Receive and view system notifications', category: 'Notifications', icon: Bell },
    
    // Audit & Logs
    { id: 'read_audit', name: 'View Audit Logs', description: 'Access system audit logs and activity', category: 'Audit & Logs', icon: Activity },
    
    // User Management
    { id: 'manage_users', name: 'Manage Users', description: 'Create, edit, and manage user accounts', category: 'User Management', icon: Users, critical: true },
    { id: 'manage_roles', name: 'Manage Roles', description: 'Create and modify user roles and permissions', category: 'User Management', icon: Shield, critical: true },
    
    // Settings
    { id: 'read_settings', name: 'View Settings', description: 'Access system settings and configuration', category: 'Settings', icon: Settings },
    { id: 'write_settings', name: 'Modify Settings', description: 'Change system settings and configuration', category: 'Settings', icon: Edit, critical: true },
  ];

  // Default roles with their permissions
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 'officer',
      name: 'Police Officer',
      description: 'Field officers with basic case and evidence access',
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
      userCount: 15,
      isSystemRole: true,
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'detective',
      name: 'Detective',
      description: 'Investigators with enhanced access to cases and records',
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
      userCount: 8,
      isSystemRole: true,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'supervisor',
      name: 'Supervisor',
      description: 'Supervisory staff with oversight capabilities',
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
      userCount: 4,
      isSystemRole: true,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Full system access with all permissions',
      permissions: availablePermissions.map(p => p.id),
      userCount: 2,
      isSystemRole: true,
      color: 'bg-red-100 text-red-800'
    }
  ]);

  const selectedRoleData = roles.find(r => r.id === selectedRole);

  const togglePermission = (permissionId: string) => {
    setRoles(roles.map(role => {
      if (role.id === selectedRole) {
        const hasPermission = role.permissions.includes(permissionId);
        return {
          ...role,
          permissions: hasPermission 
            ? role.permissions.filter(p => p !== permissionId)
            : [...role.permissions, permissionId]
        };
      }
      return role;
    }));
    setHasUnsavedChanges(true);
  };

  const saveChanges = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Saving role permissions:', roles);
      setHasUnsavedChanges(false);
      alert('Role permissions saved successfully!');
    } catch (error) {
      console.error('Error saving role permissions:', error);
      alert('Error saving role permissions. Please try again.');
    }
  };

  const resetChanges = () => {
    // Reset to original state
    setHasUnsavedChanges(false);
    // You would reload from backend here
    window.location.reload();
  };

  const createNewRole = async () => {
    if (!newRoleName.trim()) {
      alert('Please enter a role name');
      return;
    }
    
    try {
      const newRole: Role = {
        id: newRoleName.toLowerCase().replace(/\s+/g, '_'),
        name: newRoleName,
        description: newRoleDescription,
        permissions: ['read_dashboard'], // Default permission
        userCount: 0,
        isSystemRole: false,
        color: 'bg-gray-100 text-gray-800'
      };
      
      setRoles([...roles, newRole]);
      setNewRoleName('');
      setNewRoleDescription('');
      setShowCreateRoleModal(false);
      setSelectedRole(newRole.id);
      
      alert(`Role "${newRole.name}" created successfully!`);
    } catch (error) {
      console.error('Error creating role:', error);
      alert('Error creating role. Please try again.');
    }
  };

  const deleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isSystemRole) {
      alert('Cannot delete system roles');
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete the role "${role?.name}"?`)) {
      setRoles(roles.filter(r => r.id !== roleId));
      if (selectedRole === roleId) {
        setSelectedRole('officer');
      }
      alert(`Role "${role?.name}" deleted successfully!`);
    }
  };

  const groupedPermissions = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const CreateRoleModal = () => {
    if (!showCreateRoleModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Create New Role</h3>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role Name *</label>
              <input
                type="text"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter role name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={3}
                value={newRoleDescription}
                onChange={(e) => setNewRoleDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the role's purpose"
              />
            </div>
          </div>
          
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={() => setShowCreateRoleModal(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={createNewRole}
              disabled={!newRoleName.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Create Role
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
          <h2 className="text-2xl font-bold text-gray-900">Role & Permission Management</h2>
          <p className="text-gray-600 mt-1">Configure user roles and assign specific permissions</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {hasUnsavedChanges && (
            <div className="flex items-center space-x-2">
              <button
                onClick={resetChanges}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>
              <button
                onClick={saveChanges}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          )}
          
          <button
            onClick={() => setShowCreateRoleModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Role</span>
          </button>
        </div>
      </div>

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Unsaved Changes</h3>
              <p className="text-sm text-yellow-700 mt-1">You have unsaved permission changes. Don't forget to save your changes.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Role Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Roles</h3>
              <button
                onClick={() => setShowPermissionDetails(!showPermissionDetails)}
                className="p-1 text-gray-600 hover:text-gray-900"
                title="Toggle permission details"
              >
                {showPermissionDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            <div className="space-y-2">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedRole === role.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{role.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${role.color}`}>
                          {role.userCount} users
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                      {showPermissionDetails && (
                        <p className="text-xs text-gray-500 mt-2">
                          {role.permissions.length} permissions assigned
                        </p>
                      )}
                    </div>
                    
                    {!role.isSystemRole && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteRole(role.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete role"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Permission Configuration */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Configure Permissions: {selectedRoleData?.name}
                  </h3>
                  <p className="text-gray-600 mt-1">{selectedRoleData?.description}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedRoleData?.color}`}>
                    {selectedRoleData?.userCount} users
                  </span>
                  {selectedRoleData?.isSystemRole && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      System Role
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-8">
                {Object.entries(groupedPermissions).map(([category, permissions]) => (
                  <div key={category}>
                    <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-blue-600" />
                      {category}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {permissions.map((permission) => {
                        const hasPermission = selectedRoleData?.permissions.includes(permission.id) || false;
                        const Icon = permission.icon;
                        
                        return (
                          <div
                            key={permission.id}
                            className={`p-4 border rounded-lg transition-colors cursor-pointer ${
                              hasPermission 
                                ? 'border-green-500 bg-green-50' 
                                : 'border-gray-200 hover:bg-gray-50'
                            } ${permission.critical ? 'ring-2 ring-red-200' : ''}`}
                            onClick={() => togglePermission(permission.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                <div className={`p-2 rounded-lg ${
                                  hasPermission ? 'bg-green-100' : 'bg-gray-100'
                                }`}>
                                  <Icon className={`h-4 w-4 ${
                                    hasPermission ? 'text-green-600' : 'text-gray-600'
                                  }`} />
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <h5 className="font-medium text-gray-900">{permission.name}</h5>
                                    {permission.critical && (
                                      <AlertTriangle className="h-4 w-4 text-red-500" title="Critical permission" />
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">{permission.description}</p>
                                </div>
                              </div>
                              
                              <div className="ml-3">
                                {hasPermission ? (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-gray-400" />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Permission Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Permission Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role) => (
            <div key={role.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{role.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${role.color}`}>
                  {role.userCount}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Permissions:</span>
                  <span className="font-medium">{role.permissions.length}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Critical Permissions:</span>
                  <span className="font-medium text-red-600">
                    {role.permissions.filter(p => 
                      availablePermissions.find(ap => ap.id === p)?.critical
                    ).length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Access Level:</span>
                  <span className="font-medium">
                    {Math.round((role.permissions.length / availablePermissions.length) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CreateRoleModal />
    </div>
  );
};

export default RoleManagement;