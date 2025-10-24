import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { copyFile } from 'node:fs/promises';

function copyIndexTo404() {
  let outDir = 'dist';

  return {
    name: 'copy-index-to-404',
    configResolved(config) {
      outDir = config.build.outDir;
    },
    async closeBundle() {
      const indexPath = resolve(process.cwd(), outDir, 'index.html');
      const fallbackPath = resolve(process.cwd(), outDir, '404.html');

      try {
        await copyFile(indexPath, fallbackPath);
      } catch (error) {
        console.warn('Failed to copy index.html to 404.html', error);
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), copyIndexTo404()],
  base: '/cms_erp/',
});
