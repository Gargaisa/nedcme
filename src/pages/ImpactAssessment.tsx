import React, { useState } from 'react';
import { Activity, Users, TrendingUp, Award, Target, CheckCircle } from 'lucide-react';

const ImpactAssessment: React.FC = () => {
  const [selectedAssessment, setSelectedAssessment] = useState<string>('overview');

  const impactMetrics = [
    {
      id: 'beneficiaries',
      title: 'Direct Beneficiaries Reached',
      value: '2,450,000',
      change: '+15%',
      trend: 'up',
      description: 'Individuals directly impacted by NEDC projects'
    },
    {
      id: 'communities',
      title: 'Communities Transformed',
      value: '1,247',
      change: '+8%',
      trend: 'up',
      description: 'Communities with completed development projects'
    },
    {
      id: 'livelihoods',
      title: 'Livelihoods Improved',
      value: '890,000',
      change: '+22%',
      trend: 'up',
      description: 'People with enhanced economic opportunities'
    },
    {
      id: 'infrastructure',
      title: 'Infrastructure Projects',
      value: '456',
      change: '+12%',
      trend: 'up',
      description: 'Roads, schools, hospitals, and other facilities built'
    }
  ];

  const pillarImpacts = [
    {
      pillar: 'Leadership in Agriculture',
      impact: 'High',
      beneficiaries: 450000,
      keyAchievements: [
        'Increased crop yields by 35%',
        'Established 120 irrigation systems',
        'Trained 25,000 farmers in modern techniques'
      ],
      challenges: ['Climate change adaptation', 'Market access limitations']
    },
    {
      pillar: 'Educational Populace',
      impact: 'High',
      beneficiaries: 380000,
      keyAchievements: [
        'Built 89 new schools',
        'Trained 1,200 teachers',
        'Improved literacy rates by 28%'
      ],
      challenges: ['Teacher retention', 'Infrastructure maintenance']
    },
    {
      pillar: 'Healthy Citizens',
      impact: 'Medium',
      beneficiaries: 320000,
      keyAchievements: [
        'Established 45 health centers',
        'Reduced infant mortality by 18%',
        'Vaccinated 150,000 children'
      ],
      challenges: ['Medical equipment maintenance', 'Staff shortages']
    },
    {
      pillar: 'Purposeful Infrastructure',
      impact: 'High',
      beneficiaries: 600000,
      keyAchievements: [
        'Constructed 234 km of roads',
        'Built 67 bridges',
        'Connected 89 communities to power grid'
      ],
      challenges: ['Maintenance costs', 'Environmental impact']
    }
  ];

  const assessmentTypes = [
    { id: 'overview', title: 'Impact Overview', icon: <Activity size={20} /> },
    { id: 'social', title: 'Social Impact', icon: <Users size={20} /> },
    { id: 'economic', title: 'Economic Impact', icon: <TrendingUp size={20} /> },
    { id: 'environmental', title: 'Environmental Impact', icon: <Target size={20} /> }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Activity className="mr-3 text-green-600" size={32} />
            Impact Assessment
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive assessment of NEDC project impacts on communities and development outcomes
          </p>
        </div>

        {/* Assessment Type Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {assessmentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedAssessment(type.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                    selectedAssessment === type.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {type.icon}
                  <span className="ml-2">{type.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Impact Overview */}
        {selectedAssessment === 'overview' && (
          <div className="space-y-8">
            {/* Key Impact Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {impactMetrics.map((metric) => (
                <div key={metric.id} className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
                    <span className={`text-sm font-medium ${
                      metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</p>
                  <p className="text-sm text-gray-500">{metric.description}</p>
                </div>
              ))}
            </div>

            {/* Pillar Impact Analysis */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Impact by Development Pillar</h3>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {pillarImpacts.map((pillar, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium text-gray-900">{pillar.pillar}</h4>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getImpactColor(pillar.impact)}`}>
                            {pillar.impact} Impact
                          </span>
                          <span className="text-sm text-gray-500">
                            {pillar.beneficiaries.toLocaleString()} beneficiaries
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-green-800 mb-2 flex items-center">
                            <CheckCircle className="mr-2" size={16} />
                            Key Achievements
                          </h5>
                          <ul className="space-y-1">
                            {pillar.keyAchievements.map((achievement, idx) => (
                              <li key={idx} className="text-sm text-gray-600 flex items-start">
                                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-orange-800 mb-2 flex items-center">
                            <Target className="mr-2" size={16} />
                            Ongoing Challenges
                          </h5>
                          <ul className="space-y-1">
                            {pillar.challenges.map((challenge, idx) => (
                              <li key={idx} className="text-sm text-gray-600 flex items-start">
                                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {challenge}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Social Impact */}
        {selectedAssessment === 'social' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <Users className="mx-auto h-12 w-12 text-green-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Social Impact Assessment</h3>
              <p className="text-gray-600 mb-8">
                Detailed analysis of social outcomes and community transformation
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Education Impact</h4>
                  <p className="text-2xl font-bold text-blue-600 mb-2">380,000</p>
                  <p className="text-sm text-blue-700">Students benefited from improved educational facilities</p>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Health Impact</h4>
                  <p className="text-2xl font-bold text-green-600 mb-2">320,000</p>
                  <p className="text-sm text-green-700">People with improved access to healthcare</p>
                </div>
                
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Community Empowerment</h4>
                  <p className="text-2xl font-bold text-purple-600 mb-2">1,247</p>
                  <p className="text-sm text-purple-700">Communities with enhanced social cohesion</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Economic Impact */}
        {selectedAssessment === 'economic' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <TrendingUp className="mx-auto h-12 w-12 text-green-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Economic Impact Assessment</h3>
              <p className="text-gray-600 mb-8">
                Economic outcomes and livelihood improvements from NEDC interventions
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Jobs Created</h4>
                  <p className="text-2xl font-bold text-green-600 mb-2">125,000</p>
                  <p className="text-sm text-green-700">Direct and indirect employment opportunities</p>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Income Increase</h4>
                  <p className="text-2xl font-bold text-blue-600 mb-2">35%</p>
                  <p className="text-sm text-blue-700">Average household income improvement</p>
                </div>
                
                <div className="bg-orange-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Economic Value</h4>
                  <p className="text-2xl font-bold text-orange-600 mb-2">₦2.8B</p>
                  <p className="text-sm text-orange-700">Total economic value generated</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Environmental Impact */}
        {selectedAssessment === 'environmental' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <Target className="mx-auto h-12 w-12 text-green-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Environmental Impact Assessment</h3>
              <p className="text-gray-600 mb-8">
                Environmental sustainability and conservation outcomes
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Trees Planted</h4>
                  <p className="text-2xl font-bold text-green-600 mb-2">450,000</p>
                  <p className="text-sm text-green-700">Reforestation and afforestation initiatives</p>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Water Conservation</h4>
                  <p className="text-2xl font-bold text-blue-600 mb-2">2.5M</p>
                  <p className="text-sm text-blue-700">Liters of water saved through efficient systems</p>
                </div>
                
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Carbon Offset</h4>
                  <p className="text-2xl font-bold text-purple-600 mb-2">15,000</p>
                  <p className="text-sm text-purple-700">Tons of CO2 equivalent offset</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImpactAssessment;