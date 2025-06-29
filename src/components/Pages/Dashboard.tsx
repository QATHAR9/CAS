import React from 'react';
import { 
  Users, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  MapPin,
  Calendar,
  Camera,
  Shield,
  Activity,
  Eye,
  Lock
} from 'lucide-react';
import { mockCases, mockCriminals, mockNotifications, mockEvidence } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Early return if user is not loaded yet
  if (!user) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  const totalCases = mockCases.length;
  const openCases = mockCases.filter(c => c.status === 'open' || c.status === 'investigation').length;
  const totalCriminals = mockCriminals.length;
  const totalEvidence = mockEvidence.length;
  const unreadNotifications = mockNotifications.filter(n => !n.isRead).length;
  const urgentCases = mockCases.filter(c => c.priority === 'urgent').length;

  const recentCases = mockCases.slice(0, 3);
  const recentCriminals = mockCriminals.slice(0, 3);
  const recentActivity = [
    { id: '1', action: 'New evidence added to case CASE-2024-001', time: '2 hours ago', type: 'evidence' },
    { id: '2', action: 'Case CASE-2024-002 status updated to pending', time: '4 hours ago', type: 'case' },
    { id: '3', action: 'New criminal record CR-2024-003 created', time: '6 hours ago', type: 'criminal' },
    { id: '4', action: 'Court date scheduled for case CASE-2024-001', time: '1 day ago', type: 'court' }
  ];

  // Safe permission checking function
  const hasPermission = (permission: string) => {
    if (!user || !user.permissions || !Array.isArray(user.permissions)) {
      return false;
    }
    return user.permissions.includes(permission) || user.permissions.includes('all');
  };

  // Role-based stats filtering
  const getVisibleStats = () => {
    const baseStats = [
      {
        title: 'Total Cases',
        value: totalCases,
        icon: FileText,
        color: 'bg-blue-500',
        change: '+12% from last month',
        trend: 'up',
        permission: 'read_cases'
      },
      {
        title: 'Open Cases',
        value: openCases,
        icon: Clock,
        color: 'bg-yellow-500',
        change: '+5% from last week',
        trend: 'up',
        permission: 'read_cases'
      },
      {
        title: 'Criminal Records',
        value: totalCriminals,
        icon: Users,
        color: 'bg-green-500',
        change: '+8% from last month',
        trend: 'up',
        permission: 'read_criminals'
      },
      {
        title: 'Evidence Items',
        value: totalEvidence,
        icon: Camera,
        color: 'bg-purple-500',
        change: '+15% from last week',
        trend: 'up',
        permission: 'read_evidence'
      },
      {
        title: 'Urgent Cases',
        value: urgentCases,
        icon: AlertTriangle,
        color: 'bg-red-500',
        change: 'Requires attention',
        trend: 'neutral',
        permission: 'read_cases'
      },
      {
        title: 'Notifications',
        value: unreadNotifications,
        icon: Shield,
        color: 'bg-indigo-500',
        change: '3 new today',
        trend: 'neutral',
        permission: 'read_notifications'
      }
    ];

    return baseStats.filter(stat => hasPermission(stat.permission));
  };

  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const colors = {
      open: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      investigation: 'bg-blue-100 text-blue-800',
      court: 'bg-purple-100 text-purple-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
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
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'evidence': return Camera;
      case 'case': return FileText;
      case 'criminal': return Users;
      case 'court': return Calendar;
      default: return Activity;
    }
  };

  const RestrictedSection: React.FC<{ children: React.ReactNode; permission: string; title: string }> = ({ 
    children, 
    permission, 
    title 
  }) => {
    if (!hasPermission(permission)) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center py-8">
            <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600">You don't have permission to view this section</p>
            <p className="text-sm text-gray-400 mt-1">Contact your administrator for access</p>
          </div>
        </div>
      );
    }
    return <>{children}</>;
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white p-6">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user.fullName}</h1>
        <p className="text-blue-100">
          {user.role === 'admin' ? 'You have full system access' : 
           user.role === 'supervisor' ? 'You have supervisory access' :
           user.role === 'detective' ? 'You have investigative access' :
           'You have field officer access'}
        </p>
        <div className="flex items-center mt-3 text-sm text-blue-100">
          <Shield className="h-4 w-4 mr-2" />
          <span>Badge: {user.badge} | Department: {user.department}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
        {getVisibleStats().map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 flex items-center">
                    {stat.trend === 'up' && <TrendingUp className="h-3 w-3 mr-1 text-green-500" />}
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color} flex-shrink-0`}>
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Cases */}
        <RestrictedSection permission="read_cases" title="Recent Cases">
          <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Recent Cases
              </h3>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                {recentCases.map((case_) => (
                  <div key={case_.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1 mb-3 sm:mb-0">
                      <h4 className="font-medium text-gray-900">{case_.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">Case #{case_.caseNumber}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <StatusBadge status={case_.status} />
                        <PriorityBadge priority={case_.priority} />
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm text-gray-600">{case_.assignedOfficer}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(case_.createdAt).toLocaleDateString()}
                      </p>
                      {hasPermission('read_cases') && (
                        <button className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RestrictedSection>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-600" />
              Recent Activity
            </h3>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Icon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Criminal Records */}
      <RestrictedSection permission="read_criminals" title="Recent Criminal Records">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-600" />
              Recent Criminal Records
            </h3>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentCriminals.map((criminal) => (
                <div key={criminal.id} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <img
                    src={criminal.photo || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50'}
                    alt={criminal.fullName}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{criminal.fullName}</h4>
                    <p className="text-sm text-gray-600 truncate">Case #{criminal.caseNumber}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <StatusBadge status={criminal.status} />
                      <span className="text-xs text-gray-400 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {criminal.location.address.split(',')[1] || criminal.location.address}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </RestrictedSection>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {hasPermission('write_criminals') && (
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group">
              <div className="text-center">
                <Users className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2" />
                <p className="font-medium text-gray-700 group-hover:text-blue-700 text-sm">Add Criminal Record</p>
              </div>
            </button>
          )}
          
          {hasPermission('write_cases') && (
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group">
              <div className="text-center">
                <FileText className="h-8 w-8 text-gray-400 group-hover:text-green-500 mx-auto mb-2" />
                <p className="font-medium text-gray-700 group-hover:text-green-700 text-sm">Create New Case</p>
              </div>
            </button>
          )}
          
          {hasPermission('write_evidence') && (
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors group">
              <div className="text-center">
                <Camera className="h-8 w-8 text-gray-400 group-hover:text-purple-500 mx-auto mb-2" />
                <p className="font-medium text-gray-700 group-hover:text-purple-700 text-sm">Upload Evidence</p>
              </div>
            </button>
          )}
          
          {hasPermission('read_cases') && (
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors group">
              <div className="text-center">
                <Calendar className="h-8 w-8 text-gray-400 group-hover:text-orange-500 mx-auto mb-2" />
                <p className="font-medium text-gray-700 group-hover:text-orange-700 text-sm">Schedule Investigation</p>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;