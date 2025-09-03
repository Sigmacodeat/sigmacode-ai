import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';
import type { PluginOption } from 'vite';
import { compression } from 'vite-plugin-compression2';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// Temporarily disable PWA to avoid Workbox precache errors in production
// import { VitePWA } from 'vite-plugin-pwa';

// Load workspace root .env so that process.env is populated for dev proxy, etc.
// Note: Client-side import.meta.env will still use envDir (set below) and only expose envPrefix vars.
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  // Determine API target dynamically to avoid hardcoding ports
  // Priority: VITE_API_TARGET -> PORT -> 3081
  // Example: VITE_API_TARGET=http://localhost:3080
  //          PORT=3081 (docker-compose default)
  // Note: envDir is set to '../' so client VITE_* vars load from LibreChat_fresh/.env,
  // while process.env is hydrated from workspace root via dotenv above.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  __apiTarget: undefined,
  server: {
    host: 'localhost',
    port: 3092,
    strictPort: false,
    open: true,
    proxy: (() => {
      // Important: never use process.env.PORT here, Vite may set it to the dev server port (e.g., 3092)
      // which would cause the proxy to target itself and create a loop.
      const apiTarget = process.env.VITE_API_TARGET || 'http://localhost:3081';
      return {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
      },
      '/oauth': {
        target: apiTarget,
        changeOrigin: true,
      },
      '/dev-email': {
        target: apiTarget,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dev-email/, '/api/dev/email'),
      },
    }; })(),
  },
  // Provide minimal shims for browser builds where some libs (e.g., sandpack) read process.env
  define: {
    'process.env': {},
  },
  // Set the directory where environment variables are loaded from and restrict prefixes
  envDir: '../',
  envPrefix: ['VITE_', 'SCRIPT_', 'DOMAIN_', 'ALLOW_'],
  plugins: ([
    react(),
    // PWA temporarily disabled to stabilize production deployment
    sourcemapExclude({ excludeNodeModules: true }),
    compression({
      threshold: 10240,
    }),
  ]) as PluginOption[],
  publicDir: command === 'serve' ? './public' : false,
  build: {
    sourcemap: process.env.NODE_ENV === 'development',
    outDir: './dist',
    target: 'es2020',
    minify: 'esbuild',
    rollupOptions: {
      preserveEntrySignatures: 'strict',
      output: {
        // Let Rollup decide chunking automatically to avoid init-order issues
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.names?.[0] && /\.(woff|woff2|eot|ttf|otf)$/.test(assetInfo.names[0])) {
            return 'assets/fonts/[name][extname]';
          }
          return 'assets/[name].[hash][extname]';
        },
      },
      /**
       * Ignore "use client" warning since we are not using SSR
       * @see {@link https://github.com/TanStack/query/pull/5161#issuecomment-1477389761 Preserve 'use client' directives TanStack/query#5161}
       */
      onwarn(warning, warn) {
        if (warning.message.includes('Error when using sourcemap')) {
          return;
        }
        warn(warning);
      },
    },
    chunkSizeWarningLimit: 1600,
    assetsInlineLimit: 4096,
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src/'),
      '~': path.join(__dirname, 'src/'),
      $fonts: path.resolve(__dirname, 'public/fonts'),
      'micromark-extension-math': 'micromark-extension-llm-math',
      // Shim problematische unenv-Pfade, die vom node-stdlib-browser Alias-Plugin angefragt werden
      // und in Browser-Builds nicht benötigt werden.
      'unenv/mock/empty': path.resolve(__dirname, 'src/shims/empty.ts'),
      'unenv/node/inspector/promises': path.resolve(__dirname, 'src/shims/empty.ts'),
      'unenv/node/readline/promises': path.resolve(__dirname, 'src/shims/empty.ts'),
    },
    // Verhindert doppelte React-Instanzen (z. B. wenn verlinkte Pakete React auflösen)
    dedupe: ['react', 'react-dom'],
  },
  css: {
    devSourcemap: true,
    modules: {
      localsConvention: 'camelCaseOnly',
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "src/styles/_variables.scss";`,
      },
    },
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
}));

interface SourcemapExclude {
  excludeNodeModules?: boolean;
}
export function sourcemapExclude(opts?: SourcemapExclude) {
  return {
    name: 'sourcemap-exclude',
    transform(code: string, id: string) {
      if (opts?.excludeNodeModules && id.includes('node_modules')) {
        return {
          code,
          // https://github.com/rollup/rollup/blob/master/docs/plugin-development/index.md#source-code-transformations
          map: { mappings: '' },
        };
      }
    },
  };
}
