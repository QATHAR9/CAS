import React from 'react';
import { 
  Home, 
  User, 
  FileText, 
  Users, 
  Search, 
  Bell, 
  Settings,
  LogOut,
  Shield,
  Camera,
  Map,
  UserCheck,
  FileSearch,
  Activity,
  Plus,
  UserCog
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isMobile, onClose }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, permission: 'read_dashboard' },
    { id: 'cases', label: 'Case Management', icon: FileText, permission: 'read_cases' },
    { id: 'case-intake', label: 'Case Intake', icon: Plus, permission: 'case_intake' },
    { id: 'criminals', label: 'Criminal Records', icon: User, permission: 'read_criminals' },
    { id: 'evidence', label: 'Evidence Management', icon: Camera, permission: 'read_evidence' },
    { id: 'suspects', label: 'Suspects & Witnesses', icon: Users, permission: 'read_suspects' },
    { id: 'map', label: 'Crime Map', icon: Map, permission: 'read_map' },
    { id: 'search', label: 'Search & Filter', icon: Search, permission: 'read_search' },
    { id: 'notifications', label: 'Notifications', icon: Bell, permission: 'read_notifications' },
    { id: 'audit', label: 'Audit Logs', icon: Activity, permission: 'read_audit' },
    { id: 'users', label: 'User Management', icon: UserCheck, permission: 'manage_users' },
    { id: 'roles', label: 'Role Management', icon: UserCog, permission: 'manage_roles' },
    { id: 'settings', label: 'Settings', icon: Settings, permission: 'read_settings' },
  ];

  const hasPermission = (permission: string) => {
    if (!user || !user.permissions || !Array.isArray(user.permissions)) {
      return false;
    }
    return user.permissions.includes(permission) || user.permissions.includes('all');
  };

  const handleItemClick = (itemId: string) => {
    setActiveTab(itemId);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <div className={`${isMobile ? 'w-full' : 'w-64'} bg-slate-900 text-white h-screen flex flex-col`}>
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-blue-400" />
          <div>
            <h1 className="text-xl font-bold">CAS</h1>
            <p className="text-sm text-slate-400">Criminal Admin System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-6 overflow-y-auto">
        {menuItems.map((item) => {
          if (!hasPermission(item.permission)) return null;
          
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white border-r-4 border-blue-400'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
            ) : (
              <User className="h-5 w-5" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user?.fullName}</p>
            <p className="text-sm text-slate-400 truncate">
              {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)} | {user?.badge}
            </p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;