import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, BarChart3, PieChart, TrendingUp, Mail } from 'lucide-react';

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [reportParams, setReportParams] = useState({
    dateRange: 'last-quarter',
    states: [] as string[],
    pillars: [] as string[],
    status: [] as string[],
    format: 'pdf'
  });
  const [generating, setGenerating] = useState(false);

  const reportTypes = [
    {
      id: 'executive-summary',
      title: 'Executive Summary Report',
      description: 'High-level overview of project performance and key metrics',
      icon: <BarChart3 className="text-blue-600" size={20} />,
      frequency: 'Monthly/Quarterly',
      audience: 'Senior Management'
    },
    {
      id: 'project-status',
      title: 'Project Status Report',
      description: 'Detailed status of all projects including progress and milestones',
      icon: <FileText className="text-green-600" size={20} />,
      frequency: 'Weekly/Monthly',
      audience: 'Project Managers'
    },
    {
      id: 'financial-report',
      title: 'Financial Performance Report',
      description: 'Budget utilization, disbursements, and financial analysis',
      icon: <TrendingUp className="text-purple-600" size={20} />,
      frequency: 'Monthly/Quarterly',
      audience: 'Finance Team'
    },
    {
      id: 'geographic-analysis',
      title: 'Geographic Distribution Report',
      description: 'Project distribution and impact across states and LGAs',
      icon: <PieChart className="text-orange-600" size={20} />,
      frequency: 'Quarterly',
      audience: 'Regional Coordinators'
    },
    {
      id: 'pillar-performance',
      title: 'Development Pillar Report',
      description: 'Performance analysis by development pillars and sectors',
      icon: <BarChart3 className="text-red-600" size={20} />,
      frequency: 'Quarterly',
      audience: 'Sector Specialists'
    },
    {
      id: 'beneficiary-impact',
      title: 'Beneficiary Impact Report',
      description: 'Community impact assessment and beneficiary feedback',
      icon: <FileText className="text-indigo-600" size={20} />,
      frequency: 'Bi-annually',
      audience: 'M&E Team'
    }
  ];

  const predefinedReports = [
    {
      id: '1',
      title: 'Q4 2024 Executive Summary',
      type: 'Executive Summary',
      generatedDate: '2024-01-15',
      size: '2.4 MB',
      format: 'PDF',
      status: 'ready'
    },
    {
      id: '2',
      title: 'December 2024 Project Status',
      type: 'Project Status',
      generatedDate: '2024-01-10',
      size: '5.7 MB',
      format: 'Excel',
      status: 'ready'
    },
    {
      id: '3',
      title: 'Annual Financial Report 2024',
      type: 'Financial Performance',
      generatedDate: '2024-01-08',
      size: '3.2 MB',
      format: 'PDF',
      status: 'ready'
    },
    {
      id: '4',
      title: 'Geographic Analysis Q4 2024',
      type: 'Geographic Distribution',
      generatedDate: '2024-01-05',
      size: '4.1 MB',
      format: 'PDF',
      status: 'processing'
    }
  ];

  const handleGenerateReport = async () => {
    if (!selectedReport) {
      alert('Please select a report type');
      return;
    }

    setGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setGenerating(false);
      alert('Report generated successfully! Check your downloads folder.');
    }, 3000);
  };

  const handleDownloadReport = (reportId: string) => {
    // Simulate download
    alert(`Downloading report ${reportId}...`);
  };

  const handleEmailReport = (reportId: string) => {
    const subject = encodeURIComponent('NEDC M&E Report');
    const body = encodeURIComponent(`
Dear Recipient,

Please find attached the requested NEDC Monitoring & Evaluation report.

This report was generated from the NEDC M&E Database System.

Best regards,
NEDC M&E Team
    `);
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <FileText className="mr-3 text-green-600" size={32} />
            Generate Reports
          </h1>
          <p className="text-lg text-gray-600">
            Create comprehensive reports for monitoring and evaluation activities
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Report Generation */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Types */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Select Report Type</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportTypes.map((report) => (
                    <div
                      key={report.id}
                      onClick={() => setSelectedReport(report.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedReport === report.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {report.icon}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{report.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">{report.frequency}</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {report.audience}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Report Parameters */}
            {selectedReport && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Report Parameters</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Range
                      </label>
                      <select
                        value={reportParams.dateRange}
                        onChange={(e) => setReportParams(prev => ({ ...prev, dateRange: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="last-month">Last Month</option>
                        <option value="last-quarter">Last Quarter</option>
                        <option value="last-6-months">Last 6 Months</option>
                        <option value="last-year">Last Year</option>
                        <option value="custom">Custom Range</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Output Format
                      </label>
                      <select
                        value={reportParams.format}
                        onChange={(e) => setReportParams(prev => ({ ...prev, format: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="pdf">PDF Document</option>
                        <option value="excel">Excel Spreadsheet</option>
                        <option value="word">Word Document</option>
                        <option value="powerpoint">PowerPoint Presentation</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Filters (Optional)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option value="">All States</option>
                        <option value="adamawa">Adamawa</option>
                        <option value="bauchi">Bauchi</option>
                        <option value="borno">Borno</option>
                        <option value="gombe">Gombe</option>
                        <option value="taraba">Taraba</option>
                        <option value="yobe">Yobe</option>
                      </select>
                      
                      <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option value="">All Pillars</option>
                        <option value="agriculture">Leadership in Agriculture</option>
                        <option value="education">Educational populace</option>
                        <option value="health">Healthy citizens</option>
                      </select>
                      
                      <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option value="">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="abandoned">Abandoned</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleGenerateReport}
                      disabled={generating}
                      className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {generating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <FileText className="mr-2" size={16} />
                          Generate Report
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Reports */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
              </div>
              <div className="p-6 space-y-4">
                {predefinedReports.map((report) => (
                  <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{report.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        report.status === 'ready' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{report.type}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>{new Date(report.generatedDate).toLocaleDateString('en-GB')}</span>
                      <span>{report.size} • {report.format}</span>
                    </div>
                    {report.status === 'ready' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDownloadReport(report.id)}
                          className="flex items-center px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                        >
                          <Download className="mr-1" size={12} />
                          Download
                        </button>
                        <button
                          onClick={() => handleEmailReport(report.id)}
                          className="flex items-center px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                        >
                          <Mail className="mr-1" size={12} />
                          Email
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Schedule</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-blue-800">Monthly Status Report</span>
                    <p className="text-xs text-blue-600">Due: End of month</p>
                  </div>
                  <Calendar className="text-blue-600" size={16} />
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-green-800">Quarterly Review</span>
                    <p className="text-xs text-green-600">Due: March 31st</p>
                  </div>
                  <Calendar className="text-green-600" size={16} />
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-purple-800">Annual Report</span>
                    <p className="text-xs text-purple-600">Due: December 31st</p>
                  </div>
                  <Calendar className="text-purple-600" size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;