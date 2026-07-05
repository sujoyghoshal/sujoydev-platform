import { Project, Service, BlogPost, Testimonial } from '../types';

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'ShopEase — E-Commerce App',
    category: 'Android',
    description: 'Full-featured shopping app with cart, payments and order tracking.',
    longDescription:
      'A production e-commerce Android application built with React Native and a Node.js backend. ' +
      'Features product catalogue with search and filters, cart and wishlist, Razorpay payments, ' +
      'order tracking with push notifications, and an admin panel for inventory management. ' +
      'Optimised list rendering handles 10,000+ products smoothly.',
    technologies: ['React Native', 'Redux Toolkit', 'Node.js', 'MongoDB', 'Razorpay', 'FCM'],
    image: 'https://picsum.photos/seed/shopease/800/450',
    screenshots: [
      'https://picsum.photos/seed/shopease1/400/800',
      'https://picsum.photos/seed/shopease2/400/800',
    ],
    githubUrl: 'https://github.com/sujoyghoshal',
    clientReview: {
      author: 'Retail client, Kolkata',
      rating: 5,
      comment: 'Delivered ahead of schedule with excellent performance. Highly recommended.',
    },
    featured: true,
    year: 2025,
  },
  {
    id: 'p2',
    title: 'TaskFlow — Team Task Manager',
    category: 'Full Stack',
    description: 'Kanban-style task management platform with real-time collaboration.',
    longDescription:
      'A team productivity platform with drag-and-drop kanban boards, real-time updates over ' +
      'Socket.IO, role-based workspaces, file attachments and daily email digests. Built as a ' +
      'React web app and REST API with JWT authentication and MongoDB aggregation-driven reports.',
    technologies: ['React', 'TypeScript', 'Socket.IO', 'Express', 'MongoDB', 'JWT'],
    image: 'https://picsum.photos/seed/taskflow/800/450',
    screenshots: ['https://picsum.photos/seed/taskflow1/800/450'],
    githubUrl: 'https://github.com/sujoyghoshal',
    liveUrl: 'https://sujoydev.vercel.app',
    featured: true,
    year: 2025,
  },
  {
    id: 'p3',
    title: 'FitTrack — Fitness Companion',
    category: 'Android',
    description: 'Workout & habit tracker with charts, streaks and offline support.',
    longDescription:
      'A fitness tracking app featuring workout logging, habit streaks, animated progress charts, ' +
      'offline-first storage with background sync, dark mode and home-screen widgets. ' +
      'Published as a signed release build with crash-free rate above 99.5%.',
    technologies: ['React Native', 'Reanimated', 'AsyncStorage', 'Lottie', 'SQLite'],
    image: 'https://picsum.photos/seed/fittrack/800/450',
    screenshots: ['https://picsum.photos/seed/fittrack1/400/800'],
    githubUrl: 'https://github.com/sujoyghoshal',
    featured: true,
    year: 2024,
  },
  {
    id: 'p4',
    title: 'RestoBook — Restaurant Booking API',
    category: 'Backend',
    description: 'Scalable REST API powering table reservations for 40+ restaurants.',
    longDescription:
      'A multi-tenant booking backend with slot management, double-booking prevention using ' +
      'MongoDB transactions, SMS confirmations, rate limiting, audit logs and an analytics ' +
      'dashboard API. Deployed with Docker behind Nginx with zero-downtime restarts.',
    technologies: ['Node.js', 'Express', 'MongoDB', 'Docker', 'Nginx', 'Redis'],
    image: 'https://picsum.photos/seed/restobook/800/450',
    screenshots: [],
    githubUrl: 'https://github.com/sujoyghoshal',
    featured: false,
    year: 2024,
  },
  {
    id: 'p5',
    title: 'Portfolio Website',
    category: 'Website',
    description: 'Personal portfolio with blog, contact form and 100 Lighthouse score.',
    longDescription:
      'A fast, SEO-optimised portfolio website with animated sections, a markdown-driven blog, ' +
      'contact form with spam protection, and analytics. Scores 100/100 on Lighthouse performance.',
    technologies: ['React', 'Vite', 'Tailwind CSS', 'Vercel'],
    image: 'https://picsum.photos/seed/portfolio/800/450',
    screenshots: [],
    liveUrl: 'https://sujoydev.vercel.app',
    featured: false,
    year: 2024,
  },
];

