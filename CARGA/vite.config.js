import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Keep your existing Tailwind plugin setup

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['.trycloudflare.com'],
  },
  preview: {
    host: true,
    port: 5173,
    allowedHosts: ['.trycloudflare.com'],
  },
});