import React, { useState } from 'react';
import {
  Menu, Database, FolderOpen, Camera, Users, Calendar, HelpCircle,
  ChevronDown, FileText, MapPin, AlertCircle, Target, TrendingUp
} from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const iconSize = 18;
const indentBase = 16;
const indentStep = 12;

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  // 👇 Sidebar closed by default
  const [isOpen, setIsOpen] = useState(false);
  const [openL1, setOpenL1] = useState<string | null>(null);
  const [openL2, setOpenL2] = useState<string | null>(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navigate = (page: string) => {
    onPageChange(page);
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  return (
    <>
      {/* Burger button positioned below the header */}
      <button
        onClick={toggleSidebar}
        className="fixed top-16 left-4 z-50 bg-emerald-600 text-white p-2 rounded-md shadow-md hover:bg-emerald-700"
      >
        <Menu size={20} />
      </button>

      {/* Overlay closes sidebar when empty space is clicked */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-80 bg-white border-r border-gray-200 z-40
                    transform transition-transform duration-200
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header – no close icon */}
        <div className="p-6 border-b border-gray-100 flex items-center">
          <Database className="text-emerald-600 mr-3" size={24} />
          <h1 className="text-xl font-bold text-gray-800">Data Bank</h1>
        </div>

        {/* Scrollable menu */}
        <nav className="p-2 space-y-1 h-[calc(100vh-88px)] overflow-y-auto">
          {/* Homepage */}
          <button
            onClick={() => navigate('home')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                        ${currentPage === 'home'
                          ? 'bg-emerald-500 text-white'
                          : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <Database size={iconSize} />
            <span>Homepage</span>
          </button>

          {/* Projects (Monitoring) */}
          <div>
            <button
              onClick={() =>
                setOpenL1(openL1 === 'monitoring' ? null : 'monitoring')
              }
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                          ${openL1 === 'monitoring'
                            ? 'bg-blue-50 text-blue-800'
                            : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FolderOpen size={iconSize} className="text-blue-600" />
              <span>Projects (Monitoring)</span>
              <ChevronDown
                size={16}
                className={`ml-auto transition-transform ${
                  openL1 === 'monitoring' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openL1 === 'monitoring' && (
              <div className="space-y-1">
                {[
                  { key: 'all-projects', label: 'All Projects', icon: FolderOpen },
                  { key: 'filter-projects', label: 'Filter Projects', icon: FolderOpen },
                  { key: 'monitoring-analysis', label: 'Monitoring Analysis', icon: Target },
                  { key: 'monitoring-report', label: 'Monitoring Report', icon: FileText },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => navigate(key)}
                    style={{ paddingLeft: `${indentBase + indentStep}px` }}
                    className={`w-full flex items-center gap-3 py-2.5 rounded text-sm
                                ${currentPage === key
                                  ? 'bg-emerald-500 text-white'
                                  : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Projects (Evaluation) */}
          <div>
            <button
              onClick={() =>
                setOpenL1(openL1 === 'evaluation' ? null : 'evaluation')
              }
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                          ${openL1 === 'evaluation'
                            ? 'bg-purple-50 text-purple-800'
                            : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FileText size={iconSize} className="text-purple-600" />
              <span>Projects (Evaluation)</span>
              <ChevronDown
                size={16}
                className={`ml-auto transition-transform ${
                  openL1 === 'evaluation' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openL1 === 'evaluation' && (
              <div className="space-y-1">
                {/* Data Collection */}
                <div>
                  <button
                    onClick={() =>
                      setOpenL2(openL2 === 'data-collection' ? null : 'data-collection')
                    }
                    style={{ paddingLeft: `${indentBase + indentStep}px` }}
                    className="w-full flex items-center gap-3 py-2.5 rounded text-sm text-gray-700 hover:bg-purple-25"
                  >
                    <Database size={16} />
                    <span>Data Collection</span>
                    <ChevronDown
                      size={14}
                      className={`ml-auto transition-transform ${
                        openL2 === 'data-collection' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {openL2 === 'data-collection' && (
                    <div className="space-y-1">
                      {[
                        { key: 'operations-directorate', label: 'Operations Directorate', icon: FolderOpen },
                        { key: 'humanitarian-directorate', label: 'Humanitarian Directorate', icon: FolderOpen },
                        { key: 'challenges-recommendations', label: 'Challenges & Recommendations', icon: AlertCircle },
                        { key: 'evaluation-analysis', label: 'Evaluation Analysis', icon: TrendingUp },
                        { key: 'evaluation-report', label: 'Evaluation Report', icon: FileText },
                      ].map(({ key, label, icon: Icon }) => (
                        <button
                          key={key}
                          onClick={() => navigate(key)}
                          style={{ paddingLeft: `${indentBase + 2 * indentStep}px` }}
                          className={`w-full flex items-center gap-3 py-2.5 rounded text-sm
                                      ${currentPage === key
                                        ? 'bg-emerald-500 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                          <Icon size={16} />
                          <span>{label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {[
                  { key: 'risk-management', label: 'Risk Management', icon: AlertCircle },
                  { key: 'geographic-mapping', label: 'Geographic Mapping', icon: MapPin },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => navigate(key)}
                    style={{ paddingLeft: `${indentBase + indentStep}px` }}
                    className={`w-full flex items-center gap-3 py-2.5 rounded text-sm
                                ${currentPage === key
                                  ? 'bg-emerald-500 text-white'
                                  : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Other top-level items */}
          {[
            { key: 'gallery', label: 'M&E Gallery', icon: Camera },
            { key: 'calendar', label: 'M&E Calendar', icon: Calendar },
            { key: 'help', label: 'Help and Instructions', icon: HelpCircle },
            { key: 'admin', label: 'Admin', icon: Users },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => navigate(key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                          ${currentPage === key
                            ? 'bg-pink-500 text-white'
                            : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Icon size={iconSize} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Navigation;