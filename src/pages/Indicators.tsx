import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, TrendingDown, Minus, BarChart3, PieChart } from 'lucide-react';
import { supabase, Project } from '../lib/supabase';

const Indicators: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [indicators, setIndicators] = useState({
    completionRate: 0,
    budgetUtilization: 0,
    timelyCompletion: 0,
    beneficiaryReach: 0,
    geographicCoverage: 0,
    pillarDistribution: {} as Record<string, number>
  });

  useEffect(() => {
    fetchProjectsAndCalculateIndicators();
  }, []);

  const fetchProjectsAndCalculateIndicators = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*');

      if (error) throw error;
      
      const projectData = data || [];
      setProjects(projectData);
      calculateIndicators(projectData);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateIndicators = (projectData: Project[]) => {
    const total = projectData.length;
    if (total === 0) return;

    // Completion Rate
    const completed = projectData.filter(p => p.status.includes('Completed')).length;
    const completionRate = Math.round((completed / total) * 100);

    // Budget Utilization
    const totalBudget = projectData.reduce((sum, p) => sum + (p.contract_amount || 0), 0);
    const totalDisbursed = projectData.reduce((sum, p) => sum + (p.amount_disbursed || 0), 0);
    const budgetUtilization = totalBudget > 0 ? Math.round((totalDisbursed / totalBudget) * 100) : 0;

    // Timely Completion (projects completed on or before scheduled date)
    const completedProjects = projectData.filter(p => p.status.includes('Completed'));
    const timelyCompleted = completedProjects.filter(p => {
      if (!p.date_of_completion || !p.date_of_award) return false;
      // Assume 12 months as standard project duration
      const awardDate = new Date(p.date_of_award);
      const expectedCompletion = new Date(awardDate.setFullYear(awardDate.getFullYear() + 1));
      const actualCompletion = new Date(p.date_of_completion);
      return actualCompletion <= expectedCompletion;
    }).length;
    const timelyCompletion = completedProjects.length > 0 ? Math.round((timelyCompleted / completedProjects.length) * 100) : 0;

    // Geographic Coverage (unique states and LGAs)
    const uniqueStates = new Set(projectData.map(p => p.state)).size;
    const uniqueLGAs = new Set(projectData.map(p => p.lga)).size;
    const geographicCoverage = Math.round(((uniqueStates * 10) + uniqueLGAs) / 2); // Simplified metric

    // Pillar Distribution
    const pillarCounts: Record<string, number> = {};
    projectData.forEach(project => {
      const pillars = Array.isArray(project.pillars) ? project.pillars : [project.pillars];
      pillars.forEach(pillar => {
        if (pillar) {
          pillarCounts[pillar] = (pillarCounts[pillar] || 0) + 1;
        }
      });
    });

    setIndicators({
      completionRate,
      budgetUtilization,
      timelyCompletion,
      beneficiaryReach: 85, // Placeholder - would come from beneficiary data
      geographicCoverage,
      pillarDistribution: pillarCounts
    });
  };

  const getIndicatorTrend = (value: number, benchmark: number) => {
    if (value > benchmark) return { icon: TrendingUp, color: 'text-green-500', status: 'above' };
    if (value < benchmark) return { icon: TrendingDown, color: 'text-red-500', status: 'below' };
    return { icon: Minus, color: 'text-yellow-500', status: 'at' };
  };

  const keyIndicators = [
    {
      id: 'completion',
      title: 'Project Completion Rate',
      value: indicators.completionRate,
      unit: '%',
      benchmark: 75,
      description: 'Percentage of projects successfully completed',
      icon: Target
    },
    {
      id: 'budget',
      title: 'Budget Utilization',
      value: indicators.budgetUtilization,
      unit: '%',
      benchmark: 80,
      description: 'Percentage of allocated budget disbursed',
      icon: BarChart3
    },
    {
      id: 'timely',
      title: 'Timely Completion',
      value: indicators.timelyCompletion,
      unit: '%',
      benchmark: 70,
      description: 'Projects completed on or before schedule',
      icon: Target
    },
    {
      id: 'beneficiary',
      title: 'Beneficiary Reach',
      value: indicators.beneficiaryReach,
      unit: '%',
      benchmark: 80,
      description: 'Target beneficiary population reached',
      icon: Target
    },
    {
      id: 'geographic',
      title: 'Geographic Coverage',
      value: indicators.geographicCoverage,
      unit: '%',
      benchmark: 60,
      description: 'Coverage across states and LGAs',
      icon: Target
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 lg:ml-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-2 text-gray-600">Loading indicators...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Target className="mr-3 text-green-600" size={32} />
            Key Performance Indicators
          </h1>
          <p className="text-lg text-gray-600">
            Monitor and track key performance metrics for NEDC development projects
          </p>
        </div>

        {/* Key Indicators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {keyIndicators.map((indicator) => {
            const trend = getIndicatorTrend(indicator.value, indicator.benchmark);
            const TrendIcon = trend.icon;
            const IndicatorIcon = indicator.icon;
            
            return (
              <div key={indicator.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <IndicatorIcon className="text-green-600" size={24} />
                  <TrendIcon className={`${trend.color}`} size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{indicator.title}</h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-3xl font-bold text-gray-900">{indicator.value}</span>
                  <span className="text-lg text-gray-500 ml-1">{indicator.unit}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{indicator.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Benchmark: {indicator.benchmark}{indicator.unit}
                  </span>
                  <span className={`text-xs font-medium ${
                    trend.status === 'above' ? 'text-green-600' : 
                    trend.status === 'below' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {trend.status === 'above' ? 'Above Target' : 
                     trend.status === 'below' ? 'Below Target' : 'At Target'}
                  </span>
                </div>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      trend.status === 'above' ? 'bg-green-500' : 
                      trend.status === 'below' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${Math.min(indicator.value, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pillar Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <PieChart className="mr-2 text-green-600" size={20} />
              Project Distribution by Pillar
            </h3>
            <div className="space-y-3">
              {Object.entries(indicators.pillarDistribution)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 8)
                .map(([pillar, count]) => {
                  const percentage = Math.round((count / projects.length) * 100);
                  return (
                    <div key={pillar} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 truncate flex-1 mr-2">{pillar}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-green-800">Strong Performance</span>
                <span className="text-sm text-green-600">
                  {keyIndicators.filter(i => i.value >= i.benchmark).length} indicators
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium text-yellow-800">Needs Attention</span>
                <span className="text-sm text-yellow-600">
                  {keyIndicators.filter(i => i.value < i.benchmark && i.value >= i.benchmark * 0.8).length} indicators
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-sm font-medium text-red-800">Critical Areas</span>
                <span className="text-sm text-red-600">
                  {keyIndicators.filter(i => i.value < i.benchmark * 0.8).length} indicators
                </span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Recommendations</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Focus on timely project completion strategies</li>
                <li>• Improve budget utilization efficiency</li>
                <li>• Expand geographic coverage in underserved areas</li>
                <li>• Enhance beneficiary engagement programs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Indicators;