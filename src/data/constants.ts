export const PILLARS = [
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
  'Connected Region'
];

export const STATES = [
  'Adamawa',
  'Bauchi', 
  'Borno',
  'Gombe',
  'Taraba',
  'Yobe'
];

export const STATUS_OPTIONS = [
  'Completed (Handed over)',
  'Completed (Not handed over)',
  'Ongoing',
  'Abandoned',
  'Yet to commence'
];

export const SECTORS_BY_PILLAR: Record<string, string[]> = {
  'Peaceful Society': [
    'Conflict Resolution',
    'Community Dialogue',
    'Peace Building',
    'Security Enhancement',
    'Social Cohesion'
  ],
  'Leadership in Agriculture': [
    'Crop Production',
    'Livestock Development',
    'Irrigation Systems',
    'Agricultural Training',
    'Farm Mechanization',
    'Value Chain Development'
  ],
  'Healthy Citizens': [
    'Primary Healthcare',
    'Maternal Health',
    'Child Health',
    'Disease Prevention',
    'Health Infrastructure',
    'Medical Equipment'
  ],
  'Educated Populace': [
    'Primary Education',
    'Secondary Education',
    'Adult Literacy',
    'Vocational Training',
    'Educational Infrastructure',
    'Teacher Training'
  ],
  'Flourishing Trade': [
    'Market Development',
    'Trade Facilitation',
    'Commercial Infrastructure',
    'Business Support',
    'Export Promotion'
  ],
  'Productive Entrepreneurs': [
    'SME Development',
    'Business Training',
    'Microfinance',
    'Entrepreneurship Support',
    'Innovation Hubs'
  ],
  'Purposeful Infrastructure': [
    'Road Construction',
    'Bridge Construction',
    'Water Supply',
    'Electricity',
    'Telecommunications',
    'Public Buildings'
  ],
  'Industrialization': [
    'Manufacturing',
    'Processing Plants',
    'Industrial Parks',
    'Technology Transfer',
    'Skills Development'
  ],
  'Memorable Experience': [
    'Tourism Development',
    'Cultural Heritage',
    'Recreation Facilities',
    'Arts and Crafts',
    'Festival Support'
  ],
  'Protected Environment': [
    'Environmental Conservation',
    'Reforestation',
    'Waste Management',
    'Climate Adaptation',
    'Renewable Energy'
  ],
  'Connected Region': [
    'Transportation Networks',
    'Communication Systems',
    'Digital Infrastructure',
    'Regional Integration',
    'Cross-border Trade'
  ]
};

export const LGA_BY_STATE: Record<string, string[]> = {
  'Adamawa': [
    'Demsa', 'Fufore', 'Ganye', 'Girei', 'Gombi', 'Guyuk', 'Hong', 'Jada',
    'Lamurde', 'Madagali', 'Maiha', 'Mayo-Belwa', 'Michika', 'Mubi North',
    'Mubi South', 'Numan', 'Shelleng', 'Song', 'Toungo', 'Yola North', 'Yola South'
  ],
  'Bauchi': [
    'Alkaleri', 'Bauchi', 'Bogoro', 'Damban', 'Darazo', 'Dass', 'Gamawa',
    'Ganjuwa', 'Giade', 'Itas/Gadau', 'Jama\'are', 'Katagum', 'Kirfi',
    'Misau', 'Ningi', 'Shira', 'Tafawa-Balewa', 'Toro', 'Warji', 'Zaki'
  ],
  'Borno': [
    'Abadam', 'Askira/Uba', 'Bama', 'Bayo', 'Biu', 'Chibok', 'Damboa',
    'Dikwa', 'Gubio', 'Guzamala', 'Gwoza', 'Hawul', 'Jere', 'Kaga',
    'Kala/Balge', 'Konduga', 'Kukawa', 'Kwaya Kusar', 'Mafa', 'Magumeri',
    'Maiduguri', 'Marte', 'Mobbar', 'Monguno', 'Ngala', 'Nganzai', 'Shani'
  ],
  'Gombe': [
    'Akko', 'Balanga', 'Billiri', 'Dukku', 'Funakaye', 'Gombe', 'Kaltungo',
    'Kwami', 'Nafada', 'Shongom', 'Yamaltu/Deba'
  ],
  'Taraba': [
    'Ardo-Kola', 'Bali', 'Donga', 'Gashaka', 'Gassol', 'Ibi', 'Jalingo',
    'Karim-Lamido', 'Kurmi', 'Lau', 'Sardauna', 'Takum', 'Ussa', 'Wukari',
    'Yorro', 'Zing'
  ],
  'Yobe': [
    'Bade', 'Bursari', 'Damaturu', 'Fika', 'Fune', 'Geidam', 'Gujba',
    'Gulani', 'Jakusko', 'Karasuwa', 'Machina', 'Nangere', 'Nguru',
    'Potiskum', 'Tarmuwa', 'Yunusari', 'Yusufari'
  ]
};

export const PILLAR_ICONS: Record<string, string> = {
  'Peaceful Society': '🕊️',
  'Leadership in Agriculture': '🌾',
  'Healthy Citizens': '🏥',
  'Educated Populace': '🎓',
  'Flourishing Trade': '🏪',
  'Productive Entrepreneurs': '💼',
  'Purposeful Infrastructure': '🏗️',
  'Industrialization': '🏭',
  'Memorable Experience': '🎭',
  'Protected Environment': '🌳',
  'Connected Region': '🌐'
};

export const FUNDING_SOURCES = [
  'NEDC Budget',
  'Federal Government',
  'State Government',
  'International Donors',
  'Private Sector',
  'NGOs',
  'World Bank',
  'African Development Bank',
  'UN Agencies',
  'Bilateral Partners'
];

export const IMPACT_SEVERITY = [
  { value: 1, label: 'Very Low' },
  { value: 2, label: 'Low' },
  { value: 3, label: 'Medium' },
  { value: 4, label: 'High' },
  { value: 5, label: 'Very High' }
];

export const BOTTLENECK_CATEGORIES = [
  'Financial',
  'Technical',
  'Administrative',
  'Environmental',
  'Security',
  'Community',
  'Regulatory',
  'Capacity',
  'Infrastructure',
  'Coordination'
];