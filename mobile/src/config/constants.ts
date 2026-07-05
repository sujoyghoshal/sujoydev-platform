export const APP_VERSION = '1.0.0';

/**
 * Point this at the deployed NurixSoft backend. While the API is unreachable the
 * app serves bundled portfolio content and queues submissions locally, then
 * syncs when connectivity to the API returns.
 */
export const API_BASE_URL = 'http://10.0.2.2:5001/api/v1';

/**
 * OAuth 2.0 **Web client ID** from Google Cloud console → Credentials.
 * Setup steps + this project's SHA-1 fingerprints: docs/GOOGLE_AUTH.md.
 * Must match GOOGLE_WEB_CLIENT_ID in backend/.env.
 */
export const GOOGLE_WEB_CLIENT_ID =
  '10728362727-ffgs5dt0na8jbij8u6089paa3uhakj5u.apps.googleusercontent.com';

export const DEVELOPER = {
  name: 'NurixSoft',
  title: 'Websites · Apps · UI/UX',
  tagline: 'We design and build websites, Android & iOS apps and UI/UX for clients — proper delivery at budget-friendly prices.',
  about:
    'NurixSoft is a freelance software studio working for clients worldwide. ' +
    'We create websites, mobile apps (Play Store & App Store ready), backends and UI/UX designs — ' +
    'production-grade quality, transparent pricing and on-time delivery, even on low budgets.',
  phone: '+918927673775',
  phoneDisplay: '8927673775',
  email: 'supportsujoydev@gmail.com',
  whatsapp: 'https://wa.me/918927673775',
  portfolio: 'https://nurixsoft.vercel.app',
  availableForFreelance: true,
};

export const STATS = [
  { label: 'Projects Delivered', value: '12+' },
  { label: 'Happy Clients', value: '8+' },
  { label: 'Services Offered', value: '10+' },
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

export const STORAGE_KEYS = {
  auth: '@nurixsoft/auth',
  theme: '@nurixsoft/theme',
  favorites: '@nurixsoft/favorites',
  bookmarks: '@nurixsoft/bookmarks',
  requests: '@nurixsoft/requests',
  bugs: '@nurixsoft/bugs',
  cache: '@nurixsoft/cache',
} as const;
