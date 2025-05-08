/**
 * Route constants for site navigation
 */

// Main navigation routes
export const MAIN_ROUTES = [
  {
    path: '/',
    label: 'Home',
    icon: 'home',
    exact: true,
  },
  {
    path: '/research',
    label: 'Research',
    icon: 'research',
  },
  {
    path: '/publications',
    label: 'Publications',
    icon: 'publications',
  },
  {
    path: '/about',
    label: 'About',
    icon: 'about',
  },
  {
    path: '/contact',
    label: 'Contact',
    icon: 'contact',
  },
];

// Research page sub-routes
export const RESEARCH_ROUTES = [
  {
    path: '/research',
    label: 'Overview',
    exact: true,
  },
  {
    path: '/research/seismic-analysis',
    label: 'Seismic Analysis',
  },
  {
    path: '/research/ai-integration',
    label: 'AI Integration',
  },
  {
    path: '/research/structural-systems',
    label: 'Structural Systems',
  },
  {
    path: '/research/tools',
    label: 'Research Tools',
  },
];

// Publication categories and filters
export const PUBLICATION_CATEGORIES = [
  {
    id: 'all',
    label: 'All Publications',
    icon: 'publications',
  },
  {
    id: 'seismic',
    label: 'Seismic Analysis',
    icon: 'earthquake',
  },
  {
    id: 'ai',
    label: 'AI Integration',
    icon: 'ai',
  },
  {
    id: 'education',
    label: 'Educational Research',
    icon: 'education',
  },
];

// Demo tool routes
export const DEMO_ROUTES = [
  {
    path: '/tools/displacement-predictor',
    label: 'Displacement Predictor',
    icon: 'tools',
    description: 'Predict building displacement under seismic loads',
    requiresLogin: false,
  },
  {
    path: '/tools/damage-assessment',
    label: 'Damage Assessment',
    icon: 'assessment',
    description: 'Assess building damage after seismic events',
    requiresLogin: false,
  },
  {
    path: '/tools/structural-design',
    label: 'Structural Design Assistant',
    icon: 'design',
    description: 'AI-powered assistant for structural design',
    requiresLogin: true,
  },
];

// Footer link sections
export const FOOTER_LINKS = {
  research: [
    {
      label: 'Seismic Analysis',
      path: '/research/seismic-analysis',
    },
    {
      label: 'AI Integration',
      path: '/research/ai-integration',
    },
    {
      label: 'Structural Systems',
      path: '/research/structural-systems',
    },
    {
      label: 'Research Tools',
      path: '/research/tools',
    },
  ],
  resources: [
    {
      label: 'Publications',
      path: '/publications',
    },
    {
      label: 'Datasets',
      path: '/resources/datasets',
    },
    {
      label: 'Interactive Tools',
      path: '/tools',
    },
    {
      label: 'Educational Materials',
      path: '/resources/education',
    },
  ],
  contact: [
    {
      label: 'Contact',
      path: '/contact',
    },
    {
      label: 'Collaborate',
      path: '/contact?category=research',
    },
    {
      label: 'Join the Lab',
      path: '/contact?category=student',
    },
    {
      label: 'Media Inquiries',
      path: '/contact?category=media',
    },
  ],
};

// Social media links
export const SOCIAL_LINKS = [
  {
    label: 'LinkedIn',
    icon: 'linkedin',
    url: 'https://www.linkedin.com/in/sattar-hedayat',
  },
  {
    label: 'Twitter',
    icon: 'twitter',
    url: 'https://twitter.com/sattarhedayat',
  },
  {
    label: 'GitHub',
    icon: 'github',
    url: 'https://github.com/sattarhedayat',
  },
  {
    label: 'Google Scholar',
    icon: 'scholar',
    url: 'https://scholar.google.com/citations?user=sattarhedayat',
  },
  {
    label: 'ResearchGate',
    icon: 'researchgate',
    url: 'https://www.researchgate.net/profile/Sattar-Hedayat',
  },
];

// URL construction helper
export const buildUrl = (basePath, queryParams = {}) => {
  const url = new URL(basePath, window.location.origin);
  
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });
  
  return url.toString();
};

// Route utility functions
export const getRouteByPath = (path) => {
  return MAIN_ROUTES.find(route => route.path === path);
};

export const getPublicationCategoryById = (id) => {
  return PUBLICATION_CATEGORIES.find(category => category.id === id);
};

export default {
  MAIN_ROUTES,
  RESEARCH_ROUTES,
  PUBLICATION_CATEGORIES,
  DEMO_ROUTES,
  FOOTER_LINKS,
  SOCIAL_LINKS,
  buildUrl,
  getRouteByPath,
  getPublicationCategoryById,
}; 