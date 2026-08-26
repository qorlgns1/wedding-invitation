import { lazy, Suspense, useEffect, useState } from 'react';
import { CoverSection } from './components/CoverSection';
import { IntroAnimation } from './components/IntroAnimation';
import { Toast } from './components/Toast';
import { weddingConfig } from './config/wedding';
import { useToast } from './hooks/useToast';

const RestOfPage = lazy(() => import('./components/RestOfPage'));

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);
  const [shareToast, showShareToast] = useToast();
  const [accountToast, showAccountToast] = useToast();

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
      <Suspense fallback={null}>
        <RestOfPage
          introComplete={introComplete}
          showShareToast={showShareToast}
          showAccountToast={showAccountToast}
        />
      </Suspense>
      <Toast id="share-toast" variant="share" toast={shareToast} messageId="toast-message" />
      <Toast id="account-toast" variant="account" toast={accountToast} />
    </>
  );
}
