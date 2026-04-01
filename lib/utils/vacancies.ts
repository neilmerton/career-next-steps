import type { VacancyStatus, VacancySource } from '@/types/database'

export const STATUS_LABELS: Record<VacancyStatus, string> = {
  applied: 'Applied',
  interviewing: 'Interviewing',
  offered: 'Offered',
  accepted: 'Accepted',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
}

export const SOURCE_LABELS: Record<VacancySource, string> = {
  linkedin: 'LinkedIn',
  indeed: 'Indeed',
  referral: 'Referral',
  company_website: 'Company website',
  recruiter: 'Recruiter',
  other: 'Other',
}

/** Display order for grouping the list page */
export const STATUS_ORDER: VacancyStatus[] = [
  'applied',
  'interviewing',
  'offered',
  'accepted',
  'rejected',
  'withdrawn',
]

export const ALL_STATUSES: VacancyStatus[] = [
  'applied', 'interviewing', 'offered', 'rejected', 'withdrawn', 'accepted',
]

export const ALL_SOURCES: VacancySource[] = [
  'linkedin', 'indeed', 'referral', 'company_website', 'recruiter', 'other',
]
