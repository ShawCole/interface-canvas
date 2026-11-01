import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// The two real component trees. Nothing is copied: the canvas renders the files the dashboards ship.
const VPS = process.env.CANVAS_VPS_SRC || '/home/shaw/scripts/agent-orchestra/dashboard/src';
const PAUL = process.env.CANVAS_PAUL_SRC || '/home/shaw/repos/orchestraos-paul-main/dashboard/src';
const here = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@vps': VPS, '@paul': PAUL, '@stageshow': path.resolve(here, '../stageshow') },
    // One React for three trees, or every hook in a foreign component throws "invalid hook call".
    dedupe: ['react', 'react-dom', 'react-router-dom', 'zustand', 'lucide-react', '@tanstack/react-query'],
  },
  server: {
    port: 8895, host: '127.0.0.1', allowedHosts: true,
    fs: { allow: [here, path.resolve(here, '..'), VPS, PAUL, path.resolve(VPS, '..'), path.resolve(PAUL, '..')] },
    proxy: { '/api': 'http://localhost:8888' },
  },
  define: { __CANVAS_VPS__: JSON.stringify(VPS), __CANVAS_PAUL__: JSON.stringify(PAUL) },
});
