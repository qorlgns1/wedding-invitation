import { useEffect, useRef, useState } from 'react';
import { weddingConfig } from '../config/wedding';
import { assetPath } from '../lib/assets';

const VARA_SCRIPT_ID = 'vara-script';

type IntroAnimationProps = {
  onComplete: () => void;
};

function loadVaraScript(src: string): Promise<void> {
  if (window.Vara) return Promise.resolve();

  const existingScript = document.getElementById(VARA_SCRIPT_ID) as HTMLScriptElement | null;
  if (existingScript?.dataset.loaded === 'true') return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = existingScript ?? document.createElement('script');
    script.id = VARA_SCRIPT_ID;
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load Vara.js'));

    if (!existingScript) document.head.appendChild(script);
  });
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const varaContainerRef = useRef<HTMLDivElement>(null);
  const underlineDataRef = useRef<{
    container: HTMLDivElement;
    fontSize: number;
    isMobile: boolean;
  } | null>(null);
  const varaRef = useRef<{ playAll(): void } | null>(null);

  useEffect(() => {
    if (!visible) return;

    document.body.classList.add('intro-active');
    document.body.style.overflow = 'hidden';

    let isStarted = false;
    let isVaraReady = false;
    let isImageReady = false;
    let cancelled = false;
    const timeouts: number[] = [];

    const clearIntro = () => {
      if (cancelled) return;
      setVisible(false);
      document.body.style.overflow = '';
      document.body.classList.remove('intro-active');
      onComplete();
    };

    const startMarriedUnderline = () => {
      const underlineData = underlineDataRef.current;
      if (!underlineData) return;

      const { container, fontSize, isMobile } = underlineData;
      const svg = container.querySelector('svg');
      if (!svg) return;

      let svgBBox: DOMRect | SVGRect;
      try {
        svgBBox = svg.getBBox();
      } catch {
        return;
      }

      const lineHeight = fontSize * 1.2;
      const startY = 50;
      const marriedY = startY + lineHeight * 2;
      const baseY = marriedY + fontSize + (isMobile ? 8 : 12);
      const diagonalShift = isMobile ? 15 : 30;
      const underlineStartX = svgBBox.x + diagonalShift - 10;
      const underlineEndX = svgBBox.x + svgBBox.width + diagonalShift + 10;

      const createUnderline = (yOffset: number, delay: number, angleOffset: number) => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', String(underlineStartX));
        line.setAttribute('y1', String(baseY + yOffset));
        line.setAttribute('x2', String(underlineEndX));
        line.setAttribute('y2', String(baseY + yOffset - angleOffset));
        line.setAttribute('stroke', '#fff');
        line.setAttribute('stroke-width', isMobile ? '1.5' : '2');
        line.setAttribute('stroke-linecap', 'round');

        const lineLength = Math.sqrt(
          Math.pow(underlineEndX - underlineStartX, 2) + Math.pow(angleOffset, 2)
        );
        line.setAttribute('stroke-dasharray', String(lineLength));
        line.setAttribute('stroke-dashoffset', String(lineLength));
        line.style.filter = 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.5))';
        line.style.transition = 'stroke-dashoffset 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        svg.appendChild(line);

        timeouts.push(
          window.setTimeout(() => {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => line.setAttribute('stroke-dashoffset', '0'));
            });
          }, delay)
        );
      };

      createUnderline(0, 0, isMobile ? 4 : 7);
      createUnderline(isMobile ? 4 : 5, 100, isMobile ? 6 : 10);
    };

    const startIntro = () => {
      if (cancelled || isStarted) return;
      isStarted = true;
      setReady(true);

      timeouts.push(
        window.setTimeout(() => {
          varaRef.current?.playAll();
        }, 1000),
        window.setTimeout(() => {
          startMarriedUnderline();
        }, 2800),
        window.setTimeout(() => {
          const bgImage = imageRef.current;
          const textContainer = varaContainerRef.current;
          if (bgImage) {
            bgImage.style.transition = 'opacity 1s ease-out';
            bgImage.style.opacity = '0';
          }
          if (textContainer) {
            textContainer.style.transition = 'opacity 1s ease-out';
            textContainer.style.opacity = '0';
          }
        }, 3500),
        window.setTimeout(clearIntro, 4800)
      );
    };

    const checkReady = () => {
      if (cancelled) return;
      if (isImageReady && isVaraReady) startIntro();
    };

    const container = varaContainerRef.current;
    if (container) {
      container.innerHTML = '';
      const isMobile = window.innerWidth <= 768;
      const fontSize = isMobile ? 50 : 90;
      const strokeWidth = isMobile ? 1.5 : 2;
      const lineHeight = fontSize * 1.2;
      const startY = 50;
      const diagonalShift = isMobile ? 15 : 30;

      const initializeVara = () => {
        if (cancelled) return;

        if (!window.Vara) {
          isVaraReady = true;
          checkReady();
          return;
        }

        const vara = new window.Vara(
          '#vara-container',
          assetPath(weddingConfig.assets.introFont),
          [
            {
              text: "We're",
              fontSize,
              strokeWidth,
              color: '#fff',
              duration: 700,
              textAlign: 'center',
              x: -diagonalShift,
              y: startY,
              fromCurrentPosition: { x: false, y: false },
            },
            {
              text: 'getting',
              fontSize,
              strokeWidth,
              color: '#fff',
              duration: 700,
              textAlign: 'center',
              x: 0,
              y: startY + lineHeight,
              fromCurrentPosition: { x: false, y: false },
            },
            {
              text: 'married!',
              fontSize,
              strokeWidth,
              color: '#fff',
              duration: 400,
              textAlign: 'center',
              x: diagonalShift,
              y: startY + lineHeight * 2,
              fromCurrentPosition: { x: false, y: false },
            },
          ],
          { strokeWidth, fontSize, textAlign: 'center', autoAnimation: false }
        );

        vara.ready(() => {
          varaRef.current = vara;
          underlineDataRef.current = { container, fontSize, isMobile };
          container.querySelectorAll('svg').forEach((svg) => {
            svg.style.overflow = 'visible';
          });
          isVaraReady = true;
          checkReady();
        });
      };

      void loadVaraScript(assetPath(weddingConfig.assets.varaScript))
        .then(initializeVara)
        .catch(() => {
          if (cancelled) return;
          isVaraReady = true;
          checkReady();
        });
    } else {
      isVaraReady = true;
    }

    const image = imageRef.current;
    const handleImageReady = () => {
      if (cancelled) return;
      isImageReady = true;
      checkReady();
    };

    if (!image || image.complete) {
      isImageReady = true;
      checkReady();
    } else {
      image.addEventListener('load', handleImageReady);
      image.addEventListener('error', handleImageReady);
    }

    timeouts.push(window.setTimeout(startIntro, 2000));

    return () => {
      cancelled = true;
      image?.removeEventListener('load', handleImageReady);
      image?.removeEventListener('error', handleImageReady);
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
      document.body.style.overflow = '';
      document.body.classList.remove('intro-active');
    };
  }, [onComplete, visible]);

  if (!visible) return null;

  return (
    <div
      className={`intro-animation-overlay${ready ? ' ready' : ''}`}
      id="intro-animation-overlay"
    >
      <div className="intro-scene intro-scene-1">
        <img
          ref={imageRef}
          src={assetPath(weddingConfig.assets.introImage)}
          alt="Wedding Couple"
          className="intro-bg-image"
          decoding="async"
          fetchPriority="high"
        />

        <div className="intro-content">
          <div className="intro-main-text" id="vara-container" ref={varaContainerRef} />
          <div className="intro-bottom-text">
            <span className="intro-bottom-left">WEDDING</span>
            <span className="intro-bottom-right">INVITATION</span>
          </div>
        </div>
      </div>
    </div>
  );
}
