import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

process.env.VITE_KAKAO_APP_KEY ??= '';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROD_BASE_PATH = process.env.VITE_BASE_PATH || '/wedding-invitation/';
const GALLERY_DIR = path.resolve(__dirname, 'public/static/assets/images/wedding-snaps');
const GALLERY_MODULE_ID = 'virtual:gallery-photos';
const RESOLVED_GALLERY_MODULE_ID = `\0${GALLERY_MODULE_ID}`;
const IMAGE_EXTENSIONS = new Set(['.webp', '.jpg', '.jpeg', '.png', '.gif', '.avif']);

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

function readGalleryFiles() {
  if (!fs.existsSync(GALLERY_DIR)) return [];

  return fs
    .readdirSync(GALLERY_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort(naturalSort);
}

function galleryPhotosPlugin() {
  return {
    name: 'gallery-photos',
    resolveId(id) {
      if (id === GALLERY_MODULE_ID) return RESOLVED_GALLERY_MODULE_ID;
      return null;
    },
    load(id) {
      if (id !== RESOLVED_GALLERY_MODULE_ID) return null;

      return `export const galleryPhotoFiles = ${JSON.stringify(readGalleryFiles(), null, 2)};\n`;
    },
    configureServer(server) {
      server.watcher.add(GALLERY_DIR);
      server.watcher.on('all', (_event, file) => {
        if (
          path.dirname(path.resolve(file)) !== GALLERY_DIR ||
          !IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase())
        ) {
          return;
        }

        const module = server.moduleGraph.getModuleById(RESOLVED_GALLERY_MODULE_ID);
        if (module) server.moduleGraph.invalidateModule(module);
        server.ws.send({ type: 'full-reload' });
      });
    },
  };
}

export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : PROD_BASE_PATH,
  plugins: [galleryPhotosPlugin(), react()],
}));
