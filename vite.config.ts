import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'apple-touch-icon.png', 'icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'Quizz+',
        short_name: 'Quizz+',
        description: 'Joue, progresse et défie tes amis.',
        theme_color: '#F5A623',
        background_color: '#F8F8F8',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        lang: 'fr',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,webmanifest}'],
        globIgnores: ['**/assets/sounds/**'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/assets/sounds/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'quizz-audio',
              expiration: { maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@components': path.resolve(rootDir, 'src/components'),
      '@pages': path.resolve(rootDir, 'src/pages'),
      '@services': path.resolve(rootDir, 'src/services'),
      '@stores': path.resolve(rootDir, 'src/stores'),
      '@constants': path.resolve(rootDir, 'src/constants'),
      '@app-types': path.resolve(rootDir, 'src/types'),
      '@hooks': path.resolve(rootDir, 'src/hooks'),
      '@providers': path.resolve(rootDir, 'src/providers'),
      '@utils': path.resolve(rootDir, 'src/utils'),
      '@domain': path.resolve(rootDir, 'src/domain'),
      '@platform': path.resolve(rootDir, 'src/platform'),
      '@config': path.resolve(rootDir, 'config/index.ts'),
      '@sdk': path.resolve(rootDir, 'src/sdk'),
    },
  },
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
  },
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
});
