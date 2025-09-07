import React from 'react';
import {
  Mail, Phone, MapPin, Globe, Facebook, Twitter, Linkedin, Instagram, ExternalLink
} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-green-700 via-green-600 to-orange-500 text-white">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* 1. About M&E Database */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/NEDC-new-logo-e1725385454149-1536x1069.png"
                alt="NEDC Logo"
                className="h-12 w-12 object-contain"
              />
              <div>
                <h3 className="text-lg font-bold">NEDC</h3>
                <p className="text-sm text-gray-100">M&E Database</p>
              </div>
            </div>
            <p className="text-gray-100 text-sm leading-relaxed">
              North-East Development Commission – Monitoring & Evaluation Database System.
              Tracking development progress and impact across the North-East region of Nigeria.
            </p>
            <p className="text-sm text-gray-200 font-medium">Development, Peace & Prosperity</p>

            {/* NEDC Official Website (placed below About) */}
            <a
              href="https://nedc.gov.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mt-3 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors shadow"
            >
              <ExternalLink className="mr-2" size={16} />
              NEDC Official Website
            </a>
          </div>

          {/* 2. Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="text-orange-300 mt-1" size={16} />
                <span className="text-gray-100">
                  1 Makurdi Road, Off Shehu Bukar Road,<br />
                  Old GRA, Maiduguri, Borno State
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-orange-300" size={16} />
                <span className="text-gray-100">+2347047847931</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-orange-300" size={16} />
                <span className="text-gray-100">info@nedc.gov.ng</span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="text-orange-300" size={16} />
                <a href="https://nedc.gov.ng" className="text-gray-100 hover:text-white transition-colors underline">
                  www.nedc.gov.ng
                </a>
              </div>
            </div>
          </div>

          {/* 3. Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="space-y-2 text-sm">
              <a href="#" className="block text-gray-100 hover:text-white transition-colors">All Projects</a>
              <a href="#" className="block text-gray-100 hover:text-white transition-colors">M&E Tools</a>
              <a href="#" className="block text-gray-100 hover:text-white transition-colors">Evaluation Analysis</a>
              <a href="#" className="block text-gray-100 hover:text-white transition-colors">Geographic Mapping</a>
            </nav>
          </div>

          {/* 4. NESDMP Pillars */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">NESDMP Pillars</h3>
            <ul className="space-y-1 text-sm text-gray-100">
              {[
                'Peaceful Society',
                'Leadership in Agriculture',
                'Healthy Citizens',
                'Educated Populace',
                'Flourishing Trade',
                'Productive Entrepreneurs',
                'Purposeful Infrastructure',
                'Industrialization',
                'Memorable Experience',
                'Protected Environment',
                'Connected Region',
              ].map((item) => (
                <li key={item} className="flex items-start">
                  <span className="mr-2 text-orange-300">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-green-500/30 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Social icons */}
            <div className="flex space-x-5 mb-4 md:mb-0">
              <a href="#" className="text-gray-200 hover:text-white transition-colors"><Facebook size={22} /></a>
              <a href="#" className="text-gray-200 hover:text-white transition-colors"><Twitter size={22} /></a>
              <a href="#" className="text-gray-200 hover:text-white transition-colors"><Linkedin size={22} /></a>
              <a href="#" className="text-gray-200 hover:text-white transition-colors"><Instagram size={22} /></a>
            </div>

            {/* Copyright */}
            <p className="text-sm text-gray-200">
              © 2024 North East Development Commission. All rights reserved. Monitoring & Evaluation Database System v2.0
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;