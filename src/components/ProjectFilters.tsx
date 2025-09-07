import React, { useState, useEffect } from 'react';
import { Filter, X, Check, ChevronDown } from 'lucide-react';
import { PILLARS, STATES, STATUS_OPTIONS, LGA_BY_STATE } from '../data/constants';

export interface FilterState {
  pillars: string[];
  states: string[];
  lgas: string[];
  status: string[];
}

interface ProjectFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [availableLGAs, setAvailableLGAs] = useState<string[]>([]);

  useEffect(() => {
    // Update available LGAs based on selected states
    const lgas = filters.states.flatMap(state => LGA_BY_STATE[state] || []);
    setAvailableLGAs([...new Set(lgas)]);
    
    // Remove LGAs that are no longer available
    const validLGAs = filters.lgas.filter(lga => lgas.includes(lga));
    if (validLGAs.length !== filters.lgas.length) {
      const newFilters = { ...filters, lgas: validLGAs };
      onFiltersChange(newFilters);
    }
  }, [filters.states, filters.lgas.length, onFiltersChange]);

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleMultiSelect = (category: keyof FilterState, value: string) => {
    const currentValues = filters[category] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFiltersChange({ ...filters, [category]: newValues });
  };

  const handleSelectAll = (category: keyof FilterState, options: string[]) => {
    const currentValues = filters[category] as string[];
    const allSelected = options.every(option => currentValues.includes(option));
    
    if (allSelected) {
      onFiltersChange({ ...filters, [category]: [] });
    } else {
      onFiltersChange({ ...filters, [category]: options });
    }
  };

  const FilterDropdown = ({ 
    title, 
    category, 
    options, 
    selectedCount 
  }: { 
    title: string; 
    category: keyof FilterState; 
    options: string[]; 
    selectedCount: number;
  }) => (
    <div className="relative">
      <button
        onClick={() => toggleDropdown(category)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
      >
        <div className="flex items-center">
          <Filter className="mr-2 text-gray-500" size={16} />
          <span className="text-gray-700">{title}</span>
          {selectedCount > 0 && (
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              {selectedCount}
            </span>
          )}
        </div>
        <ChevronDown 
          className={`text-gray-500 transition-transform ${
            openDropdown === category ? 'rotate-180' : ''
          }`} 
          size={16} 
        />
      </button>

      {openDropdown === category && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          <div className="p-2 border-b border-gray-200">
            <button
              onClick={() => handleSelectAll(category, options)}
              className="w-full text-left px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-50 rounded transition-colors"
            >
              {options.every(option => (filters[category] as string[]).includes(option)) 
                ? 'Deselect All' 
                : 'Select All'
              }
            </button>
          </div>
          <div className="p-2 space-y-1">
            {options.map((option) => (
              <label
                key={option}
                className="flex items-center px-3 py-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={(filters[category] as string[]).includes(option)}
                  onChange={() => handleMultiSelect(category, option)}
                  className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{option}</span>
                {(filters[category] as string[]).includes(option) && (
                  <Check className="ml-auto text-green-600" size={14} />
                )}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const totalFilters = filters.pillars.length + filters.states.length + filters.lgas.length + filters.status.length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10 w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Filter className="mr-2 text-green-600" size={24} />
          Project Filters
        </h2>
        {totalFilters > 0 && (
          <button
            onClick={onClearFilters}
            className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
          >
            <X className="mr-1" size={14} />
            Clear All ({totalFilters})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        <FilterDropdown
          title="Pillars"
          category="pillars"
          options={PILLARS}
          selectedCount={filters.pillars.length}
        />

        <FilterDropdown
          title="States"
          category="states"
          options={STATES}
          selectedCount={filters.states.length}
        />

        <FilterDropdown
          title="LGAs"
          category="lgas"
          options={availableLGAs}
          selectedCount={filters.lgas.length}
        />

        <FilterDropdown
          title="Status"
          category="status"
          options={STATUS_OPTIONS}
          selectedCount={filters.status.length}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <button
          onClick={onApplyFilters}
          className="flex-1 bg-green-600 text-white px-10 py-5 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium text-xl"
        >
          Apply Filters
        </button>
        <button
          onClick={onClearFilters}
          className="flex-1 bg-gray-100 text-gray-700 px-10 py-5 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium text-xl"
        >
          Clear Filters
        </button>
      </div>

      {/* Selected Filters Summary */}
      {totalFilters > 0 && (
        <div className="mt-8 p-8 bg-green-50 rounded-lg">
          <h3 className="text-sm font-medium text-green-800 mb-2">Active Filters:</h3>
          <div className="flex flex-wrap gap-2">
            {filters.pillars.map(pillar => (
              <span key={pillar} className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                {pillar}
                <button
                  onClick={() => handleMultiSelect('pillars', pillar)}
                  className="ml-1 hover:text-green-600"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            {filters.states.map(state => (
              <span key={state} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {state}
                <button
                  onClick={() => handleMultiSelect('states', state)}
                  className="ml-1 hover:text-blue-600"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            {filters.lgas.map(lga => (
              <span key={lga} className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                {lga}
                <button
                  onClick={() => handleMultiSelect('lgas', lga)}
                  className="ml-1 hover:text-purple-600"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            {filters.status.map(status => (
              <span key={status} className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                {status}
                <button
                  onClick={() => handleMultiSelect('status', status)}
                  className="ml-1 hover:text-orange-600"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectFilters;