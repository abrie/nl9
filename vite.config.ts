import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'phaser': 'phaser/dist/phaser.js'
    }
  },
  build: {
    rollupOptions: {
      output: {
        format: 'es'
      }
    }
  }
});
