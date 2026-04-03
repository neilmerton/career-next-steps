import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Career Next Steps',
    short_name: 'CNS',
    description: 'Job vacancy and contacts management system',
    start_url: '/?source=pwa',
    scope: '/',
    display: 'standalone',
    background_color: '#171b26',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}