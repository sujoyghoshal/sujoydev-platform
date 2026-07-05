/**
 * NurixSoft design tokens — single source of truth for spacing, radii,
 * elevation and brand extras that sit outside the MD3 color scheme.
 * 8-point grid throughout.
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
} as const;

/** Soft, layered shadows tuned per elevation step (Android + iOS). */
export const shadow = {
  card: {
    shadowColor: '#312E81',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  raised: {
    shadowColor: '#312E81',
    shadowOpacity: 0.14,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
} as const;

/** Brand extras not covered by the MD3 scheme. */
export const brand = {
  success: '#16A34A',
  successContainer: '#DCFCE7',
  onSuccessContainer: '#14532D',
  successDark: '#4ADE80',
  warning: '#D97706',
  warningContainer: '#FEF3C7',
  info: '#2563EB',
  infoContainer: '#DBEAFE',
  /** Decorative hero blobs (simulated gradient layers). */
  heroBlobA: 'rgba(79, 70, 229, 0.16)',
  heroBlobB: 'rgba(13, 148, 136, 0.12)',
  heroBlobDarkA: 'rgba(129, 140, 248, 0.20)',
  heroBlobDarkB: 'rgba(45, 212, 191, 0.14)',
} as const;

/** Status → color mapping shared by tickets, chips and badges. */
export const statusColors: Record<string, { bg: string; fg: string; icon: string }> = {
  Pending: { bg: '#FEF3C7', fg: '#92400E', icon: 'clock-outline' },
  'In Review': { bg: '#DBEAFE', fg: '#1E40AF', icon: 'eye-outline' },
  Accepted: { bg: '#DCFCE7', fg: '#166534', icon: 'check-circle-outline' },
  'In Progress': { bg: '#EDE9FE', fg: '#5B21B6', icon: 'progress-clock' },
  Completed: { bg: '#DCFCE7', fg: '#14532D', icon: 'check-decagram' },
  Rejected: { bg: '#FEE2E2', fg: '#991B1B', icon: 'close-circle-outline' },
  Open: { bg: '#FEE2E2', fg: '#991B1B', icon: 'bug-outline' },
  Fixed: { bg: '#DCFCE7', fg: '#166534', icon: 'check-circle-outline' },
  Closed: { bg: '#E2E8F0', fg: '#334155', icon: 'archive-outline' },
} as const;
