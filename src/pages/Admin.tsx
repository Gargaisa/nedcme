import React, { useState, useEffect } from 'react';
import { Users, Activity, Clock, Shield, Eye, UserCheck, Settings } from 'lucide-react';
import { supabase, UserProfile } from '../lib/supabase';
import AdminLogin from '../components/AdminLogin';
import UserManagement from '../components/UserManagement';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState<any>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users'>('dashboard');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    adminUsers: 0,
    regularUsers: 0
  });

  const handleLogin = async (credentials: { username: string; password: string }) => {
    try {
      setLoginLoading(true);
      setLoginError(null);
      
      // In a real implementation, this would call the verify_admin_credentials function
      // For demo purposes, we'll use hardcoded credentials
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        setIsAuthenticated(true);
        setAdminData({
          id: 'admin-1',
          username: 'admin',
          full_name: 'System Administrator',
          email: 'admin@nedc.gov.ng'
        });
      } else {
        setLoginError('Invalid username or password');
      }
    } catch (err) {
      setLoginError('Login failed. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminData(null);
    setActiveTab('dashboard');
  };

  if (!isAuthenticated) {
    return (
      <AdminLogin 
        onLogin={handleLogin}
        loading={loginLoading}
        error={loginError}
      />
    );
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('last_login', { ascending: false });

      if (error) throw error;
      
      const userData = data || [];
      setUsers(userData);
      
      // Calculate stats
      const today = new Date().toDateString();
      const activeToday = userData.filter(user => 
        user.last_login && new Date(user.last_login).toDateString() === today
      ).length;
      
      setStats({
        totalUsers: userData.length,
        activeToday,
        adminUsers: userData.filter(user => user.role === 'admin').length,
        regularUsers: userData.filter(user => user.role === 'user').length
      });
    } catch (err) {
      // Handle error silently and show empty state
      setUsers([]);
      setStats({
        totalUsers: 0,
        activeToday: 0,
        adminUsers: 0,
        regularUsers: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-GB');
  };

  const getActivityStatus = (lastLogin: string | null | undefined) => {
    if (!lastLogin) return 'never';
    
    const loginDate = new Date(lastLogin);
    const now = new Date();
    const diffHours = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 1) return 'online';
    if (diffHours < 24) return 'today';
    if (diffHours < 168) return 'week';
    return 'inactive';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'today': return 'bg-blue-100 text-blue-800';
      case 'week': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'today': return 'Active Today';
      case 'week': return 'This Week';
      case 'inactive': return 'Inactive';
      default: return 'Never Logged In';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <Shield className="mr-3 text-green-600" size={32} />
              Admin Panel
            </h1>
            <p className="text-lg text-gray-600">
              Welcome back, {adminData?.full_name}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dashboard'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Activity className="inline mr-2" size={16} />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Settings className="inline mr-2" size={16} />
                User Management
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                  <Users className="text-blue-500" size={32} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Today</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.activeToday}</p>
                  </div>
                  <Activity className="text-green-500" size={32} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Admin Users</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.adminUsers}</p>
                  </div>
                  <Shield className="text-purple-500" size={32} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Regular Users</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.regularUsers}</p>
                  </div>
                  <UserCheck className="text-orange-500" size={32} />
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Eye className="mr-2 text-green-600" size={24} />
                  User Activity Log
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Monitor user login activity and access patterns
                </p>
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <span className="ml-2 text-gray-600">Loading user data...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Login
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Account Created
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => {
                        const activityStatus = getActivityStatus(user.last_login);
                        return (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <span className="text-green-600 font-medium text-sm">
                                      {user.email.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {user.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.role === 'admin' 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {user.role === 'admin' ? 'Administrator' : 'User'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(activityStatus)}`}>
                                {getStatusText(activityStatus)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center">
                                <Clock className="mr-2 text-gray-400" size={14} />
                                {formatDate(user.last_login)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(user.created_at)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <UserManagement adminId={adminData?.id} />
        )}
      </div>
    </div>
  );
};

export default Admin;