export const SERVICES: Service[] = [
  {
    id: 's1',
    title: 'Android App Development',
    description: 'Production-ready Android apps with React Native — from idea to Play Store.',
    icon: 'android',
    priceFrom: 15000,
    deliveryDays: 21,
    category: 'Mobile',
    featured: true,
    deliverables: ['Signed AAB / Play Store release', 'Push notifications', 'Dark mode', 'Source code'],
  },
  {
    id: 's2',
    title: 'Website Development',
    description: 'Fast, responsive, SEO-friendly websites and web apps built with React.',
    icon: 'web',
    priceFrom: 8000,
    deliveryDays: 10,
    category: 'Web',
    featured: true,
    deliverables: ['Responsive design', 'SEO setup', 'Deployment', 'Source code'],
  },
  {
    id: 's3',
    title: 'Backend & REST API',
    description: 'Secure, documented Node.js + Express APIs with MongoDB and JWT auth.',
    icon: 'server',
    priceFrom: 10000,
    deliveryDays: 14,
    category: 'Backend',
    featured: true,
    deliverables: ['REST API + docs', 'JWT auth & roles', 'MongoDB schema design', 'Docker deploy'],
  },
  {
    id: 's4',
    title: 'Admin Panel / Dashboard',
    description: 'Data-rich admin dashboards with charts, tables, exports and role access.',
    icon: 'view-dashboard',
    priceFrom: 12000,
    deliveryDays: 14,
    category: 'Web',
    featured: false,
    deliverables: ['Analytics charts', 'CRUD modules', 'Role-based access', 'CSV export'],
  },
  {
    id: 's5',
    title: 'Bug Fixing & Performance',
    description: 'Diagnose crashes, fix bugs and speed up existing apps and APIs.',
    icon: 'bug-check',
    priceFrom: 1500,
    deliveryDays: 3,
    category: 'Maintenance',
    featured: false,
    deliverables: ['Root-cause report', 'Fix + regression test', 'Performance audit'],
  },
  {
    id: 's6',
    title: 'UI/UX Design',
    description: 'Clean, modern Material Design 3 interfaces users love.',
    icon: 'palette',
    priceFrom: 5000,
    deliveryDays: 7,
    category: 'Design',
    featured: false,
    deliverables: ['Screen designs', 'Design tokens', 'Interactive prototype'],
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: 'React Native in 2026: What I Ship With and Why',
    category: 'React Native',
    excerpt: 'My production stack — navigation, state, animations and the libraries that earn their place.',
    content:
      'After shipping multiple production apps, my default stack has settled: React Navigation for ' +
      'routing, Redux Toolkit for global state, Reanimated for anything that moves, and React Native ' +
      'Paper for Material Design 3.\n\nThe biggest lesson: keep native dependencies to a minimum. Every ' +
      'native module is a build risk on upgrade day. Before adding one, ask if JS can do the job.\n\n' +
      'Second lesson: design offline-first from day one. Cache reads, queue writes, and sync when the ' +
      'network returns — retrofitting this later is painful.\n\nFinally, invest in typed API contracts. ' +
      'Sharing TypeScript types between backend and app catches an entire class of bugs at compile time.',
    readMinutes: 5,
    publishedAt: '2026-05-14',
    tags: ['react-native', 'architecture'],
  },
  {
    id: 'b2',
    title: 'Designing REST APIs Clients Actually Enjoy Using',
    category: 'Backend',
    excerpt: 'Consistent envelopes, honest errors and pagination that scales — API design fundamentals.',
    content:
      'A good API is predictable. Every response in my backends follows one envelope: success, message, ' +
      'data, meta. Clients never guess where the payload lives.\n\nErrors deserve the same care: an HTTP ' +
      'status that matches reality, a human-readable message, and a field-level errors array for ' +
      'validation failures.\n\nFor pagination, offset works for admin tables but cursors win for feeds — ' +
      'they stay correct while data changes underneath.\n\nAnd version from day one. /api/v1 costs ' +
      'nothing today and saves a breaking-change crisis later.',
    readMinutes: 4,
    publishedAt: '2026-04-02',
    tags: ['nodejs', 'api-design'],
  },
  {
    id: 'b3',
    title: 'MongoDB Indexing: The 20% That Gives 80% of the Speed',
    category: 'Database',
    excerpt: 'Compound indexes, the ESR rule, and reading explain() without fear.',
    content:
      'Most slow MongoDB queries share one cause: no matching index. Start with the ESR rule — ' +
      'Equality, Sort, Range — when ordering compound index fields.\n\nUse explain("executionStats") and ' +
      'watch two numbers: totalDocsExamined versus nReturned. When they diverge wildly, your index is ' +
      'not doing its job.\n\nText search? A single text index per collection covers search bars fine at ' +
      'small scale; move to Atlas Search when relevance tuning matters.\n\nAnd remember: every index ' +
      'costs write speed and RAM. Index what you query, drop what you do not.',
    readMinutes: 6,
    publishedAt: '2026-02-20',
    tags: ['mongodb', 'performance'],
  },
  {
    id: 'b4',
    title: 'From Code to Play Store: A Release Checklist',
    category: 'Career',
    excerpt: 'Signing keys, privacy policies, data safety forms — everything before you press publish.',
    content:
      'Shipping to the Play Store is a project of its own. My checklist:\n\n1. Generate an upload ' +
      'keystore and back it up somewhere that survives a dead laptop.\n2. Turn on Play App Signing.\n' +
      '3. Write a real privacy policy and host it at a public URL — required even for apps that ' +
      'collect almost nothing.\n4. Fill the Data Safety form honestly; mismatches cause rejections.\n' +
      '5. Prepare store assets: icon 512px, feature graphic 1024x500, at least 4 screenshots.\n' +
      '6. Test the signed release build, not the debug build — ProGuard and signing change behaviour.\n' +
      '7. Roll out to a small percentage first and watch crash statistics before going to 100%.',
    readMinutes: 7,
    publishedAt: '2026-01-08',
    tags: ['android', 'play-store', 'freelancing'],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    author: 'Amit R.',
    role: 'Startup Founder',
    rating: 5,
    comment: 'Sujoy took our idea to a working Android app in three weeks. Communication was excellent throughout.',
  },
  {
    id: 't2',
    author: 'Priya S.',
    role: 'Restaurant Owner',
    rating: 5,
    comment: 'The booking system just works. Zero downtime since launch and support has been fantastic.',
  },
  {
    id: 't3',
    author: 'Daniel K.',
    role: 'Agency PM',
    rating: 4,
    comment: 'Solid backend work, clean code, well documented. We will hire again for the next phase.',
  },
];
