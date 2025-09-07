import React, { useState } from 'react';
import { Search, Download, Mail, Printer, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { Project } from '../lib/supabase';

interface ProjectsTableProps {
  projects: Project[];
  loading: boolean;
  onPrint: () => void;
  onEmail: () => void;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ 
  projects, 
  loading, 
  onPrint, 
  onEmail 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Project>('sn');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filter projects based on search term
  const filteredProjects = projects.filter(project =>
    Object.values(project).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  // Paginate projects
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = sortedProjects.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: keyof Project) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount).replace('$', '₦');
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const SortableHeader = ({ field, children }: { field: keyof Project; children: React.ReactNode }) => (
    <th
      onClick={() => handleSort(field)}
      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <ArrowUpDown size={12} className="text-gray-400" />
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-2 text-gray-600">Loading projects...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full">
      {/* Table Header with Search and Actions */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Projects Database</h2>
            <p className="text-base text-gray-600 mt-2 font-medium">
              Showing {paginatedProjects.length} of {filteredProjects.length} projects
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full sm:w-80"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={onPrint}
                className="flex items-center px-5 py-3 bg-blue-600 text-white text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                <Printer className="mr-2" size={18} />
                Print
              </button>
              <button
                onClick={onEmail}
                className="flex items-center px-5 py-3 bg-green-600 text-white text-base font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md"
              >
                <Mail className="mr-2" size={18} />
                Email
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortableHeader field="sn">S/N</SortableHeader>
              <SortableHeader field="pillars">Pillars</SortableHeader>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project Description
              </th>
              <SortableHeader field="state">State</SortableHeader>
              <SortableHeader field="lga">LGA</SortableHeader>
              <SortableHeader field="community">Community</SortableHeader>
              <SortableHeader field="status">Status</SortableHeader>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Remarks
              </th>
              <SortableHeader field="contract_amount">Contract Amount</SortableHeader>
              <SortableHeader field="amount_disbursed">Amount Disbursed</SortableHeader>
              <SortableHeader field="date_of_award">Date of Award</SortableHeader>
              <SortableHeader field="date_of_completion">Date of Completion</SortableHeader>
              <SortableHeader field="contractor">Contractor</SortableHeader>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedProjects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {project.sn}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  <div className="text-sm text-gray-900">
                    {Array.isArray(project.pillars) 
                      ? project.pillars.join(', ')
                      : project.pillars || 'N/A'
                    }
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900 max-w-sm">
                  <div className="truncate" title={project.project_description}>
                    {project.project_description}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {project.state}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {project.lga}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {project.community}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    project.status.includes('Completed') 
                      ? 'bg-green-100 text-green-800'
                      : project.status === 'Ongoing'
                      ? 'bg-blue-100 text-blue-800'
                      : project.status === 'Abandoned'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900 max-w-sm">
                  <div className="truncate" title={project.remarks || ''}>
                    {project.remarks || 'N/A'}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(project.contract_amount)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(project.amount_disbursed)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(project.date_of_award)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(project.date_of_completion)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {project.contractor || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProjects.length)} of {filteredProjects.length} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg ${
                        currentPage === page
                          ? 'bg-green-600 text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsTable;