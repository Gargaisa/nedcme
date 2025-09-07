import React, { useState, useEffect } from 'react';
import { supabase, Project } from '../lib/supabase';
import ProjectFilters, { FilterState } from '../components/ProjectFilters';
import ProjectsTable from '../components/ProjectsTable';

interface FilterProjectsProps {
  initialFilters?: FilterState;
}

const FilterProjects: React.FC<FilterProjectsProps> = ({ initialFilters }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(initialFilters || {
    pillars: [],
    states: [],
    lgas: [],
    status: []
  });

  useEffect(() => {
    fetchAllProjects();
  }, []);

  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
      // Auto-apply filters if they were passed from AI assistant
      setTimeout(() => {
        applyFilters();
      }, 100);
    }
  }, [initialFilters]);

  const fetchAllProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('sn', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
      setFilteredProjects(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...projects];

    // Filter by pillars
    if (filters.pillars.length > 0) {
      filtered = filtered.filter(project =>
        filters.pillars.some(pillar => project.pillars.includes(pillar))
      );
    }

    // Filter by states
    if (filters.states.length > 0) {
      filtered = filtered.filter(project =>
        filters.states.includes(project.state)
      );
    }

    // Filter by LGAs
    if (filters.lgas.length > 0) {
      filtered = filtered.filter(project =>
        filters.lgas.includes(project.lga)
      );
    }

    // Filter by status
    if (filters.status.length > 0) {
      filtered = filtered.filter(project =>
        filters.status.includes(project.status)
      );
    }

    setFilteredProjects(filtered);
  };

  const clearFilters = () => {
    setFilters({
      pillars: [],
      states: [],
      lgas: [],
      status: []
    });
    setFilteredProjects(projects);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    const subject = encodeURIComponent('NEDC Filtered Projects Report');
    const body = encodeURIComponent(`
Dear Recipient,

Please find attached the NEDC Filtered Projects Report containing ${filteredProjects.length} projects.

Applied Filters:
- Pillars: ${filters.pillars.length > 0 ? filters.pillars.join(', ') : 'All'}
- States: ${filters.states.length > 0 ? filters.states.join(', ') : 'All'}
- LGAs: ${filters.lgas.length > 0 ? filters.lgas.join(', ') : 'All'}
- Status: ${filters.status.length > 0 ? filters.status.join(', ') : 'All'}

This report was generated from the NEDC Monitoring & Evaluation Database.

Best regards,
NEDC M&E Team
    `);
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 lg:ml-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h1 className="text-xl font-bold text-red-800 mb-2">Error Loading Projects</h1>
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchAllProjects}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Filter Projects</h1>
          <p className="text-lg text-gray-600">
            Use advanced filters to find specific projects based on pillars, location, and status
          </p>
        </div>

        <div className="space-y-6">
          <ProjectFilters
            filters={filters}
            onFiltersChange={setFilters}
            onApplyFilters={applyFilters}
            onClearFilters={clearFilters}
          />

          <ProjectsTable
            projects={filteredProjects}
            loading={loading}
            onPrint={handlePrint}
            onEmail={handleEmail}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterProjects;