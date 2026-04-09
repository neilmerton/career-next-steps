export const queryKeys = {
  contacts: {
    all: () => ['contacts'] as const,
    list: () => [...queryKeys.contacts.all(), 'list'] as const,
    detail: (id: string) => [...queryKeys.contacts.all(), 'detail', id] as const,
  },
  vacancies: {
    all: () => ['vacancies'] as const,
    list: () => [...queryKeys.vacancies.all(), 'list'] as const,
    detail: (id: string) => [...queryKeys.vacancies.all(), 'detail', id] as const,
  },
  dashboard: {
    all: () => ['dashboard'] as const,
    data: () => [...queryKeys.dashboard.all(), 'data'] as const,
  },
} as const
