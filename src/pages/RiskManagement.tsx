import React, { useState } from 'react';
import { AlertTriangle, Shield, TrendingDown, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const RiskManagement: React.FC = () => {
  const [selectedRiskCategory, setSelectedRiskCategory] = useState<string>('all');
  const [riskView, setRiskView] = useState<'matrix' | 'register' | 'mitigation'>('matrix');

  const riskCategories = [
    { id: 'all', name: 'All Risks', color: 'gray' },
    { id: 'financial', name: 'Financial', color: 'red' },
    { id: 'operational', name: 'Operational', color: 'orange' },
    { id: 'environmental', name: 'Environmental', color: 'green' },
    { id: 'political', name: 'Political', color: 'blue' },
    { id: 'technical', name: 'Technical', color: 'purple' }
  ];

  const risks = [
    {
      id: 'R001',
      title: 'Budget Overrun',
      category: 'financial',
      probability: 'High',
      impact: 'High',
      riskLevel: 'Critical',
      description: 'Project costs exceeding allocated budget due to inflation and material costs',
      mitigation: 'Regular budget monitoring, contingency planning, supplier negotiations',
      owner: 'Finance Manager',
      status: 'Active',
      lastReview: '2024-01-15'
    },
    {
      id: 'R002',
      title: 'Contractor Performance',
      category: 'operational',
      probability: 'Medium',
      impact: 'High',
      riskLevel: 'High',
      description: 'Poor contractor performance leading to delays and quality issues',
      mitigation: 'Enhanced contractor screening, performance monitoring, penalty clauses',
      owner: 'Project Manager',
      status: 'Mitigated',
      lastReview: '2024-01-12'
    },
    {
      id: 'R003',
      title: 'Climate Change Impact',
      category: 'environmental',
      probability: 'Medium',
      impact: 'Medium',
      riskLevel: 'Medium',
      description: 'Extreme weather events affecting project implementation',
      mitigation: 'Climate-resilient design, seasonal planning, emergency protocols',
      owner: 'Environmental Officer',
      status: 'Monitored',
      lastReview: '2024-01-10'
    },
    {
      id: 'R004',
      title: 'Security Challenges',
      category: 'political',
      probability: 'High',
      impact: 'High',
      riskLevel: 'Critical',
      description: 'Security threats in project areas affecting staff safety and operations',
      mitigation: 'Security assessments, coordination with authorities, evacuation plans',
      owner: 'Security Coordinator',
      status: 'Active',
      lastReview: '2024-01-14'
    },
    {
      id: 'R005',
      title: 'Technology Obsolescence',
      category: 'technical',
      probability: 'Low',
      impact: 'Medium',
      riskLevel: 'Low',
      description: 'Rapid technology changes making project solutions outdated',
      mitigation: 'Technology roadmap planning, flexible design, regular updates',
      owner: 'Technical Lead',
      status: 'Monitored',
      lastReview: '2024-01-08'
    }
  ];

  const mitigationActions = [
    {
      id: 'A001',
      riskId: 'R001',
      action: 'Implement monthly budget review meetings',
      responsible: 'Finance Team',
      dueDate: '2024-02-01',
      status: 'In Progress',
      priority: 'High'
    },
    {
      id: 'A002',
      riskId: 'R002',
      action: 'Develop contractor performance scorecard',
      responsible: 'Procurement Team',
      dueDate: '2024-01-25',
      status: 'Completed',
      priority: 'High'
    },
    {
      id: 'A003',
      riskId: 'R003',
      action: 'Conduct climate vulnerability assessment',
      responsible: 'Environmental Team',
      dueDate: '2024-02-15',
      status: 'Planned',
      priority: 'Medium'
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return <AlertTriangle className="text-red-500" size={16} />;
      case 'mitigated': return <Shield className="text-green-500" size={16} />;
      case 'monitored': return <Clock className="text-yellow-500" size={16} />;
      default: return <AlertCircle className="text-gray-500" size={16} />;
    }
  };

  const getActionStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-gray-100 text-gray-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRisks = selectedRiskCategory === 'all' 
    ? risks 
    : risks.filter(risk => risk.category === selectedRiskCategory);

  const riskStats = {
    total: risks.length,
    critical: risks.filter(r => r.riskLevel === 'Critical').length,
    high: risks.filter(r => r.riskLevel === 'High').length,
    medium: risks.filter(r => r.riskLevel === 'Medium').length,
    low: risks.filter(r => r.riskLevel === 'Low').length,
    active: risks.filter(r => r.status === 'Active').length,
    mitigated: risks.filter(r => r.status === 'Mitigated').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <AlertTriangle className="mr-3 text-green-600" size={32} />
                Risk Management
              </h1>
              <p className="text-lg text-gray-600">
                Identify, assess, and mitigate risks across NEDC development projects
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedRiskCategory}
                onChange={(e) => setSelectedRiskCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {riskCategories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setRiskView('matrix')}
                  className={`px-3 py-1 text-sm rounded ${
                    riskView === 'matrix' ? 'bg-white shadow' : 'text-gray-600'
                  }`}
                >
                  Risk Matrix
                </button>
                <button
                  onClick={() => setRiskView('register')}
                  className={`px-3 py-1 text-sm rounded ${
                    riskView === 'register' ? 'bg-white shadow' : 'text-gray-600'
                  }`}
                >
                  Risk Register
                </button>
                <button
                  onClick={() => setRiskView('mitigation')}
                  className={`px-3 py-1 text-sm rounded ${
                    riskView === 'mitigation' ? 'bg-white shadow' : 'text-gray-600'
                  }`}
                >
                  Mitigation
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Risks</p>
                <p className="text-3xl font-bold text-gray-900">{riskStats.critical}</p>
              </div>
              <AlertTriangle className="text-red-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Risks</p>
                <p className="text-3xl font-bold text-gray-900">{riskStats.high}</p>
              </div>
              <AlertCircle className="text-orange-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mitigated Risks</p>
                <p className="text-3xl font-bold text-gray-900">{riskStats.mitigated}</p>
              </div>
              <Shield className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Risks</p>
                <p className="text-3xl font-bold text-gray-900">{riskStats.total}</p>
              </div>
              <TrendingDown className="text-blue-500" size={32} />
            </div>
          </div>
        </div>

        {/* Risk Matrix View */}
        {riskView === 'matrix' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Risk Assessment Matrix</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div></div>
                <div className="text-center font-medium text-gray-700">Low Impact</div>
                <div className="text-center font-medium text-gray-700">Medium Impact</div>
                <div className="text-center font-medium text-gray-700">High Impact</div>
              </div>
              
              {['High Probability', 'Medium Probability', 'Low Probability'].map((prob, probIndex) => (
                <div key={prob} className="grid grid-cols-4 gap-4 mb-4">
                  <div className="font-medium text-gray-700 flex items-center">{prob}</div>
                  {['Low', 'Medium', 'High'].map((impact, impactIndex) => {
                    const cellRisks = filteredRisks.filter(risk => {
                      const riskProb = risk.probability.toLowerCase();
                      const riskImpact = risk.impact.toLowerCase();
                      return riskProb === prob.split(' ')[0].toLowerCase() && 
                             riskImpact === impact.toLowerCase();
                    });
                    
                    const riskLevel = probIndex === 0 && impactIndex === 2 ? 'Critical' :
                                     (probIndex === 0 && impactIndex === 1) || (probIndex === 1 && impactIndex === 2) ? 'High' :
                                     (probIndex === 0 && impactIndex === 0) || (probIndex === 1 && impactIndex === 1) || (probIndex === 2 && impactIndex === 2) ? 'Medium' : 'Low';
                    
                    return (
                      <div
                        key={`${prob}-${impact}`}
                        className={`p-4 rounded-lg border-2 min-h-[100px] ${getRiskColor(riskLevel)}`}
                      >
                        <div className="text-xs font-medium mb-2">{riskLevel}</div>
                        {cellRisks.map(risk => (
                          <div key={risk.id} className="text-xs mb-1 p-1 bg-white/50 rounded">
                            {risk.id}: {risk.title}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk Register View */}
        {riskView === 'register' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Risk Register</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Review
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRisks.map((risk) => (
                    <tr key={risk.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {risk.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{risk.title}</div>
                          <div className="text-gray-500 text-xs mt-1">{risk.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">
                          {risk.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getRiskColor(risk.riskLevel)}`}>
                          {risk.riskLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(risk.status)}
                          <span className="ml-2 text-sm text-gray-900">{risk.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {risk.owner}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(risk.lastReview).toLocaleDateString('en-GB')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mitigation Actions View */}
        {riskView === 'mitigation' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Mitigation Actions</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {mitigationActions.map((action) => {
                    const relatedRisk = risks.find(r => r.id === action.riskId);
                    return (
                      <div key={action.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{action.action}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Related to: {relatedRisk?.title} ({action.riskId})
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getActionStatusColor(action.status)}`}>
                            {action.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Responsible:</span>
                            <span className="ml-2 font-medium">{action.responsible}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Due Date:</span>
                            <span className="ml-2 font-medium">{new Date(action.dueDate).toLocaleDateString('en-GB')}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Priority:</span>
                            <span className={`ml-2 font-medium ${
                              action.priority === 'High' ? 'text-red-600' :
                              action.priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                            }`}>
                              {action.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Trends</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium text-red-800">New Risks This Month</span>
                    <span className="text-sm text-red-600">3</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-green-800">Risks Mitigated</span>
                    <span className="text-sm text-green-600">2</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-blue-800">Overdue Actions</span>
                    <span className="text-sm text-blue-600">1</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Categories</h3>
                <div className="space-y-3">
                  {riskCategories.slice(1).map(category => {
                    const categoryRisks = risks.filter(r => r.category === category.id);
                    const percentage = Math.round((categoryRisks.length / risks.length) * 100);
                    return (
                      <div key={category.id} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 capitalize">{category.name}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8">{categoryRisks.length}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskManagement;