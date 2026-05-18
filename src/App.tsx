import { useEffect, useState } from 'react';
import { AccountSection } from './components/AccountSection';
import { CalendarSection } from './components/CalendarSection';
import { CoverSection } from './components/CoverSection';
import { FooterSection } from './components/FooterSection';
import { GallerySection } from './components/GallerySection';
import { IntroAnimation } from './components/IntroAnimation';
import { LetterSection } from './components/LetterSection';
import { LocationSection } from './components/LocationSection';
import { MusicControl } from './components/MusicControl';
import { ShareSection } from './components/ShareSection';
import { Toast } from './components/Toast';
import { weddingConfig } from './config/wedding';
import { useScrollAnimations } from './hooks/useScrollAnimations';
import { useToast } from './hooks/useToast';

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);
  const [shareToast, showShareToast] = useToast();
  const [accountToast, showAccountToast] = useToast();

  useScrollAnimations(introComplete);

  useEffect(() => {
    document.title = weddingConfig.content.pageTitle;
    document.body.classList.add('loaded');

    let lastTouchY = 0;
    const onTouchStart = (event: globalThis.TouchEvent) => {
      lastTouchY = event.touches[0].clientY;
    };
    const onTouchMove = (event: globalThis.TouchEvent) => {
      const touchY = event.touches[0].clientY;
      const scrollTop = document.body.scrollTop;
      if (scrollTop <= 0 && touchY > lastTouchY) {
        event.preventDefault();
      }
    };

    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      document.body.classList.remove('loaded');
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  return (
    <>
      <IntroAnimation onComplete={() => setIntroComplete(true)} />
      <CoverSection />
      <LetterSection />
      <CalendarSection />
      <GallerySection />
      <LocationSection />
      <AccountSection showAccountToast={showAccountToast} />
      <ShareSection showToast={showShareToast} />
      <MusicControl />
      <Toast id="share-toast" variant="share" toast={shareToast} messageId="toast-message" />
      <Toast id="account-toast" variant="account" toast={accountToast} />
      <FooterSection />
    </>
  );
}
