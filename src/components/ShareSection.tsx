import { weddingConfig } from '../config/wedding';
import { useKakaoShare } from '../hooks/useKakaoShare';
import { assetPath } from '../lib/assets';

type ShareSectionProps = {
  showToast: (message: string) => void;
};

export function ShareSection({ showToast }: ShareSectionProps) {
  const shareToKakao = useKakaoShare(showToast);

  return (
    <section className="mx-auto w-full max-w-[var(--content-max-width)] overflow-hidden bg-white py-8">
      <div className="flex justify-center" data-scroll-animate="share-button">
        <button
          type="button"
          className="flex max-w-[calc(100%-3em)] items-center justify-center gap-2 rounded-lg bg-transparent px-6 py-[0.8em] transition-opacity duration-200 hover:opacity-70 active:opacity-50 max-[480px]:max-w-[calc(100%-2em)] max-[480px]:gap-[0.45em] max-[480px]:px-[1.3em] max-[480px]:py-[0.7em] max-[390px]:max-w-[calc(100%-1.5em)] max-[390px]:gap-[0.4em] max-[390px]:px-[1.1em] max-[390px]:py-[0.65em] max-[340px]:max-w-[calc(100%-1em)] max-[340px]:gap-[0.35em] max-[340px]:px-4 max-[340px]:py-[0.6em]"
          onClick={shareToKakao}
        >
          <img
            className="h-6 w-6 object-contain max-[768px]:h-[22px] max-[768px]:w-[22px] max-[480px]:h-5 max-[480px]:w-5 max-[340px]:h-[18px] max-[340px]:w-[18px]"
            src={assetPath(weddingConfig.assets.kakaotalkIcon)}
            alt="카카오톡"
          />
          <span className="font-kr whitespace-nowrap text-[1.1em] font-medium text-[#191919] max-[768px]:text-[1.05em] max-[480px]:text-[1em] max-[390px]:text-[0.95em] max-[340px]:text-[0.9em]">
            {weddingConfig.content.buttons.kakaoShare}
          </span>
        </button>
      </div>
    </section>
  );
}
