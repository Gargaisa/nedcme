import React, { useState, useEffect } from 'react';
import { supabase, Project } from '../lib/supabase';
import ProjectsTable from '../components/ProjectsTable';

const AllProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('sn', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    const subject = encodeURIComponent('NEDC Projects Report');
    const body = encodeURIComponent(`
Dear Recipient,

Please find attached the NEDC Projects Report containing ${projects.length} projects.

This report was generated from the NEDC Monitoring & Evaluation Database.

Best regards,
NEDC M&E Team
    `);
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 lg:ml-80">
        <div className="w-full px-6 sm:px-8 lg:px-12 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h1 className="text-xl font-bold text-red-800 mb-2">Error Loading Projects</h1>
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchProjects}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Projects</h1>
          <p className="text-lg text-gray-600">
            Complete database of all NEDC development projects across the North East region
          </p>
        </div>

        <ProjectsTable
          projects={projects}
          loading={loading}
          onPrint={handlePrint}
          onEmail={handleEmail}
        />
      </div>
    </div>
  );
};

export default AllProjects;