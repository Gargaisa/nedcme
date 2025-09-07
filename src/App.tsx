import React, { useState } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import ProjectSlideshow from './components/ProjectSlideshow';
import DashboardStats from './components/DashboardStats';
import HelpSection from './components/HelpSection';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import AllProjects from './pages/AllProjects';
import FilterProjects from './pages/FilterProjects';
import Gallery from './pages/Gallery';
import Admin from './pages/Admin';
import Calendar from './pages/Calendar';
import Help from './pages/Help';
import DataCollection from './pages/DataCollection';
import Indicators from './pages/Indicators';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import ImpactAssessment from './pages/ImpactAssessment';
import GeographicMapping from './pages/GeographicMapping';
import RiskManagement from './pages/RiskManagement';

type Page = 'home' | 'all-projects' | 'filter-projects' | 'gallery' | 'admin' | 'calendar' | 'help' | 'data-collection' | 'indicators' | 'analytics' | 'reports' | 'impact-assessment' | 'mapping' | 'risk-management';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [filterState, setFilterState] = useState<any>(null);

  const handleAINavigation = (page: string, filters?: any) => {
    setCurrentPage(page as Page);
    if (filters) {
      setFilterState(filters);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'all-projects':
        return <AllProjects />;
      case 'filter-projects':
        return <FilterProjects initialFilters={filterState} />;
      case 'gallery':
        return <Gallery />;
      case 'admin':
        return <Admin />;
      case 'calendar':
        return <Calendar />;
      case 'help':
        return <Help />;
      case 'data-collection':
        return <DataCollection />;
      case 'indicators':
        return <Indicators />;
      case 'analytics':
        return <Analytics />;
      case 'reports':
        return <Reports />;
      case 'impact-assessment':
        return <ImpactAssessment />;
      case 'mapping':
        return <GeographicMapping />;
      case 'risk-management':
        return <RiskManagement />;
      default:
        return (
          <div className="min-h-screen bg-gray-50">
            {/* Hero Section with Slideshow */}
            <section className="bg-white shadow-sm">
              <div className="w-full px-6 sm:px-8 lg:px-12 py-12">
                <div className="text-center mb-8">
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                    Monitoring & Evaluation Dashboard
                  </h1>
                  <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                    Track and monitor development projects across the North East region. 
                    Access comprehensive data, reports, and insights on NEDC's impact initiatives.
                  </p>
                </div>
                <ProjectSlideshow />
              </div>
            </section>

            {/* Dashboard Statistics */}
            <section className="py-16">
              <div className="w-full px-6 sm:px-8 lg:px-12">
                <DashboardStats />
              </div>
            </section>

            {/* Help Section */}
            <section className="bg-white py-16">
              <div className="w-full px-6 sm:px-8 lg:px-12">
                <HelpSection />
              </div>
            </section>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="min-h-screen w-full">
        {renderPage()}
      </main>
      {currentPage === 'home' && <AIAssistant onNavigate={handleAINavigation} />}
      {currentPage === 'home' && <Footer />}
    </div>
  );
}

export default App;