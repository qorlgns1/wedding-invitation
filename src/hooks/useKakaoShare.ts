import { useCallback, useEffect } from 'react';
import { weddingConfig } from '../config/wedding';

export function useKakaoShare(showToast: (message: string) => void) {
  const appKey = import.meta.env.VITE_KAKAO_APP_KEY || '';

  useEffect(() => {
    if (!appKey || window.Kakao) return;

    const script = document.createElement('script');
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';
    script.integrity = 'sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4';
    script.crossOrigin = 'anonymous';
    script.defer = true;
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(appKey);
      }
    };
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [appKey]);

  return useCallback(() => {
    if (!appKey) {
      showToast('카카오톡 공유 설정이 필요합니다.');
      return;
    }

    if (!window.Kakao) {
      showToast('카카오톡 공유 기능을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    try {
      const shareConfig = weddingConfig.content.share.kakaoShare;
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: shareConfig.title,
          description: shareConfig.description,
          imageUrl: weddingConfig.content.meta.image,
          link: { mobileWebUrl: 'https://qorlgns1.github.io/wedding-invitation/', webUrl: 'https://qorlgns1.github.io/wedding-invitation/' },
        },
        buttons: [
          {
            title: shareConfig.buttonTitle,
            link: { mobileWebUrl: 'https://qorlgns1.github.io/wedding-invitation/', webUrl: 'https://qorlgns1.github.io/wedding-invitation/' },
          },
        ],
        installTalk: true,
      });
    } catch {
      showToast('카카오톡 공유에 실패했습니다. 다시 시도해주세요.');
    }
  }, [appKey, showToast]);
}
