import React, { useState, useEffect } from 'react';
import { BarChart3, PieChart, TrendingUp, DollarSign, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { supabase, Project } from '../lib/supabase';

const DashboardStats: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    ongoingProjects: 0,
    abandonedProjects: 0,
    totalBudget: 0,
    totalDisbursed: 0,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*');

      if (error) throw error;
      
      const projectData = data || [];
      setProjects(projectData);
      
      // Calculate real statistics
      const completedProjects = projectData.filter(p => p.status.includes('Completed')).length;
      const ongoingProjects = projectData.filter(p => p.status === 'Ongoing').length;
      const abandonedProjects = projectData.filter(p => p.status === 'Abandoned').length;
      const totalBudget = projectData.reduce((sum, p) => sum + (p.contract_amount || 0), 0);
      const totalDisbursed = projectData.reduce((sum, p) => sum + (p.amount_disbursed || 0), 0);
      
      setStats({
        totalProjects: projectData.length,
        completedProjects,
        ongoingProjects,
        abandonedProjects,
        totalBudget,
        totalDisbursed,
      });
    } catch (err) {
      console.error('Error fetching projects:', err);
      // Keep default values on error
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('$', '₦');
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const completionRate = Math.round((stats.completedProjects / stats.totalProjects) * 100);
  const disbursementRate = Math.round((stats.totalDisbursed / stats.totalBudget) * 100);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Project Overview</h2>
          <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Project Overview</h2>
        <p className="text-lg text-gray-600">
          Comprehensive monitoring and evaluation statistics across all NEDC development pillars
        </p>
      </div>

      {/* Key Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-gray-600">Total Projects</p>
              <p className="text-4xl lg:text-5xl font-bold text-gray-900">{formatNumber(stats.totalProjects)}</p>
            </div>
            <BarChart3 className="text-blue-500" size={40} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-gray-600">Completed</p>
              <p className="text-4xl lg:text-5xl font-bold text-gray-900">{formatNumber(stats.completedProjects)}</p>
              <p className="text-base text-green-600 font-semibold">{completionRate}% completion rate</p>
            </div>
            <CheckCircle className="text-green-500" size={40} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-gray-600">Ongoing</p>
              <p className="text-4xl lg:text-5xl font-bold text-gray-900">{formatNumber(stats.ongoingProjects)}</p>
            </div>
            <Clock className="text-yellow-500" size={40} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-gray-600">Abandoned</p>
              <p className="text-4xl lg:text-5xl font-bold text-gray-900">{formatNumber(stats.abandonedProjects)}</p>
            </div>
            <AlertTriangle className="text-red-500" size={40} />
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <DollarSign className="text-green-600 mr-3" size={28} />
            <h3 className="text-2xl font-bold text-gray-900">Financial Overview</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-base font-semibold text-gray-600">Total Budget</span>
                <span className="text-xl font-bold text-gray-900">{formatCurrency(stats.totalBudget)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-base font-semibold text-gray-600">Amount Disbursed</span>
                <span className="text-xl font-bold text-green-600">{formatCurrency(stats.totalDisbursed)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${disbursementRate}%` }}></div>
              </div>
              <p className="text-base text-gray-500 mt-1 font-medium">{disbursementRate}% disbursed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <PieChart className="text-blue-600 mr-3" size={28} />
            <h3 className="text-2xl font-bold text-gray-900">Project Status Distribution</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                <span className="text-base font-medium text-gray-600">Completed</span>
              </div>
              <span className="text-base font-semibold">{completionRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                <span className="text-base font-medium text-gray-600">Ongoing</span>
              </div>
              <span className="text-base font-semibold">{Math.round((stats.ongoingProjects / stats.totalProjects) * 100)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                <span className="text-base font-medium text-gray-600">Abandoned</span>
              </div>
              <span className="text-base font-semibold">{Math.round((stats.abandonedProjects / stats.totalProjects) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-3">Ready to Explore?</h3>
            <p className="opacity-90 text-lg">Access detailed project data, apply filters, and generate comprehensive reports.</p>
          </div>
          <div className="flex space-x-4">
            <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-md">
              View All Projects
            </button>
            <button className="bg-green-800 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-green-900 transition-colors shadow-md">
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;