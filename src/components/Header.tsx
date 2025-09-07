import React from 'react';
import { ExternalLink } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="w-full px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-24">
          {/* Logo and Title */}
          <div className="flex items-center space-x-6">
            <a
              href="https://nedc.gov.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img
                src="/NEDC-new-logo-e1725385454149-1536x1069.png"
                alt="NEDC Logo"
                className="h-20 w-20 object-contain"
              />
            </a>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                North-East Development Commission
              </h1>
              <p className="text-base lg:text-lg text-gray-600 font-medium">
                Monitoring & Evaluation Database
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;