import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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

// index.html의 %VITE_*% 치환에 쓰이는 값들. process.env에 미리 기본값을 넣어두면
// dotenv가 이미 설정된 키를 덮어쓰지 않아 .env의 실제 값이 무시되므로,
// 반드시 loadEnv로 .env를 먼저 읽은 뒤 최종값(.env 값 또는 기본값)을 대입한다.
const HTML_ENV_DEFAULTS = {
  VITE_KAKAO_APP_KEY: '',
  VITE_PAGE_TITLE: '김민준 ♥ 이서연의 결혼식에 초대합니다',
  VITE_META_TITLE: '민준 ♥ 서연의 결혼식',
  VITE_META_DESCRIPTION: '2030년 05월 17일 (금) 오후 2시, 서울 그랜드 웨딩홀에서 진행됩니다',
  VITE_META_IMAGE: '/static/assets/images/og-image.webp',
  // wedding.ts의 introImage 기본값과 동일하게 맞춘다 (preload 태그가 빈 값을 갖지 않도록).
  VITE_INTRO_IMAGE_URL: '/static/assets/images/animation1.webp',
};

export default defineConfig(({ command, mode }) => {
  const fileEnv = loadEnv(mode, process.cwd(), 'VITE_');

  for (const [key, fallback] of Object.entries(HTML_ENV_DEFAULTS)) {
    const value = fileEnv[key];
    process.env[key] = value && value.trim().length > 0 ? value : fallback;
  }

  const PROD_BASE_PATH = fileEnv.VITE_BASE_PATH || '/wedding-invitation/';

  return {
    base: command === 'serve' ? '/' : PROD_BASE_PATH,
    plugins: [galleryPhotosPlugin(), tailwindcss(), react()],
  };
});
