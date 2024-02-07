// vite.config.js
import React from 'react';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: 'https://tonyliu2004.github.io/Google-CodeFest/',
  plugins: [react()],
});