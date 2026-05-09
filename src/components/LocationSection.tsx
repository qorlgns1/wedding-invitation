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
    <section className="location">
      <p className="snap-subtitle-en">{content.location.subtitleEn}</p>
      <div className="header">
        <h2 className="title kr">{content.location.title}</h2>
      </div>
      <div className="location-content active" id="transport-content">
        <p className="address-text">{wedding.venue.name}</p>
        <button type="button" className="map-image-container" onClick={openMap}>
          <img
            src={assetPath(assets.mapImage)}
            alt={`${wedding.venue.name} 위치 안내도`}
            className="map-image"
            loading="lazy"
          />
          <div className="map-click-hint">
            <span>{content.location.mapClickHint}</span>
          </div>
        </button>
        <div className="map-buttons-container">
          <button
            type="button"
            className="map-button"
            onClick={() => openExternalMap(externalLinks.maps.naver)}
          >
            <img
              src={assetPath('/static/assets/images/naver_Icon.webp')}
              alt="네이버 지도 아이콘"
              className="map-icon"
              loading="lazy"
            />
            <span>{content.location.mapButtons.naver}</span>
          </button>
          <button
            type="button"
            className="map-button"
            onClick={() => openExternalMap(externalLinks.maps.kakao)}
          >
            <img
              src={assetPath('/static/assets/images/kakaomap-icon.webp')}
              alt="카카오맵 아이콘"
              className="map-icon"
              loading="lazy"
            />
            <span>{content.location.mapButtons.kakao}</span>
          </button>
          <button
            type="button"
            className="map-button"
            onClick={() => openExternalMap(externalLinks.maps.tmap)}
          >
            <img
              src={assetPath('/static/assets/images/tmap_icon.webp')}
              alt="티맵 지도 아이콘"
              className="map-icon"
              loading="lazy"
            />
            <span>{content.location.mapButtons.tmap}</span>
          </button>
        </div>
      </div>

      {mapOpen && (
        <div
          className="map-lightbox-overlay"
          id="map-lightbox"
          style={{ display: 'flex' }}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeMap();
          }}
        >
          <div className="map-lightbox-container">
            <img
              className="map-lightbox-image"
              src={assetPath(assets.mapImage)}
              alt={`${wedding.venue.name} 위치 안내도 (확대)`}
            />
            <button
              type="button"
              className="map-lightbox-close"
              onClick={() => closeMap()}
              aria-label="지도 닫기"
            >
              <X aria-hidden="true" />
            </button>
            <div className="map-lightbox-info">
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
