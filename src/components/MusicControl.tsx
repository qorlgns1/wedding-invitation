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

  const speakerButton = (
    <button
      type="button"
      className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#696A6A] p-0 text-white shadow-[0_2px_10px_rgba(0,0,0,0.2)] backdrop-blur-[10px] transition-all duration-300 ease-in-out hover:scale-105 hover:bg-[#5a5b5b] hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] max-[768px]:h-8 max-[768px]:w-8"
      id="bgm-speaker-button"
      onClick={() => void toggleMusic()}
      aria-label={isPlaying ? '배경음악 끄기' : '배경음악 켜기'}
    >
      {isPlaying ? (
        <Volume2 className="h-5 w-5 stroke-[2.5] max-[768px]:h-[18px] max-[768px]:w-[18px]" />
      ) : (
        <VolumeX className="h-5 w-5 stroke-[2.5] max-[768px]:h-[18px] max-[768px]:w-[18px]" />
      )}
    </button>
  );

  return (
    <>
      <div
        className={`fixed left-1/2 z-[2000] flex w-full max-w-[var(--content-max-width)] -translate-x-1/2 items-center justify-between gap-4 bg-[#696A6A] px-6 py-[0.6em] text-white shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-[10px] transition-[top] duration-500 ease-in-out ${
          showBanner ? 'top-0' : '-top-20'
        } max-[768px]:px-[1.2em] max-[768px]:py-[0.5em]`}
        id="bgm-notification-banner"
      >
        <span className="pointer-events-none font-kr text-[1em] font-medium text-white max-[768px]:text-[0.9em]">
          {weddingConfig.content.bgm.notification}
        </span>
        {showBanner && <div className="flex items-center justify-center">{speakerButton}</div>}
      </div>
      {!showBanner && (
        <div className="fixed right-5 top-2.5 z-[2001] flex items-center justify-center max-[768px]:right-[15px] max-[768px]:top-2">
          {speakerButton}
        </div>
      )}
    </>
  );
}
