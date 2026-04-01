# Career Next Steps

## Problem

As someone who has recently entered the job-market I'm finding it difficult to keep track of job applications I've made, and conversations I've have with recruitment consultants. The problem with job applications is they are made on a variety of different platforms. Some are tracked in LinkedIn's My Jobs area, some are tracked in Indeed, and other's in various different systems. The problem with conversations I've had with recruitment consultants is some might be via telephone, some via LinkedIn Messages, and other's in emails.

## Solution

Build a web-based system to help me keep track of job applications I've made, and conversations I've had with recruitment consultants. This will provide a central source with my career's next steps, and will help me manage the process of finding my next role.

## Authentication

- A user must be able to sign up, log in, log out, and reset their password
- Authentication will be handled via Supabase

## Features

### Dashboard

- The dashboard is the default view after logging in
- Job vacancies: summary counts grouped by status
- Recruitment consultants: list of contacts who are overdue for contact, or have a next contact date within the next 3 days
- Latest updates: a combined feed of the last 10 updates across all job vacancies and recruitment consultants, with the ability to navigate to the relevant record from each update

### Job Vacancies

- A user must be able to add a job vacancy they have applied for with the following fields:
  - Job title
  - Description
  - Date applied
  - Company
  - Contact (optional — select an existing contact or create a new one inline)
  - Source (predefined list: LinkedIn, Indeed, Company Website, Email, Job Board, Other — when Other is selected the user can free-type a value)
- Job vacancy statuses are: Applied, Interviewing, Rejected, Offered, Accepted, Declined
- Status changes are recorded as an update — a status change cannot be made without also providing an update (see Updates below)
- A user must be able to add an update to a job vacancy without changing its status
- A user must be able to update a job vacancy's data fields in case there is an error
- A user must be able to remove a job vacancy in case it was created in error — this permanently deletes the vacancy and all its associated updates; linked contact records are not affected
- A user must be able to view all job vacancies grouped by status and then by date applied (oldest to most recent)

### Contacts

- Contacts are a shared entity used by both job vacancies and recruitment consultants
- A contact record contains: name, phone number, email address
- A contact can be linked to multiple job vacancies
- A user must be able to add a contact's details directly from the recruitment consultants section
- A user must be able to add an update to a contact/recruitment consultant (see Updates below)
- A user must be able to optionally set or change a next contact date for a contact — this must be done via an update; the next contact date is a field on the contact record
- A user must be able to add an update to a contact without changing the next contact date
- A user must be able to update a contact's data fields in case there is an error
- A user must be able to remove a contact in case it was created in error — this permanently deletes the contact record and all its associated updates; any job vacancies previously linked to the contact will retain a record of the association
- A user must be able to view all contacts ordered by next contact date; where no next contact date is set, the contact's created date plus 10 days is used as the ordering value

### Updates

- Updates for both job vacancies and recruitment consultants are stored in a single shared updates table
- Each update is linked to either a job vacancy or a contact (not both)
- An update contains: notes (required), date/time (defaults to current date/time, editable by the user), optional new status (job vacancy updates only), optional next contact date (contact updates only)
- Updates cannot be edited or deleted independently — they are deleted only when the parent record is deleted

## Non-Functional Requirements

- The system must be usable on both desktop and mobile devices, for mobile devices that main navigation must follow mobile app design (i.e. be fixed to the bottom of the screen) to ensure ease of use for the users
- Notifications and reminders are not required for the MVP
