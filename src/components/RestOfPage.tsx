import { AccountSection } from './AccountSection';
import { CalendarSection } from './CalendarSection';
import { FooterSection } from './FooterSection';
import { GallerySection } from './GallerySection';
import { LetterSection } from './LetterSection';
import { LocationSection } from './LocationSection';
import { MusicControl } from './MusicControl';
import { ShareSection } from './ShareSection';
import { useScrollAnimations } from '../hooks/useScrollAnimations';

type RestOfPageProps = {
  introComplete: boolean;
  showShareToast: (message: string) => void;
  showAccountToast: (message: string) => void;
};

export default function RestOfPage({
  introComplete,
  showShareToast,
  showAccountToast,
}: RestOfPageProps) {
  useScrollAnimations(introComplete);

  return (
    <>
      <LetterSection />
      <CalendarSection />
      <GallerySection />
      <LocationSection />
      <AccountSection showAccountToast={showAccountToast} />
      <ShareSection showToast={showShareToast} />
      <MusicControl />
      <FooterSection />
    </>
  );
}
