-- ============================================================
-- Enums
-- ============================================================

CREATE TYPE vacancy_status AS ENUM (
  'applied',
  'interviewing',
  'offered',
  'rejected',
  'withdrawn',
  'accepted'
);

CREATE TYPE vacancy_source AS ENUM (
  'linkedin',
  'indeed',
  'referral',
  'company_website',
  'recruiter',
  'other'
);

-- ============================================================
-- Tables
-- ============================================================

CREATE TABLE contacts (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name             text        NOT NULL,
  phone            text,
  email            text,
  next_contact_date date,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE job_vacancies (
  id           uuid            PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid            NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title        text            NOT NULL,
  description  text,
  date_applied date,
  company      text,
  contact_id   uuid            REFERENCES contacts(id) ON DELETE SET NULL,
  source       vacancy_source,
  source_other text,
  status       vacancy_status  NOT NULL DEFAULT 'applied',
  created_at   timestamptz     NOT NULL DEFAULT now()
);

CREATE TABLE updates (
  id                    uuid            PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid            NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_vacancy_id        uuid            REFERENCES job_vacancies(id) ON DELETE CASCADE,
  contact_id            uuid            REFERENCES contacts(id) ON DELETE CASCADE,
  notes                 text            NOT NULL,
  occurred_at           timestamptz     NOT NULL DEFAULT now(),
  new_status            vacancy_status,
  new_next_contact_date date,
  created_at            timestamptz     NOT NULL DEFAULT now()
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX contacts_user_id_idx        ON contacts(user_id);
CREATE INDEX contacts_next_contact_date_idx ON contacts(user_id, next_contact_date);

CREATE INDEX job_vacancies_user_id_idx   ON job_vacancies(user_id);
CREATE INDEX job_vacancies_status_idx    ON job_vacancies(user_id, status);
CREATE INDEX job_vacancies_contact_id_idx ON job_vacancies(contact_id);

CREATE INDEX updates_user_id_idx          ON updates(user_id);
CREATE INDEX updates_job_vacancy_id_idx   ON updates(job_vacancy_id);
CREATE INDEX updates_contact_id_idx       ON updates(contact_id);
CREATE INDEX updates_occurred_at_idx      ON updates(user_id, occurred_at DESC);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE contacts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_vacancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE updates       ENABLE ROW LEVEL SECURITY;

-- contacts policies
CREATE POLICY "contacts: select own" ON contacts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "contacts: insert own" ON contacts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "contacts: update own" ON contacts
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "contacts: delete own" ON contacts
  FOR DELETE USING (auth.uid() = user_id);

-- job_vacancies policies
CREATE POLICY "job_vacancies: select own" ON job_vacancies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "job_vacancies: insert own" ON job_vacancies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "job_vacancies: update own" ON job_vacancies
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "job_vacancies: delete own" ON job_vacancies
  FOR DELETE USING (auth.uid() = user_id);

-- updates policies
CREATE POLICY "updates: select own" ON updates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "updates: insert own" ON updates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "updates: update own" ON updates
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "updates: delete own" ON updates
  FOR DELETE USING (auth.uid() = user_id);
