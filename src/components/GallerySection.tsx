import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { type TouchEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { galleryPhotoFiles } from 'virtual:gallery-photos';
import { HISTORY_KEYS } from '../config/features';
import { weddingConfig } from '../config/wedding';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { assetPath } from '../lib/assets';
import {
  encodePathSegment,
  type GalleryPhoto,
  normalizeGalleryBasePath,
} from '../lib/gallery';

export function GallerySection() {
  const photos = useMemo<GalleryPhoto[]>(() => {
    const basePath = normalizeGalleryBasePath(weddingConfig.assets.galleryPath);

    return galleryPhotoFiles.map((fileName) => ({
      src: assetPath(`${basePath}${encodePathSegment(fileName)}`),
      key: fileName,
    }));
  }, []);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  const closeLightbox = useCallback((fromPopState = false) => {
    setLightboxIndex(null);
    if (!fromPopState && window.history.state?.[HISTORY_KEYS.galleryLightbox]) {
      window.history.back();
    }
  }, []);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    if (!window.history.state?.[HISTORY_KEYS.galleryLightbox]) {
      window.history.pushState(
        { ...(window.history.state || {}), [HISTORY_KEYS.galleryLightbox]: true },
        '',
        window.location.href
      );
    }
  };

  const navigateLightbox = useCallback(
    (direction: number) => {
      setLightboxIndex((current) => {
        if (current === null || photos.length === 0) return current;
        const next = current + direction;
        if (next < 0) return photos.length - 1;
        if (next >= photos.length) return 0;
        return next;
      });
    },
    [photos.length]
  );

  useBodyScrollLock(lightboxIndex !== null);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') navigateLightbox(-1);
      if (event.key === 'ArrowRight') navigateLightbox(1);
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [closeLightbox, lightboxIndex, navigateLightbox]);

  useEffect(() => {
    const handlePopState = () => {
      if (lightboxIndex !== null) closeLightbox(true);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [closeLightbox, lightboxIndex]);

  const lightboxPhoto = lightboxIndex === null ? null : (photos[lightboxIndex] ?? null);

  const handleTouchEnd = () => {
    const swipeDistance = touchEndXRef.current - touchStartXRef.current;
    if (Math.abs(swipeDistance) > 50) {
      navigateLightbox(swipeDistance > 0 ? -1 : 1);
    }
    touchStartXRef.current = 0;
    touchEndXRef.current = 0;
  };

  return (
    <>
      <section className="mx-auto max-w-[var(--content-max-width)] bg-white px-4 pb-16 pt-[4.5em] max-[768px]:px-2 max-[768px]:py-12 max-[480px]:px-[0.3em] max-[480px]:py-10">
        <p className="mb-2 text-center font-sriracha text-[0.9em] tracking-[1px] text-[#999] max-[768px]:text-[0.85em] max-[480px]:text-[0.8em]">
          {weddingConfig.content.gallery.subtitleEn}
        </p>
        <div className="mb-6 text-center" data-scroll-animate="gallery-title">
          <h2 className="font-kr text-[1.3rem] font-semibold tracking-[1px] text-wedding-primary max-[768px]:text-[1.2rem] max-[480px]:text-[1.1rem]">
            {weddingConfig.content.gallery.title}
          </h2>
        </div>
        <div
          className="mx-auto grid max-w-[var(--content-max-width)] grid-cols-3 gap-1 max-[768px]:gap-[3px] max-[480px]:gap-0.5"
          data-scroll-animate="gallery-grid"
          id="photo-grid"
        >
          {photos.map((photo, index) => (
            <button
              className="relative aspect-[2/3] overflow-hidden bg-[#f5f5f5] transition-opacity hover:opacity-90 [contain:layout_paint]"
              data-index={index}
              key={photo.key}
              type="button"
              onClick={() => openLightbox(index)}
            >
              <img
                src={photo.src}
                alt={`Gallery photo ${index + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      </section>

      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-[9999] flex animate-[overlay-fade-in_0.3s_ease-out] items-center justify-center bg-black/95 [backface-visibility:hidden] [will-change:opacity]"
          id="gallery-lightbox"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeLightbox();
          }}
          onTouchStart={(event: TouchEvent<HTMLDivElement>) => {
            touchStartXRef.current = event.touches[0].clientX;
            touchEndXRef.current = event.touches[0].clientX;
          }}
          onTouchMove={(event: TouchEvent<HTMLDivElement>) => {
            touchEndXRef.current = event.touches[0].clientX;
          }}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative flex h-full w-full items-center justify-center">
            <button
              type="button"
              className="absolute right-5 top-5 z-[10001] flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:scale-110 hover:bg-white/20 max-[768px]:right-[15px] max-[768px]:top-[15px] max-[768px]:h-10 max-[768px]:w-10"
              onClick={() => closeLightbox()}
              aria-label="갤러리 닫기"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="absolute left-5 top-1/2 z-[10001] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-300 [transform:translateY(-50%)] hover:bg-white/20 max-[768px]:left-2.5 max-[768px]:h-10 max-[768px]:w-10"
              onClick={() => navigateLightbox(-1)}
              aria-label="이전 사진"
            >
              <ChevronLeft className="h-7 w-7" aria-hidden="true" />
            </button>
            <img
              className="max-h-[85vh] max-w-[90vw] animate-[modal-zoom-in_0.3s_ease-out] object-contain max-[480px]:max-h-[80vh] max-[480px]:max-w-[95vw]"
              id="lightbox-image"
              src={lightboxPhoto.src}
              alt="갤러리 확대 보기"
            />
            <button
              type="button"
              className="absolute right-5 top-1/2 z-[10001] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-300 [transform:translateY(-50%)] hover:bg-white/20 max-[768px]:right-2.5 max-[768px]:h-10 max-[768px]:w-10"
              onClick={() => navigateLightbox(1)}
              aria-label="다음 사진"
            >
              <ChevronRight className="h-7 w-7" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
