export const APP_VERSION = '1.0.0';

/**
 * Point this at the deployed SujoyDev backend. While the API is unreachable the
 * app serves bundled portfolio content and queues submissions locally, then
 * syncs when connectivity to the API returns.
 */
export const API_BASE_URL = 'http://10.0.2.2:5000/api/v1';

export const DEVELOPER = {
  name: 'Sujoy Ghoshal',
  title: 'Full Stack Developer',
  experience: '1+ Years Experience',
  tagline: 'I build fast, reliable Android apps, websites and backend systems.',
  about:
    'Full Stack Developer specialising in React Native, React, Node.js and MongoDB. ' +
    'I help businesses ship production-grade mobile apps, web platforms and REST APIs — ' +
    'from first wireframe to Play Store release. Available for freelance projects.',
  phone: '+918927673775',
  phoneDisplay: '8927673775',
  email: 'sujoyghshal.s@gmail.com',
  whatsapp: 'https://wa.me/918927673775',
  github: 'https://github.com/sujoyghoshal',
  linkedin: 'https://www.linkedin.com/in/sujoy-ghoshal',
  portfolio: 'https://sujoydev.vercel.app',
  resumeUrl: 'https://sujoydev.vercel.app/resume.pdf',
  availableForFreelance: true,
};

export const STATS = [
  { label: 'Projects Delivered', value: '12+' },
  { label: 'Happy Clients', value: '8+' },
  { label: 'Years Experience', value: '1+' },
  { label: 'Technologies', value: '15+' },
];

export const TECH_STACK = [
  'React Native',
  'React',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'Express',
  'MongoDB',
  'Firebase',
  'Redux Toolkit',
  'REST APIs',
  'Socket.IO',
  'Tailwind CSS',
  'Git',
  'Docker',
  'MySQL',
];

export const SKILLS = [
  { name: 'React Native', level: 0.9 },
  { name: 'React.js', level: 0.88 },
  { name: 'Node.js + Express', level: 0.85 },
  { name: 'MongoDB', level: 0.82 },
  { name: 'TypeScript', level: 0.8 },
  { name: 'UI / UX', level: 0.75 },
];

export const STORAGE_KEYS = {
  auth: '@sujoydev/auth',
  theme: '@sujoydev/theme',
  favorites: '@sujoydev/favorites',
  bookmarks: '@sujoydev/bookmarks',
  requests: '@sujoydev/requests',
  bugs: '@sujoydev/bugs',
  cache: '@sujoydev/cache',
} as const;
