import React, { useState, useEffect } from 'react';
import { MapPin, Layers, Filter, BarChart3, PieChart } from 'lucide-react';
import { supabase, Project } from '../lib/supabase';

const GeographicMapping: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string>('all');
  const [mapView, setMapView] = useState<'projects' | 'budget' | 'status'>('projects');
  const [geoData, setGeoData] = useState({
    stateDistribution: [] as any[],
    lgaDistribution: [] as any[],
    densityMap: {} as any
  });

  useEffect(() => {
    fetchProjectsAndAnalyze();
  }, []);

  const fetchProjectsAndAnalyze = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*');

      if (error) throw error;
      
      const projectData = data || [];
      setProjects(projectData);
      analyzeGeographicData(projectData);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const analyzeGeographicData = (projectData: Project[]) => {
    // State Distribution Analysis
    const stateStats = projectData.reduce((acc, project) => {
      const state = project.state;
      if (!acc[state]) {
        acc[state] = {
          state,
          projectCount: 0,
          totalBudget: 0,
          completedProjects: 0,
          ongoingProjects: 0,
          lgas: new Set()
        };
      }
      acc[state].projectCount++;
      acc[state].totalBudget += project.contract_amount || 0;
      acc[state].lgas.add(project.lga);
      
      if (project.status.includes('Completed')) {
        acc[state].completedProjects++;
      } else if (project.status === 'Ongoing') {
        acc[state].ongoingProjects++;
      }
      
      return acc;
    }, {} as any);

    const stateDistribution = Object.values(stateStats).map((state: any) => ({
      ...state,
      lgaCount: state.lgas.size,
      completionRate: Math.round((state.completedProjects / state.projectCount) * 100),
      avgBudgetPerProject: Math.round(state.totalBudget / state.projectCount)
    }));

    // LGA Distribution Analysis
    const lgaStats = projectData.reduce((acc, project) => {
      const key = `${project.state}-${project.lga}`;
      if (!acc[key]) {
        acc[key] = {
          state: project.state,
          lga: project.lga,
          projectCount: 0,
          totalBudget: 0,
          completedProjects: 0
        };
      }
      acc[key].projectCount++;
      acc[key].totalBudget += project.contract_amount || 0;
      if (project.status.includes('Completed')) {
        acc[key].completedProjects++;
      }
      return acc;
    }, {} as any);

    const lgaDistribution = Object.values(lgaStats);

    setGeoData({
      stateDistribution,
      lgaDistribution,
      densityMap: stateStats
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount).replace('$', '₦');
  };

  const getStateColor = (value: number, max: number) => {
    const intensity = (value / max) * 100;
    if (intensity >= 80) return 'bg-green-600';
    if (intensity >= 60) return 'bg-green-500';
    if (intensity >= 40) return 'bg-green-400';
    if (intensity >= 20) return 'bg-green-300';
    return 'bg-green-200';
  };

  const filteredData = selectedState === 'all' 
    ? geoData.stateDistribution 
    : geoData.lgaDistribution.filter((lga: any) => lga.state === selectedState);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 lg:ml-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-2 text-gray-600">Loading geographic data...</span>
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
                <MapPin className="mr-3 text-green-600" size={32} />
                Geographic Mapping
              </h1>
              <p className="text-lg text-gray-600">
                Spatial analysis and geographic distribution of NEDC development projects
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All States</option>
                <option value="Adamawa">Adamawa</option>
                <option value="Bauchi">Bauchi</option>
                <option value="Borno">Borno</option>
                <option value="Gombe">Gombe</option>
                <option value="Taraba">Taraba</option>
                <option value="Yobe">Yobe</option>
              </select>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setMapView('projects')}
                  className={`px-3 py-1 text-sm rounded ${
                    mapView === 'projects' ? 'bg-white shadow' : 'text-gray-600'
                  }`}
                >
                  Projects
                </button>
                <button
                  onClick={() => setMapView('budget')}
                  className={`px-3 py-1 text-sm rounded ${
                    mapView === 'budget' ? 'bg-white shadow' : 'text-gray-600'
                  }`}
                >
                  Budget
                </button>
                <button
                  onClick={() => setMapView('status')}
                  className={`px-3 py-1 text-sm rounded ${
                    mapView === 'status' ? 'bg-white shadow' : 'text-gray-600'
                  }`}
                >
                  Status
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Geographic Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">States Covered</p>
                <p className="text-3xl font-bold text-gray-900">{geoData.stateDistribution.length}</p>
              </div>
              <MapPin className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">LGAs Reached</p>
                <p className="text-3xl font-bold text-gray-900">
                  {geoData.stateDistribution.reduce((sum, state) => sum + state.lgaCount, 0)}
                </p>
              </div>
              <Layers className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-3xl font-bold text-gray-900">{projects.length}</p>
              </div>
              <BarChart3 className="text-purple-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Coverage Rate</p>
                <p className="text-3xl font-bold text-gray-900">85%</p>
              </div>
              <PieChart className="text-orange-500" size={32} />
            </div>
          </div>
        </div>

        {/* Map Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Interactive Map Area */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <MapPin className="mr-2 text-green-600" size={20} />
                North East Region Project Distribution
              </h3>
            </div>
            <div className="p-6">
              {/* Simplified Map Representation */}
              <div className="bg-gray-100 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Interactive Map</h4>
                  <p className="text-gray-600 mb-4">
                    Geographic visualization of project distribution across the North East region
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                    {geoData.stateDistribution.map((state) => {
                      const maxProjects = Math.max(...geoData.stateDistribution.map(s => s.projectCount));
                      return (
                        <div
                          key={state.state}
                          className={`p-4 rounded-lg text-white cursor-pointer hover:opacity-80 transition-opacity ${
                            getStateColor(state.projectCount, maxProjects)
                          }`}
                          onClick={() => setSelectedState(state.state)}
                        >
                          <h5 className="font-medium">{state.state}</h5>
                          <p className="text-sm opacity-90">{state.projectCount} projects</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Geographic Statistics */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedState === 'all' ? 'State Rankings' : `${selectedState} LGAs`}
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredData.slice(0, 10).map((item: any, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {selectedState === 'all' ? item.state : item.lga}
                          </span>
                          <span className="text-sm text-gray-500">{item.projectCount}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ 
                              width: `${(item.projectCount / Math.max(...filteredData.map((d: any) => d.projectCount))) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Coverage Analysis</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-green-800">High Coverage</span>
                  <span className="text-sm text-green-600">
                    {geoData.stateDistribution.filter(s => s.projectCount >= 200).length} states
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm font-medium text-yellow-800">Medium Coverage</span>
                  <span className="text-sm text-yellow-600">
                    {geoData.stateDistribution.filter(s => s.projectCount >= 100 && s.projectCount < 200).length} states
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-sm font-medium text-red-800">Low Coverage</span>
                  <span className="text-sm text-red-600">
                    {geoData.stateDistribution.filter(s => s.projectCount < 100).length} states
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Insights</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Most Active State:</span>
                  <span className="font-medium">
                    {geoData.stateDistribution.reduce((max, state) => 
                      state.projectCount > max.projectCount ? state : max, 
                      geoData.stateDistribution[0] || {}
                    )?.state || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Highest Budget:</span>
                  <span className="font-medium">
                    {geoData.stateDistribution.reduce((max, state) => 
                      state.totalBudget > max.totalBudget ? state : max, 
                      geoData.stateDistribution[0] || {}
                    )?.state || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Best Completion Rate:</span>
                  <span className="font-medium">
                    {geoData.stateDistribution.reduce((max, state) => 
                      state.completionRate > max.completionRate ? state : max, 
                      geoData.stateDistribution[0] || {}
                    )?.completionRate || 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeographicMapping;