import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, PieChart, LineChart, Calendar, Filter } from 'lucide-react';
import { supabase, Project } from '../lib/supabase';

const Analytics: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'6m' | '1y' | '2y' | 'all'>('1y');
  const [analytics, setAnalytics] = useState({
    trendData: [] as any[],
    stateAnalysis: [] as any[],
    pillarAnalysis: [] as any[],
    budgetAnalysis: {} as any,
    performanceMetrics: {} as any
  });

  useEffect(() => {
    fetchProjectsAndAnalyze();
  }, [selectedTimeframe]);

  const fetchProjectsAndAnalyze = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*');

      if (error) throw error;
      
      const projectData = data || [];
      setProjects(projectData);
      analyzeData(projectData);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const analyzeData = (projectData: Project[]) => {
    // State Analysis
    const stateStats = projectData.reduce((acc, project) => {
      const state = project.state;
      if (!acc[state]) {
        acc[state] = {
          total: 0,
          completed: 0,
          ongoing: 0,
          budget: 0,
          disbursed: 0
        };
      }
      acc[state].total++;
      if (project.status.includes('Completed')) acc[state].completed++;
      if (project.status === 'Ongoing') acc[state].ongoing++;
      acc[state].budget += project.contract_amount || 0;
      acc[state].disbursed += project.amount_disbursed || 0;
      return acc;
    }, {} as any);

    const stateAnalysis = Object.entries(stateStats).map(([state, stats]: [string, any]) => ({
      state,
      ...stats,
      completionRate: Math.round((stats.completed / stats.total) * 100),
      utilizationRate: stats.budget > 0 ? Math.round((stats.disbursed / stats.budget) * 100) : 0
    }));

    // Pillar Analysis
    const pillarStats: Record<string, any> = {};
    projectData.forEach(project => {
      const pillars = Array.isArray(project.pillars) ? project.pillars : [project.pillars];
      pillars.forEach(pillar => {
        if (pillar) {
          if (!pillarStats[pillar]) {
            pillarStats[pillar] = {
              count: 0,
              budget: 0,
              disbursed: 0,
              completed: 0
            };
          }
          pillarStats[pillar].count++;
          pillarStats[pillar].budget += project.contract_amount || 0;
          pillarStats[pillar].disbursed += project.amount_disbursed || 0;
          if (project.status.includes('Completed')) {
            pillarStats[pillar].completed++;
          }
        }
      });
    });

    const pillarAnalysis = Object.entries(pillarStats).map(([pillar, stats]: [string, any]) => ({
      pillar,
      ...stats,
      completionRate: Math.round((stats.completed / stats.count) * 100),
      avgBudget: Math.round(stats.budget / stats.count)
    }));

    // Budget Analysis
    const totalBudget = projectData.reduce((sum, p) => sum + (p.contract_amount || 0), 0);
    const totalDisbursed = projectData.reduce((sum, p) => sum + (p.amount_disbursed || 0), 0);
    const budgetAnalysis = {
      totalBudget,
      totalDisbursed,
      utilizationRate: totalBudget > 0 ? Math.round((totalDisbursed / totalBudget) * 100) : 0,
      avgProjectBudget: Math.round(totalBudget / projectData.length),
      budgetByStatus: {
        completed: projectData.filter(p => p.status.includes('Completed')).reduce((sum, p) => sum + (p.contract_amount || 0), 0),
        ongoing: projectData.filter(p => p.status === 'Ongoing').reduce((sum, p) => sum + (p.contract_amount || 0), 0),
        abandoned: projectData.filter(p => p.status === 'Abandoned').reduce((sum, p) => sum + (p.contract_amount || 0), 0)
      }
    };

    // Performance Metrics
    const performanceMetrics = {
      totalProjects: projectData.length,
      completionRate: Math.round((projectData.filter(p => p.status.includes('Completed')).length / projectData.length) * 100),
      ongoingProjects: projectData.filter(p => p.status === 'Ongoing').length,
      averageProjectDuration: 12, // Placeholder
      beneficiaryReach: 150000, // Placeholder
      geographicCoverage: {
        states: new Set(projectData.map(p => p.state)).size,
        lgas: new Set(projectData.map(p => p.lga)).size
      }
    };

    setAnalytics({
      trendData: [], // Would be calculated based on timeframe
      stateAnalysis,
      pillarAnalysis,
      budgetAnalysis,
      performanceMetrics
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount).replace('$', '₦');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 lg:ml-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-2 text-gray-600">Loading analytics...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <TrendingUp className="mr-3 text-green-600" size={32} />
                Data Analytics
              </h1>
              <p className="text-lg text-gray-600">
                Advanced analytics and insights for NEDC project performance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="6m">Last 6 Months</option>
                <option value="1y">Last Year</option>
                <option value="2y">Last 2 Years</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.performanceMetrics.totalProjects}</p>
              </div>
              <BarChart3 className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.performanceMetrics.completionRate}%</p>
              </div>
              <TrendingUp className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">States Covered</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.performanceMetrics.geographicCoverage?.states}</p>
              </div>
              <PieChart className="text-purple-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget Utilization</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.budgetAnalysis.utilizationRate}%</p>
              </div>
              <LineChart className="text-orange-500" size={32} />
            </div>
          </div>
        </div>

        {/* State Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart3 className="mr-2 text-green-600" size={20} />
                State Performance Analysis
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analytics.stateAnalysis.slice(0, 6).map((state) => (
                  <div key={state.state} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{state.state}</span>
                        <span className="text-sm text-gray-500">{state.total} projects</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${state.completionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 w-12">{state.completionRate}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <PieChart className="mr-2 text-green-600" size={20} />
                Budget Distribution
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-green-800">Completed Projects</span>
                  <span className="text-sm text-green-600">
                    {formatCurrency(analytics.budgetAnalysis.budgetByStatus?.completed || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-blue-800">Ongoing Projects</span>
                  <span className="text-sm text-blue-600">
                    {formatCurrency(analytics.budgetAnalysis.budgetByStatus?.ongoing || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-sm font-medium text-red-800">Abandoned Projects</span>
                  <span className="text-sm text-red-600">
                    {formatCurrency(analytics.budgetAnalysis.budgetByStatus?.abandoned || 0)}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Financial Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Budget:</span>
                    <span className="font-medium">{formatCurrency(analytics.budgetAnalysis.totalBudget)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Disbursed:</span>
                    <span className="font-medium">{formatCurrency(analytics.budgetAnalysis.totalDisbursed)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Utilization Rate:</span>
                    <span className="font-medium">{analytics.budgetAnalysis.utilizationRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="mr-2 text-green-600" size={20} />
              Development Pillar Analysis
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pillar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Projects
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completion Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg. Project Budget
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.pillarAnalysis.slice(0, 8).map((pillar) => (
                  <tr key={pillar.pillar} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{pillar.pillar}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pillar.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${pillar.completionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">{pillar.completionRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(pillar.budget)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(pillar.avgBudget)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;