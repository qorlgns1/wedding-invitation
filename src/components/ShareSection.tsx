import { weddingConfig } from '../config/wedding';
import { useKakaoShare } from '../hooks/useKakaoShare';
import { assetPath } from '../lib/assets';

type ShareSectionProps = {
  showToast: (message: string) => void;
};

export function ShareSection({ showToast }: ShareSectionProps) {
  const shareToKakao = useKakaoShare(showToast);

  return (
    <section className="share-section">
      <div className="share-button-container">
        <button type="button" className="share-kakao-button" onClick={shareToKakao}>
          <img src={assetPath(weddingConfig.assets.kakaotalkIcon)} alt="카카오톡" />
          <span>{weddingConfig.content.buttons.kakaoShare}</span>
        </button>
      </div>
    </section>
  );
}
