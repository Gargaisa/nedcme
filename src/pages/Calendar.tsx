import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users, Edit, Trash2, X, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'monitoring' | 'evaluation' | 'training' | 'meeting';
  participants: string[];
  description: string;
  created_at?: string;
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [formData, setFormData] = useState<Partial<CalendarEvent>>({
    title: '',
    date: '',
    time: '',
    location: '',
    type: 'monitoring',
    participants: [],
    description: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // For now, we'll use sample data since we don't have calendar events table
      // In production, this would fetch from Supabase
      const sampleEvents: CalendarEvent[] = [
        {
          id: '1',
          title: 'Field Monitoring Visit - Adamawa Projects',
          date: '2024-01-15',
          time: '09:00',
          location: 'Yola, Adamawa State',
          type: 'monitoring',
          participants: ['M&E Team Lead', 'Field Officer', 'State Coordinator'],
          description: 'Quarterly monitoring visit to assess progress of agricultural development projects in Adamawa State.'
        },
        {
          id: '2',
          title: 'Project Evaluation Workshop',
          date: '2024-01-18',
          time: '10:00',
          location: 'NEDC Headquarters, Maiduguri',
          type: 'evaluation',
          participants: ['Evaluation Team', 'Project Managers', 'Stakeholders'],
          description: 'Mid-term evaluation workshop for infrastructure projects across the North East region.'
        },
        {
          id: '3',
          title: 'M&E Training Session',
          date: '2024-01-22',
          time: '14:00',
          location: 'Virtual Meeting',
          type: 'training',
          participants: ['M&E Staff', 'New Recruits', 'Consultants'],
          description: 'Training session on new monitoring and evaluation methodologies and tools.'
        },
        {
          id: '4',
          title: 'Quarterly Review Meeting',
          date: '2024-01-25',
          time: '11:00',
          location: 'Conference Room A, NEDC HQ',
          type: 'meeting',
          participants: ['Management', 'M&E Team', 'Department Heads'],
          description: 'Quarterly review of M&E activities and project performance across all pillars.'
        }
      ];
      setEvents(sampleEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async () => {
    try {
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: formData.title || '',
        date: formData.date || '',
        time: formData.time || '',
        location: formData.location || '',
        type: formData.type || 'monitoring',
        participants: formData.participants || [],
        description: formData.description || '',
        created_at: new Date().toISOString()
      };

      setEvents(prev => [...prev, newEvent]);
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error('Error adding event:', err);
    }
  };

  const handleEditEvent = async () => {
    if (!selectedEvent) return;

    try {
      const updatedEvent: CalendarEvent = {
        ...selectedEvent,
        title: formData.title || selectedEvent.title,
        date: formData.date || selectedEvent.date,
        time: formData.time || selectedEvent.time,
        location: formData.location || selectedEvent.location,
        type: formData.type || selectedEvent.type,
        participants: formData.participants || selectedEvent.participants,
        description: formData.description || selectedEvent.description
      };

      setEvents(prev => prev.map(event => 
        event.id === selectedEvent.id ? updatedEvent : event
      ));
      setShowEditModal(false);
      setSelectedEvent(null);
      resetForm();
    } catch (err) {
      console.error('Error updating event:', err);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      setEvents(prev => prev.filter(event => event.id !== eventId));
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      type: 'monitoring',
      participants: [],
      description: ''
    });
  };

  const openEditModal = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      type: event.type,
      participants: event.participants,
      description: event.description
    });
    setShowEditModal(true);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'monitoring': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'evaluation': return 'bg-green-100 text-green-800 border-green-200';
      case 'training': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'meeting': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'monitoring': return '👁️';
      case 'evaluation': return '📊';
      case 'training': return '🎓';
      case 'meeting': return '🤝';
      default: return '📅';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const EventModal = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">
              {isEdit ? 'Edit Event' : 'Add New Event'}
            </h3>
            <button
              onClick={() => {
                if (isEdit) {
                  setShowEditModal(false);
                  setSelectedEvent(null);
                } else {
                  setShowAddModal(false);
                }
                resetForm();
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time *
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter event location"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as CalendarEvent['type'] }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="monitoring">Monitoring</option>
              <option value="evaluation">Evaluation</option>
              <option value="training">Training</option>
              <option value="meeting">Meeting</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Participants (comma-separated)
            </label>
            <input
              type="text"
              value={formData.participants?.join(', ')}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                participants: e.target.value.split(',').map(p => p.trim()).filter(p => p) 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter participant names separated by commas"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter event description"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={() => {
              if (isEdit) {
                setShowEditModal(false);
                setSelectedEvent(null);
              } else {
                setShowAddModal(false);
              }
              resetForm();
            }}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={isEdit ? handleEditEvent : handleAddEvent}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save className="mr-2" size={16} />
            {isEdit ? 'Update Event' : 'Add Event'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <CalendarIcon className="mr-3 text-green-600" size={32} />
                M&E Calendar
              </h1>
              <p className="text-lg text-gray-600">
                Annual schedules of NEDC Monitoring & Evaluation programs and activities
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="mr-2" size={16} />
              Add Event
            </button>
          </div>
        </div>

        {/* Calendar Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-xl font-bold text-gray-900">
                  {formatDate(currentDate)}
                </h2>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              
              <div className="flex space-x-2">
                {(['month', 'week', 'day'] as const).map((viewType) => (
                  <button
                    key={viewType}
                    onClick={() => setView(viewType)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                      view === viewType
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {viewType}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming M&E Activities</h3>
              </div>
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <span className="ml-2 text-gray-600">Loading events...</span>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className={`p-4 rounded-lg border-l-4 ${getEventTypeColor(event.type)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="text-lg mr-2">{getEventTypeIcon(event.type)}</span>
                            <h4 className="font-semibold text-gray-900">{event.title}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <CalendarIcon className="mr-1" size={14} />
                              {new Date(event.date).toLocaleDateString('en-GB')}
                            </div>
                            <div className="flex items-center">
                              <Clock className="mr-1" size={14} />
                              {event.time}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="mr-1" size={14} />
                              {event.location}
                            </div>
                            <div className="flex items-center">
                              <Users className="mr-1" size={14} />
                              {event.participants.length} participants
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getEventTypeColor(event.type)}`}>
                            {event.type}
                          </span>
                          <button
                            onClick={() => openEditModal(event)}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                            title="Edit Event"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Calendar Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Monitoring Visits</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {events.filter(e => e.type === 'monitoring').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Evaluations</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {events.filter(e => e.type === 'evaluation').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Training Sessions</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {events.filter(e => e.type === 'training').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Meetings</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {events.filter(e => e.type === 'meeting').length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setFormData(prev => ({ ...prev, type: 'monitoring' }));
                    setShowAddModal(true);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                >
                  Schedule Field Visit
                </button>
                <button
                  onClick={() => {
                    setFormData(prev => ({ ...prev, type: 'evaluation' }));
                    setShowAddModal(true);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                >
                  Plan Evaluation Workshop
                </button>
                <button
                  onClick={() => {
                    setFormData(prev => ({ ...prev, type: 'training' }));
                    setShowAddModal(true);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                >
                  Book Training Session
                </button>
                <button
                  onClick={() => {
                    setFormData(prev => ({ ...prev, type: 'meeting' }));
                    setShowAddModal(true);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                >
                  Schedule Review Meeting
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showAddModal && <EventModal />}
        {showEditModal && <EventModal isEdit />}
      </div>
    </div>
  );
};

export default Calendar;