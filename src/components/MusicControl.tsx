import { Volume2, VolumeX } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { weddingConfig } from '../config/wedding';
import { assetPath } from '../lib/assets';

export function MusicControl() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hideTimeoutRef = useRef<number | undefined>(undefined);

  const showNotification = useCallback(() => {
    setShowBanner(true);
    if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = window.setTimeout(() => setShowBanner(false), 3000);
  }, []);

  const tryAutoplay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !audio.paused) return;

    try {
      await audio.play();
      showNotification();
    } catch {
      setIsPlaying(false);
    }
  }, [showNotification]);

  useEffect(() => {
    const audio = new Audio(assetPath(weddingConfig.assets.backgroundMusic));
    audio.loop = true;
    audio.volume = 0.3;
    audio.preload = 'metadata';
    audioRef.current = audio;

    const onPlay = () => {
      setIsPlaying(true);
      localStorage.setItem('wedding-music-playing', 'true');
    };
    const onPause = () => {
      setIsPlaying(false);
      localStorage.setItem('wedding-music-playing', 'false');
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.load();

    const onFirstInteraction = (event: PointerEvent) => {
      const target = event.target;
      if (
        target instanceof Element &&
        (target.closest('#bgm-speaker-button') || target.closest('#intro-animation-overlay'))
      ) {
        return;
      }

      window.removeEventListener('pointerdown', onFirstInteraction, true);
      if (localStorage.getItem('wedding-music-playing') !== 'false') {
        void tryAutoplay();
      }
    };

    window.addEventListener('pointerdown', onFirstInteraction, true);

    return () => {
      window.removeEventListener('pointerdown', onFirstInteraction, true);
      audio.pause();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current);
    };
  }, [tryAutoplay]);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      return;
    }

    try {
      await audio.play();
      showNotification();
    } catch {
      window.alert('음악 재생에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div
      className={`bgm-notification-banner${showBanner ? ' show' : ''}`}
      id="bgm-notification-banner"
    >
      <span className="bgm-notification-text">{weddingConfig.content.bgm.notification}</span>
      <div className={`bgm-speaker-control${showBanner ? '' : ' detached'}`}>
        <button
          type="button"
          className="bgm-speaker-button"
          id="bgm-speaker-button"
          onClick={() => void toggleMusic()}
          aria-label={isPlaying ? '배경음악 끄기' : '배경음악 켜기'}
        >
          {isPlaying ? <Volume2 data-lucide="volume-2" /> : <VolumeX data-lucide="volume-x" />}
        </button>
      </div>
    </div>
  );
}
