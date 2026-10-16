import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: true, // Listen on all network interfaces (0.0.0.0) so it runs on custom domains, local network, tunnels
    port: 5173,
    allowedHosts: true, // Vite 6 allows all domain hostnames
    cors: true
  },
  preview: {
    host: true,
    port: 4173,
    allowedHosts: true
  },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 1200
  }
});
