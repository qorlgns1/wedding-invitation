import { useCallback, useEffect, useRef, useState } from 'react';
import { weddingConfig } from '../config/wedding';
import { assetPath } from '../lib/assets';

type IntroAnimationProps = {
  onComplete: () => void;
};

const INTRO_FALLBACK_START_DELAY_MS = 2000;
const INTRO_FADE_START_DELAY_MS = 3500;
const INTRO_COMPLETE_DELAY_MS = 4800;

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [fading, setFading] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const completedRef = useRef(false);

  const completeIntro = useCallback(() => {
    if (completedRef.current) return;

    completedRef.current = true;
    setVisible(false);
    document.body.style.overflow = '';
    document.body.classList.remove('intro-active');
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    if (!visible) return;

    document.body.classList.add('intro-active');
    document.body.style.overflow = 'hidden';

    let started = false;
    const timeouts: number[] = [];
    const image = imageRef.current;

    const startIntro = () => {
      if (started) return;
      started = true;
      setReady(true);

      timeouts.push(
        window.setTimeout(() => setFading(true), INTRO_FADE_START_DELAY_MS),
        window.setTimeout(completeIntro, INTRO_COMPLETE_DELAY_MS)
      );
    };

    const handleImageReady = () => startIntro();

    if (!image || image.complete) {
      timeouts.push(window.setTimeout(startIntro, 100));
    } else {
      image.addEventListener('load', handleImageReady);
      image.addEventListener('error', handleImageReady);
    }

    timeouts.push(window.setTimeout(startIntro, INTRO_FALLBACK_START_DELAY_MS));

    return () => {
      image?.removeEventListener('load', handleImageReady);
      image?.removeEventListener('error', handleImageReady);
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
      document.body.style.overflow = '';
      document.body.classList.remove('intro-active');
    };
  }, [completeIntro, visible]);

  if (!visible) return null;

  const fadeStyle = {
    opacity: fading ? 0 : undefined,
    transition: 'opacity 1s ease-out',
  };
  const underlineClass = `absolute left-0 h-0.5 w-full origin-left rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.5)] transition-transform delay-[2800ms] duration-300 ease-in-out ${
    ready ? 'scale-x-100' : 'scale-x-0'
  }`;

  return (
    <div
      className="fixed left-1/2 top-0 z-[10000] h-full w-full max-w-[650px] -translate-x-1/2 overflow-hidden bg-black opacity-100 shadow-[0_0_20px_rgba(0,0,0,0.5)] [backface-visibility:hidden] [will-change:opacity] max-[768px]:left-0 max-[768px]:max-w-full max-[768px]:translate-x-0"
      id="intro-animation-overlay"
    >
      <div
        className={`absolute inset-0 flex items-center justify-center overflow-hidden transition-opacity duration-500 ease-out ${
          ready ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <img
          ref={imageRef}
          src={assetPath(weddingConfig.assets.introImage)}
          alt="Wedding Couple"
          className="absolute left-1/2 top-0 z-[1] h-full min-h-full w-full min-w-full -translate-x-1/2 animate-[intro-bg-slide-desktop_1s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards] object-cover object-center brightness-[0.7] max-[768px]:left-0 max-[768px]:translate-x-0 max-[768px]:animate-[intro-bg-slide-mobile_1s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards]"
          decoding="async"
          fetchPriority="high"
          style={fadeStyle}
        />

        <div
          className="relative z-[2] flex h-full w-full animate-[intro-slide-in_1s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards] flex-col items-center justify-center p-5"
          style={fadeStyle}
        >
          <div className="z-10 mb-5 flex min-h-[360px] w-full flex-col items-center justify-center text-center font-sacramento text-[90px] leading-[1.2] text-white [text-shadow:0_4px_10px_rgba(0,0,0,0.5)] max-[768px]:min-h-[250px] max-[768px]:text-[50px]">
            <span className="-translate-x-[30px] max-[768px]:-translate-x-[15px]">
              We're
            </span>
            <span>getting</span>
            <span className="relative translate-x-[30px] max-[768px]:translate-x-[15px]">
              married!
              <span className={`${underlineClass} -bottom-2 rotate-[-1deg]`} />
              <span className={`${underlineClass} -bottom-3 rotate-[-2deg] delay-[2900ms]`} />
            </span>
          </div>

          <div className="absolute bottom-[60px] left-0 flex w-full justify-between px-10 font-montserrat text-[0.85rem] font-normal tracking-[0.25em] text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.8)] max-[768px]:px-5 max-[768px]:text-[0.75rem] max-[768px]:tracking-[0.2em]">
            <span>WEDDING</span>
            <span>INVITATION</span>
          </div>
        </div>
      </div>
    </div>
  );
}
