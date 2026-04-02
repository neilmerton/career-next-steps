export type VacancyStatus =
  | 'applied'
  | 'interviewing'
  | 'offered'
  | 'rejected'
  | 'withdrawn'
  | 'accepted'

export type VacancySource =
  | 'linkedin'
  | 'indeed'
  | 'referral'
  | 'company_website'
  | 'recruiter'
  | 'other'

export interface Contact {
  id: string
  user_id: string
  name: string
  company: string | null
  phone: string | null
  email: string | null
  next_contact_date: string | null // ISO date string (YYYY-MM-DD)
  created_at: string
}

export interface JobVacancy {
  id: string
  user_id: string
  title: string
  description: string | null
  date_applied: string | null // ISO date string (YYYY-MM-DD)
  company: string | null
  contact_id: string | null
  source: VacancySource | null
  source_other: string | null
  status: VacancyStatus
  created_at: string
}

export interface Update {
  id: string
  user_id: string
  job_vacancy_id: string | null
  contact_id: string | null
  notes: string
  occurred_at: string
  new_status: VacancyStatus | null
  new_next_contact_date: string | null // ISO date string (YYYY-MM-DD)
  created_at: string
}

// Joined types used in the UI
export interface UpdateWithRelations extends Update {
  job_vacancy?: Pick<JobVacancy, 'id' | 'title' | 'company'> | null
  contact?: Pick<Contact, 'id' | 'name' | 'company'> | null
}

export interface JobVacancyWithContact extends JobVacancy {
  contact?: Pick<Contact, 'id' | 'name'> | null
}
