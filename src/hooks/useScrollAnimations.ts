import { useEffect } from 'react';

export function useScrollAnimations(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;

    const animationSelectors = [
      '.letter .header',
      '.letter .letter',
      '.letter .family-description',
      '.calendar .d-day-display',
      '.calendar .calendar-buttons',
      '.gallery .header',
      '.gallery .photo-grid',
      '[data-scroll-animate="location-title"]',
      '[data-scroll-animate="location-address"]',
      '[data-scroll-animate="location-map"]',
      '[data-scroll-animate="location-map-buttons"]',
      '[data-scroll-animate="account-title"]',
      '[data-scroll-animate="account-list"]',
      '[data-scroll-animate="share-button"]',
    ];

    const elements = animationSelectors.flatMap((selector) =>
      Array.from(document.querySelectorAll<HTMLElement>(selector))
    );

    elements.forEach((element, index) => {
      const animationType = element.closest('.letter')
        ? 'letter-reveal'
        : index % 3 === 1
          ? 'fade-in-left'
          : index % 3 === 2
            ? 'fade-in-right'
            : 'fade-in-up';

      element.classList.add(animationType);
      if (index > 2) {
        element.classList.add(`delay-${((index - 3) % 3) + 1}`);
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [enabled]);
}
