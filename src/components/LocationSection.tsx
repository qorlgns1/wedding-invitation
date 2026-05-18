import { X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { HISTORY_KEYS } from '../config/features';
import { weddingConfig } from '../config/wedding';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { assetPath } from '../lib/assets';
import { openExternalMap } from '../lib/maps';

export function LocationSection() {
  const [mapOpen, setMapOpen] = useState(false);
  const { content, externalLinks, assets, wedding } = weddingConfig;
  const mapLinks = [
    {
      label: content.location.mapButtons.naver,
      href: externalLinks.maps.naver,
      icon: '/static/assets/images/naver_Icon.webp',
      alt: '네이버 지도 아이콘',
    },
    {
      label: content.location.mapButtons.kakao,
      href: externalLinks.maps.kakao,
      icon: '/static/assets/images/kakaomap-icon.webp',
      alt: '카카오맵 아이콘',
    },
    {
      label: content.location.mapButtons.tmap,
      href: externalLinks.maps.tmap,
      icon: '/static/assets/images/tmap_icon.webp',
      alt: '티맵 지도 아이콘',
    },
  ] as const;

  const openMap = () => {
    setMapOpen(true);
    if (!window.history.state?.[HISTORY_KEYS.mapLightbox]) {
      window.history.pushState(
        { ...(window.history.state || {}), [HISTORY_KEYS.mapLightbox]: true },
        '',
        window.location.href
      );
    }
  };

  const closeMap = useCallback((fromPopState = false) => {
    setMapOpen(false);
    if (!fromPopState && window.history.state?.[HISTORY_KEYS.mapLightbox]) {
      window.history.back();
    }
  }, []);

  useBodyScrollLock(mapOpen);

  useEffect(() => {
    const handlePopState = () => {
      if (mapOpen) closeMap(true);
    };
    const handleKeydown = (event: KeyboardEvent) => {
      if (mapOpen && event.key === 'Escape') closeMap();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [closeMap, mapOpen]);

  return (
    <section className="mx-auto flex max-w-[var(--content-max-width)] flex-col items-center bg-white px-8 pb-16 pt-8 max-[768px]:px-4 max-[768px]:pb-12 max-[768px]:pt-6 max-[480px]:px-2 max-[480px]:pb-8 max-[480px]:pt-4">
      <p className="mb-2 text-center font-sriracha text-[0.9em] tracking-[1px] text-[#999] max-[768px]:text-[0.85em] max-[480px]:text-[0.8em]">
        {content.location.subtitleEn}
      </p>
      <div data-scroll-animate="location-title">
        <h2 className="mb-8 text-center font-kr text-[1.3rem] font-semibold tracking-[1px] text-wedding-primary max-[768px]:mb-6 max-[768px]:text-[1.2rem] max-[480px]:text-[1.1rem]">
          {content.location.title}
        </h2>
      </div>
      <div className="w-full max-w-[var(--content-max-width)]" id="transport-content">
        <p
          className="mt-2 text-center font-kr text-[1em] text-wedding-primary max-[768px]:text-[0.9em]"
          data-scroll-animate="location-address"
        >
          {wedding.venue.name}
        </p>
        <button
          type="button"
          className="group relative mx-4 mt-10 w-[calc(100%-2em)] overflow-hidden rounded-t-xl shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out hover:-translate-y-0.5 max-[768px]:mx-0 max-[768px]:mt-8 max-[768px]:w-full"
          data-scroll-animate="location-map"
          onClick={openMap}
        >
          <img
            src={assetPath(assets.mapImage)}
            alt={`${wedding.venue.name} 위치 안내도`}
            className="w-full transition-transform duration-300 ease-in-out group-hover:scale-[1.02]"
            loading="lazy"
          />
          <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(transparent,rgba(0,0,0,0.7))] px-4 pb-4 pt-8 text-center font-kr text-[0.9em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 max-[768px]:pt-6 max-[768px]:text-[0.85em] max-[768px]:opacity-100">
            <span>{content.location.mapClickHint}</span>
          </div>
        </button>
        <div
          className="mx-4 mb-8 flex w-[calc(100%-2em)] overflow-hidden rounded-b-xl bg-white shadow-[0_4px_16px_rgba(0,0,0,0.1)] max-[768px]:mx-0 max-[768px]:w-full"
          data-scroll-animate="location-map-buttons"
        >
          {mapLinks.map((link) => (
            <button
              type="button"
              className="group flex flex-1 flex-col items-center gap-2 px-6 py-4 text-center font-kr text-[1em] text-wedding-text transition-all duration-300 ease-in-out hover:-translate-y-px hover:bg-[rgba(232,225,219,0.45)] max-[768px]:px-3 max-[768px]:py-4 max-[480px]:px-2 max-[480px]:py-[0.9em]"
              key={link.label}
              onClick={() => openExternalMap(link.href)}
            >
              <img
                src={assetPath(link.icon)}
                alt={link.alt}
                className="h-[35px] w-[35px] rounded-md object-contain transition-transform duration-200 group-hover:scale-105 max-[768px]:h-8 max-[768px]:w-8 max-[480px]:h-7 max-[480px]:w-7"
                loading="lazy"
              />
              <span className="text-[0.85em] font-medium max-[480px]:text-[0.8em]">
                {link.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {mapOpen && (
        <div
          className="fixed inset-0 z-[9999] flex animate-[overlay-fade-in_0.3s_ease-out] items-center justify-center bg-black/90"
          id="map-lightbox"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeMap();
          }}
        >
          <div className="relative flex max-h-[95vh] max-w-[95vw] items-center justify-center">
            <img
              className="max-h-full max-w-full animate-[modal-zoom-in_0.3s_ease-out] rounded-lg object-contain shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
              src={assetPath(assets.mapImage)}
              alt={`${wedding.venue.name} 위치 안내도 (확대)`}
            />
            <button
              type="button"
              className="absolute -right-[50px] -top-[50px] flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-[10px] transition-all duration-300 hover:scale-110 hover:bg-white/20 max-[768px]:right-2.5 max-[768px]:top-2.5 max-[768px]:h-10 max-[768px]:w-10"
              onClick={() => closeMap()}
              aria-label="지도 닫기"
            >
              <X aria-hidden="true" />
            </button>
            <div className="absolute -bottom-[50px] left-1/2 max-w-[calc(100vw-2rem)] rounded-[20px] bg-black/70 px-6 py-[0.8em] text-center font-kr text-[1em] font-medium text-white [transform:translateX(-50%)] backdrop-blur-[10px] max-[768px]:bottom-5 max-[768px]:px-[1.2em] max-[768px]:py-[0.6em] max-[768px]:text-[0.9em]">
              <span>
                {wedding.venue.name} {content.location.mapLightboxInfo}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
