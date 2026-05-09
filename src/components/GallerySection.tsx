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
      <section className="gallery">
        <p className="snap-subtitle-en">{weddingConfig.content.gallery.subtitleEn}</p>
        <div className="header">
          <h2 className="title kr">{weddingConfig.content.gallery.title}</h2>
        </div>
        <div className="photo-grid" id="photo-grid">
          {photos.map((photo, index) => (
            <button
              className="photo-item"
              data-index={index}
              key={photo.key}
              type="button"
              onClick={() => openLightbox(index)}
            >
              <img
                src={photo.src}
                alt={`Gallery photo ${index + 1}`}
                loading="lazy"
                decoding="async"
                style={{ background: '#f5f5f5' }}
              />
            </button>
          ))}
        </div>
      </section>

      {lightboxPhoto && (
        <div
          className="gallery-lightbox-overlay"
          id="gallery-lightbox"
          style={{ display: 'flex' }}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeLightbox();
          }}
          onTouchStart={(event: TouchEvent<HTMLDivElement>) => {
            touchStartXRef.current = event.touches[0].clientX;
          }}
          onTouchMove={(event: TouchEvent<HTMLDivElement>) => {
            touchEndXRef.current = event.touches[0].clientX;
          }}
          onTouchEnd={handleTouchEnd}
        >
          <div className="gallery-lightbox-container">
            <button
              type="button"
              className="gallery-lightbox-close"
              onClick={() => closeLightbox()}
              aria-label="갤러리 닫기"
            >
              <X aria-hidden="true" />
            </button>
            <button
              type="button"
              className="gallery-lightbox-nav prev"
              onClick={() => navigateLightbox(-1)}
              aria-label="이전 사진"
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <img
              className="gallery-lightbox-image"
              id="lightbox-image"
              src={lightboxPhoto.src}
              alt="갤러리 확대 보기"
            />
            <button
              type="button"
              className="gallery-lightbox-nav next"
              onClick={() => navigateLightbox(1)}
              aria-label="다음 사진"
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
