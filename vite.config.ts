import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['react/jsx-dev-runtime'],
  },
  server: {
    host: true,  
    port: 5173,   
    strictPort: true, 
    watch: {
      ignored: ['**/Dockerfile', '**/*.yml', '**/.git/**', '**/node_modules/**'],
    },
    proxy: {
      '/api': {
        target: 'http://helper.nelocal.host',
        changeOrigin: true,
      },
    },
    allowedHosts: [
      'helper.nelocal.host',
      'localhost',
      '127.0.0.1',
      '.nelocal.host',
    ],
  },
  esbuild: {
    logOverride: {
      'ignored-directive': 'silent', 
    },
  },
  logLevel: 'info', 
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (
          warning.message.includes('Module level directives') ||
          warning.message.includes('"use client"')  ||
          warning.message.includes('"was ignored"')
        ) {
          return; 
        }

        if (warning.code === 'UNRESOLVED_IMPORT') {
          throw new Error(`Build failed due to unresolved import:\n${warning.message}`);
        }

        if (warning.code === 'PLUGIN_WARNING' && /is not exported/.test(warning.message)) {
          throw new Error(`Build failed due to missing export:\n${warning.message}`);
        }

        warn(warning);
      },
    },
  },
});