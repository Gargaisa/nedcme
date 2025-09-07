import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Search, Filter, Database, Camera, Calendar } from 'lucide-react';

const HelpSection: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const helpSections = [
    {
      id: 'navigation',
      title: 'Navigation Guide',
      icon: <Database className="text-green-600" size={20} />,
      content: (
        <div className="space-y-3">
          <p><strong>Data Bank:</strong> Access all project-related information and reports.</p>
          <p><strong>Projects:</strong> View all projects or apply advanced filters to find specific data.</p>
          <p><strong>M&E Gallery:</strong> Browse project photos organized by year (2022-2026).</p>
          <p><strong>Admin:</strong> Monitor user activity and system access logs.</p>
          <p><strong>M&E Calendar:</strong> View scheduled monitoring and evaluation activities.</p>
        </div>
      )
    },
    {
      id: 'filtering',
      title: 'How to Filter Projects',
      icon: <Filter className="text-blue-600" size={20} />,
      content: (
        <div className="space-y-3">
          <p><strong>Step 1:</strong> Navigate to "Filter Projects" from the Data Bank menu.</p>
          <p><strong>Step 2:</strong> Select your desired filters:</p>
          <ul className="ml-4 space-y-1">
            <li>• <strong>Pillars:</strong> Choose from 11 development pillars</li>
            <li>• <strong>States:</strong> Select from 6 North East states</li>
            <li>• <strong>LGAs:</strong> Choose specific Local Government Areas</li>
            <li>• <strong>Status:</strong> Filter by project completion status</li>
          </ul>
          <p><strong>Step 3:</strong> Click "Apply Filters" to view results.</p>
          <p><strong>Step 4:</strong> Use "Print" or "Email" buttons to export your filtered data.</p>
        </div>
      )
    },
    {
      id: 'search',
      title: 'Search Functionality',
      icon: <Search className="text-purple-600" size={20} />,
      content: (
        <div className="space-y-3">
          <p>Use the search bar to quickly find projects by:</p>
          <ul className="ml-4 space-y-1">
            <li>• Project description or title</li>
            <li>• Contractor name</li>
            <li>• Community name</li>
            <li>• Any text within project details</li>
          </ul>
          <p>The search is case-insensitive and searches across all project fields simultaneously.</p>
        </div>
      )
    },
    {
      id: 'gallery',
      title: 'M&E Gallery Usage',
      icon: <Camera className="text-orange-600" size={20} />,
      content: (
        <div className="space-y-3">
          <p>The M&E Gallery contains project monitoring photos from 2022-2026:</p>
          <ul className="ml-4 space-y-1">
            <li>• Photos are organized by year for easy browsing</li>
            <li>• Click on any image to view full-size version</li>
            <li>• Images shown in the homepage slideshow come from this gallery</li>
            <li>• Use year filters to view specific time periods</li>
          </ul>
        </div>
      )
    },
    {
      id: 'calendar',
      title: 'M&E Calendar Features',
      icon: <Calendar className="text-red-600" size={20} />,
      content: (
        <div className="space-y-3">
          <p>The M&E Calendar helps you track monitoring activities:</p>
          <ul className="ml-4 space-y-1">
            <li>• View scheduled field visits and evaluations</li>
            <li>• Track project milestone dates</li>
            <li>• Monitor reporting deadlines</li>
            <li>• Plan upcoming M&E activities</li>
          </ul>
          <p>Switch between monthly, weekly, and daily views for better planning.</p>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <HelpCircle className="text-green-600 mr-3" size={40} />
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">Help & Instructions</h2>
        </div>
        <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed">
          Learn how to navigate and use the NEDC Monitoring & Evaluation Database effectively
        </p>
      </div>

      <div className="space-y-4">
        {helpSections.map((section) => (
          <div key={section.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                {section.icon}
                <h3 className="text-xl font-bold text-gray-900 ml-4">{section.title}</h3>
              </div>
              {expandedSection === section.id ? (
                <ChevronUp className="text-gray-500" size={24} />
              ) : (
                <ChevronDown className="text-gray-500" size={24} />
              )}
            </button>
            
            {expandedSection === section.id && (
              <div className="px-6 pb-6 text-gray-700 border-t border-gray-100">
                <div className="pt-4">
                  {section.content}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Tips */}
      <div className="mt-8 bg-green-50 rounded-lg p-6 border border-green-200">
        <h3 className="text-xl font-bold text-green-800 mb-4">Quick Tips</h3>
        <ul className="space-y-3 text-green-700 text-base">
          <li>• Use the mobile menu button (☰) on smaller screens to access navigation</li>
          <li>• Multiple selections are allowed in all filter categories</li>
          <li>• Click column headers in data tables to sort information</li>
          <li>• Use "Select All" options to quickly choose entire filter categories</li>
          <li>• Export filtered results using Print or Email functions</li>
        </ul>
      </div>
    </div>
  );
};

export default HelpSection;