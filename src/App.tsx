import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Pages/Dashboard';
import CaseManagement from './components/Pages/CaseManagement';
import CaseIntake from './components/Pages/CaseIntake';
import CriminalRecords from './components/Pages/CriminalRecords';
import EvidenceManagement from './components/Pages/EvidenceManagement';
import CrimeMap from './components/Pages/CrimeMap';
import AuditLogs from './components/Pages/AuditLogs';
import UserManagement from './components/Pages/UserManagement';
import RoleManagement from './components/Pages/RoleManagement';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return <Login />;
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'cases':
        return 'Case Management';
      case 'case-intake':
        return 'Case Intake';
      case 'criminals':
        return 'Criminal Records';
      case 'evidence':
        return 'Evidence Management';
      case 'suspects':
        return 'Suspects & Witnesses';
      case 'map':
        return 'Crime Map';
      case 'search':
        return 'Search & Filter';
      case 'notifications':
        return 'Notifications';
      case 'audit':
        return 'Audit Logs';
      case 'users':
        return 'User Management';
      case 'roles':
        return 'Role Management';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  const getPageSubtitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Overview of cases, suspects, and statistics';
      case 'cases':
        return 'Track and manage case investigations';
      case 'case-intake':
        return 'Create new case records with detailed intake forms';
      case 'criminals':
        return 'Manage and track criminal records';
      case 'evidence':
        return 'Upload, organize, and track evidence with chain of custody';
      case 'suspects':
        return 'Manage suspects and witness information';
      case 'map':
        return 'Real-time incident tracking and crime hotspot analysis';
      case 'search':
        return 'Search across all records and cases';
      case 'notifications':
        return 'System alerts and updates';
      case 'audit':
        return 'Track all system activities and user actions';
      case 'users':
        return 'Manage user accounts, roles, and permissions';
      case 'roles':
        return 'Configure user roles and assign specific permissions';
      case 'settings':
        return 'System configuration and preferences';
      default:
        return '';
    }
  };

  const renderPageContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'cases':
        return <CaseManagement />;
      case 'case-intake':
        return <CaseIntake />;
      case 'criminals':
        return <CriminalRecords />;
      case 'evidence':
        return <EvidenceManagement />;
      case 'map':
        return <CrimeMap />;
      case 'audit':
        return <AuditLogs />;
      case 'users':
        return <UserManagement />;
      case 'roles':
        return <RoleManagement />;
      case 'suspects':
        return (
          <div className="p-6">
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Suspects & Witnesses</h3>
              <p className="text-gray-600">This module is under development and will be available soon.</p>
            </div>
          </div>
        );
      case 'search':
        return (
          <div className="p-6">
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Search & Filter</h3>
              <p className="text-gray-600">This module is under development and will be available soon.</p>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="p-6">
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Notifications</h3>
              <p className="text-gray-600">This module is under development and will be available soon.</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Settings</h3>
              <p className="text-gray-600">This module is under development and will be available soon.</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white z-50">
            <Sidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              isMobile={true}
              onClose={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={getPageTitle()} 
          subtitle={getPageSubtitle()}
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        <main className="flex-1 overflow-y-auto">
          {renderPageContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;