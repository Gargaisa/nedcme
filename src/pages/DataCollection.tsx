import React, { useState, useEffect } from 'react';
import { Database, Upload, Download, FileText, Plus, Calendar, MapPin, Users, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const DataCollection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'forms' | 'uploads' | 'validation'>('forms');
  const [loading, setLoading] = useState(false);

  const dataCollectionForms = [
    {
      id: 'project-intake',
      title: 'Project Intake Form',
      description: 'Initial project registration and baseline data collection',
      icon: <Plus className="text-blue-600" size={20} />,
      fields: 15,
      status: 'active'
    },
    {
      id: 'monitoring-visit',
      title: 'Monitoring Visit Form',
      description: 'Field monitoring and progress assessment data',
      icon: <CheckCircle className="text-green-600" size={20} />,
      fields: 12,
      status: 'active'
    },
    {
      id: 'beneficiary-survey',
      title: 'Beneficiary Survey',
      description: 'Community impact and satisfaction assessment',
      icon: <Users className="text-purple-600" size={20} />,
      fields: 20,
      status: 'active'
    },
    {
      id: 'completion-report',
      title: 'Project Completion Report',
      description: 'Final project outcomes and deliverables documentation',
      icon: <FileText className="text-orange-600" size={20} />,
      fields: 18,
      status: 'active'
    }
  ];

  const recentUploads = [
    {
      id: '1',
      filename: 'Q4_2024_Monitoring_Data.xlsx',
      type: 'Excel',
      size: '2.4 MB',
      uploadedBy: 'M&E Officer',
      uploadDate: '2024-01-15',
      status: 'processed'
    },
    {
      id: '2',
      filename: 'Adamawa_Field_Photos.zip',
      type: 'Images',
      size: '15.7 MB',
      uploadedBy: 'Field Coordinator',
      uploadDate: '2024-01-14',
      status: 'processing'
    },
    {
      id: '3',
      filename: 'Beneficiary_Survey_Responses.csv',
      type: 'CSV',
      size: '890 KB',
      uploadedBy: 'Data Analyst',
      uploadDate: '2024-01-13',
      status: 'processed'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Database className="mr-3 text-green-600" size={32} />
            Data Collection
          </h1>
          <p className="text-lg text-gray-600">
            Manage data collection forms, file uploads, and data validation processes
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('forms')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'forms'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="inline mr-2" size={16} />
                Data Forms
              </button>
              <button
                onClick={() => setActiveTab('uploads')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'uploads'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Upload className="inline mr-2" size={16} />
                File Uploads
              </button>
              <button
                onClick={() => setActiveTab('validation')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'validation'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <CheckCircle className="inline mr-2" size={16} />
                Data Validation
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'forms' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dataCollectionForms.map((form) => (
              <div key={form.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    {form.icon}
                    <h3 className="text-lg font-semibold text-gray-900 ml-3">{form.title}</h3>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    form.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {form.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{form.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{form.fields} fields</span>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                      View Form
                    </button>
                    <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
                      Collect Data
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'uploads' && (
          <div className="space-y-6">
            {/* Upload Area */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Data Files</h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop files here, or click to select files
                </p>
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Select Files
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Supported formats: Excel (.xlsx), CSV (.csv), Images (.jpg, .png), Documents (.pdf)
                </p>
              </div>
            </div>

            {/* Recent Uploads */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Uploads</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        File
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Uploaded By
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentUploads.map((upload) => (
                      <tr key={upload.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText className="mr-3 text-gray-400" size={16} />
                            <span className="text-sm font-medium text-gray-900">{upload.filename}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {upload.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {upload.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {upload.uploadedBy}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(upload.uploadDate).toLocaleDateString('en-GB')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            upload.status === 'processed' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {upload.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'validation' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Data Validation</h3>
              <p className="text-gray-600 mb-4">
                Automated data quality checks and validation rules
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800">Valid Records</h4>
                  <p className="text-2xl font-bold text-green-600">1,247</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-800">Pending Review</h4>
                  <p className="text-2xl font-bold text-yellow-600">23</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-red-800">Errors Found</h4>
                  <p className="text-2xl font-bold text-red-600">5</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataCollection;