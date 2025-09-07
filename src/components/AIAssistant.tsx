import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Loader, Filter, BarChart3, FileText } from 'lucide-react';
import { supabase, Project } from '../lib/supabase';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: any;
}

interface AIAssistantProps {
  onNavigate?: (page: string, filters?: any) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your NEDC M&E Assistant. I can help you find projects, generate reports, and analyze data. Try asking me about ongoing projects, completed projects, or specific states and LGAs.',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('sn', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const processQuery = async (query: string): Promise<{ content: string; data?: any }> => {
    const lowerQuery = query.toLowerCase();
    
    // Project status queries
    if (lowerQuery.includes('ongoing') || lowerQuery.includes('in progress')) {
      const ongoingProjects = projects.filter(p => p.status === 'Ongoing');
      return {
        content: `Found ${ongoingProjects.length} ongoing projects. These projects are currently in progress across the North East region.`,
        data: { type: 'projects', projects: ongoingProjects, filter: 'ongoing' }
      };
    }

    if (lowerQuery.includes('completed')) {
      const completedProjects = projects.filter(p => p.status.includes('Completed'));
      return {
        content: `Found ${completedProjects.length} completed projects. These projects have been successfully finished.`,
        data: { type: 'projects', projects: completedProjects, filter: 'completed' }
      };
    }

    if (lowerQuery.includes('abandoned')) {
      const abandonedProjects = projects.filter(p => p.status === 'Abandoned');
      return {
        content: `Found ${abandonedProjects.length} abandoned projects. These projects were discontinued for various reasons.`,
        data: { type: 'projects', projects: abandonedProjects, filter: 'abandoned' }
      };
    }

    // State-specific queries
    const states = ['adamawa', 'bauchi', 'borno', 'gombe', 'taraba', 'yobe'];
    const mentionedState = states.find(state => lowerQuery.includes(state));
    if (mentionedState) {
      const stateProjects = projects.filter(p => p.state.toLowerCase() === mentionedState);
      const stateName = mentionedState.charAt(0).toUpperCase() + mentionedState.slice(1);
      return {
        content: `Found ${stateProjects.length} projects in ${stateName} State. These projects span across various LGAs and development pillars.`,
        data: { type: 'projects', projects: stateProjects, filter: 'state', value: stateName }
      };
    }

    // Pillar-specific queries
    if (lowerQuery.includes('agriculture') || lowerQuery.includes('farming')) {
      const agriProjects = projects.filter(p => 
        Array.isArray(p.pillars) 
          ? p.pillars.some(pillar => pillar.toLowerCase().includes('agriculture'))
          : p.pillars?.toLowerCase().includes('agriculture')
      );
      return {
        content: `Found ${agriProjects.length} agricultural development projects focused on improving farming and food security.`,
        data: { type: 'projects', projects: agriProjects, filter: 'pillar', value: 'Leadership in Agriculture' }
      };
    }

    if (lowerQuery.includes('education') || lowerQuery.includes('school')) {
      const eduProjects = projects.filter(p => 
        Array.isArray(p.pillars) 
          ? p.pillars.some(pillar => pillar.toLowerCase().includes('educational'))
          : p.pillars?.toLowerCase().includes('educational')
      );
      return {
        content: `Found ${eduProjects.length} educational projects aimed at improving learning infrastructure and outcomes.`,
        data: { type: 'projects', projects: eduProjects, filter: 'pillar', value: 'Educational populace' }
      };
    }

    if (lowerQuery.includes('health') || lowerQuery.includes('medical')) {
      const healthProjects = projects.filter(p => 
        Array.isArray(p.pillars) 
          ? p.pillars.some(pillar => pillar.toLowerCase().includes('healthy'))
          : p.pillars?.toLowerCase().includes('healthy')
      );
      return {
        content: `Found ${healthProjects.length} healthcare projects focused on improving medical services and health outcomes.`,
        data: { type: 'projects', projects: healthProjects, filter: 'pillar', value: 'Healthy citizens' }
      };
    }

    // Statistical queries
    if (lowerQuery.includes('total') || lowerQuery.includes('how many')) {
      const stats = {
        total: projects.length,
        completed: projects.filter(p => p.status.includes('Completed')).length,
        ongoing: projects.filter(p => p.status === 'Ongoing').length,
        abandoned: projects.filter(p => p.status === 'Abandoned').length
      };
      return {
        content: `Here are the project statistics:\n• Total Projects: ${stats.total}\n• Completed: ${stats.completed}\n• Ongoing: ${stats.ongoing}\n• Abandoned: ${stats.abandoned}`,
        data: { type: 'stats', stats }
      };
    }

    // Budget queries
    if (lowerQuery.includes('budget') || lowerQuery.includes('cost') || lowerQuery.includes('amount')) {
      const totalBudget = projects.reduce((sum, p) => sum + (p.contract_amount || 0), 0);
      const totalDisbursed = projects.reduce((sum, p) => sum + (p.amount_disbursed || 0), 0);
      const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
        }).format(amount).replace('$', '₦');
      };
      return {
        content: `Financial Overview:\n• Total Budget: ${formatCurrency(totalBudget)}\n• Amount Disbursed: ${formatCurrency(totalDisbursed)}\n• Disbursement Rate: ${Math.round((totalDisbursed / totalBudget) * 100)}%`,
        data: { type: 'financial', totalBudget, totalDisbursed }
      };
    }

    // Default response
    return {
      content: `I can help you with:\n• Project status (ongoing, completed, abandoned)\n• State-specific projects (Adamawa, Bauchi, Borno, etc.)\n• Pillar-based projects (agriculture, education, health)\n• Project statistics and budgets\n• Generate reports and analysis\n\nTry asking: "Show me ongoing projects" or "Projects in Borno State"`
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await processQuery(inputValue);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        data: response.data
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleActionClick = (data: any) => {
    if (data.type === 'projects' && onNavigate) {
      if (data.filter === 'ongoing') {
        onNavigate('filter-projects', { status: ['Ongoing'] });
      } else if (data.filter === 'completed') {
        onNavigate('filter-projects', { status: ['Completed (Handed over)', 'Completed (Not handed over)'] });
      } else if (data.filter === 'abandoned') {
        onNavigate('filter-projects', { status: ['Abandoned'] });
      } else if (data.filter === 'state') {
        onNavigate('filter-projects', { states: [data.value] });
      } else if (data.filter === 'pillar') {
        onNavigate('filter-projects', { pillars: [data.value] });
      }
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 hover:scale-110 z-50"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center">
          <Bot className="mr-2" size={20} />
          <h3 className="font-semibold">NEDC M&E Assistant</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.type === 'assistant' && (
                  <Bot className="flex-shrink-0 mt-0.5" size={16} />
                )}
                {message.type === 'user' && (
                  <User className="flex-shrink-0 mt-0.5" size={16} />
                )}
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  {message.data && (
                    <div className="mt-2 space-y-2">
                      {message.data.type === 'projects' && (
                        <button
                          onClick={() => handleActionClick(message.data)}
                          className="flex items-center text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
                        >
                          <Filter className="mr-1" size={12} />
                          View Filtered Results
                        </button>
                      )}
                      {message.data.type === 'stats' && (
                        <button
                          onClick={() => onNavigate?.('home')}
                          className="flex items-center text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
                        >
                          <BarChart3 className="mr-1" size={12} />
                          View Dashboard
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 p-3 rounded-lg flex items-center">
              <Loader className="animate-spin mr-2" size={16} />
              <span className="text-sm">Analyzing your request...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about projects, statistics, or reports..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;