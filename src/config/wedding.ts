export type AccountGroup = 'groom' | 'bride';

export type Account = {
  name: string;
  bank: string;
  number: string;
};

export type WeddingConfig = {
  wedding: {
    groom: {
      nameKr: string;
      nameEn: string;
      displayName: string;
      birthOrder: string;
      parents: { father: string; mother: string };
    };
    bride: {
      nameKr: string;
      nameEn: string;
      displayName: string;
      birthOrder: string;
      parents: { father: string; mother: string };
    };
    date: {
      year: number;
      month: number;
      day: number;
      time: string;
      dayOfWeek: string;
      displayTime: string;
      isoFormat: string;
    };
    venue: {
      name: string;
      address: string;
      fullAddress: string;
    };
  };
  accounts: Record<AccountGroup, Account[]>;
  content: {
    pageTitle: string;
    meta: {
      title: string;
      description: string;
      image: string;
    };
    countdown: {
      labels: {
        days: string;
        hour: string;
        min: string;
        sec: string;
      };
      message: string;
    };
    buttons: {
      googleCalendar: string;
      photoUpload: string;
      kakaoShare: string;
    };
    letter: {
      title: string;
      header: string;
      content: string;
    };
    gallery: {
      title: string;
      subtitleEn: string;
    };
    accountSection: {
      subtitleEn: string;
      title: string;
      groomButton: string;
      brideButton: string;
      copyButtonText: string;
      copySuccessMessage: string;
      copyErrorMessage: string;
    };
    location: {
      subtitleEn: string;
      title: string;
      mapClickHint: string;
      mapLightboxInfo: string;
      mapButtons: {
        naver: string;
        kakao: string;
        tmap: string;
      };
    };
    snaps: {
      subtitleEn: string;
      title: string;
      description: string[];
      uploadButton: string;
      uploadModal: {
        title: string;
        preparing: string;
        closeButton: string;
      };
    };
    share: {
      kakaoShare: {
        title: string;
        description: string;
        buttonTitle: string;
      };
    };
    footer: {
      visitorStats: {
        today: string;
        total: string;
      };
    };
    bgm: {
      notification: string;
    };
  };
  externalLinks: {
    maps: {
      naver: string;
      kakao: string;
      tmap: string;
    };
  };
  assets: {
    backgroundMusic: string;
    coverImage: string;
    galleryPath: string;
    mapImage: string;
    kakaotalkIcon: string;
    letterDeco: string;
    calendarImage: string;
    introImage: string;
    introFont: string;
    varaScript: string;
  };
};

export const weddingConfig: WeddingConfig = {
  wedding: {
    groom: {
      nameKr: '배기훈',
      nameEn: 'Kihoon',
      displayName: '기훈',
      birthOrder: '장남',
      parents: { father: '배갑천', mother: '이선미' },
    },
    bride: {
      nameKr: '김슬비',
      nameEn: 'Seulbi',
      displayName: '슬비',
      birthOrder: '장녀',
      parents: { father: '김종선', mother: '박선영' },
    },
    date: {
      year: 2026,
      month: 8,
      day: 8,
      time: '14:00',
      dayOfWeek: '토',
      displayTime: '오후 2시',
      isoFormat: '2026-08-08T14:00:00',
    },
    venue: {
      name: '합정 웨딩시그니처 4F 아너스홀',
      address: '합정 웨딩시그니처 4F 아너스홀',
      fullAddress: '합정 웨딩시그니처 4F 아너스홀',
    },
  },
  accounts: {
    groom: [
      {
        name: '배갑천',
        bank: '카카오뱅크 (예금주: 배기훈)',
        number: '3333-13-8324048',
      },
      {
        name: '이선미',
        bank: '우리은행 (예금주: 배기훈)',
        number: '1002-034-705535',
      },
      {
        name: '배기훈',
        bank: '카카오뱅크',
        number: '3333-01-8224159',
      },
    ],
    bride: [
      { name: '김종선', bank: '우리은행', number: '1002-548-949182' },
      { name: '박선영', bank: 'SC제일은행', number: '64720475914' },
      { name: '김슬비', bank: '카카오뱅크', number: '3333-20-7595186' },
    ],
  },
  content: {
    pageTitle: '배기훈 ♥ 김슬비의 결혼식에 초대합니다',
    meta: {
      title: '기훈 ♥ 슬비의 결혼식',
      description:
        '2026년 08월 08일 (토) 오후 2시, 합정 웨딩시그니처 4F 아너스홀에서 진행됩니다',
      image:
        'https://qorlgns1.github.io/wedding-invitation/static/assets/images/og-image.webp',
    },
    countdown: {
      labels: { days: 'DAYS', hour: 'HOUR', min: 'MIN', sec: 'SEC' },
      message: '기훈 ♥ 슬비의 결혼식이 {days}일 남았습니다',
    },
    buttons: {
      googleCalendar: 'Google Calendar에 추가',
      photoUpload: '사진 업로드',
      kakaoShare: '카카오톡으로 초대장 보내기',
    },
    letter: {
      title: '두 사람의 결혼식에 초대합니다.',
      header: 'I N V I T A T I O N',
      content:
        '8년의 시간,<br>그리고 또 하나의 8이 겹치는 날.<br><br>지구 반대편에서 운명처럼 만나<br>2026년 8월 8일, 사랑의 무한대(∞)를 약속합니다.<br><br>지금처럼, 앞으로도<br>서로의 가장 큰 행복으로 함께하겠습니다.',
    },
    gallery: {
      title: '웨딩 갤러리',
      subtitleEn: 'GALLERY',
    },
    accountSection: {
      subtitleEn: 'ACCOUNT',
      title: '마음 전하기',
      groomButton: '신랑 측 계좌번호',
      brideButton: '신부 측 계좌번호',
      copyButtonText: '복사하기',
      copySuccessMessage: '계좌번호가 복사되었습니다! 💰',
      copyErrorMessage: '복사에 실패했습니다. 다시 시도해주세요.',
    },
    location: {
      subtitleEn: 'INFORMATION',
      title: '예식정보 및 안내 사항',
      mapClickHint: '클릭하면 크게 볼 수 있습니다',
      mapLightboxInfo: '찾아오는 길',
      mapButtons: { naver: '네이버맵', kakao: '카카오맵', tmap: '티맵' },
    },
    snaps: {
      subtitleEn: 'CAPTURE OUR MOMENTS',
      title: 'Snaps',
      description: [
        '신랑신부의 행복한 순간을 담아주세요.',
        '예식 당일, 아래 버튼을 통해 사진을 올려주세요.',
        '많은 참여 부탁드려요!',
      ],
      uploadButton: '사진 업로드',
      uploadModal: {
        title: '사진 업로드 중...',
        preparing: '업로드 준비 중...',
        closeButton: '확인',
      },
    },
    share: {
      kakaoShare: {
        title: '💒 기훈 ♥ 슬비의 결혼식',
        description:
          '2026년 08월 08일 (토) 오후 2시\n합정 웨딩시그니처 4F 아너스홀에서 진행됩니다.\n\n소중한 분을 모시고 참석해주시면 감사하겠습니다.',
        buttonTitle: '청첩장 보기',
      },
    },
    footer: { visitorStats: { today: 'TODAY', total: 'TOTAL' } },
    bgm: { notification: '배경음악이 준비되었습니다' },
  },
  externalLinks: {
    maps: {
      naver:
        'https://map.naver.com/v5/search/%ED%95%A9%EC%A0%95%20%EC%9B%A8%EB%94%A9%EC%8B%9C%EA%B7%B8%EB%8B%88%EC%B2%98',
      kakao:
        'https://map.kakao.com/?q=%ED%95%A9%EC%A0%95%20%EC%9B%A8%EB%94%A9%EC%8B%9C%EA%B7%B8%EB%8B%88%EC%B2%98',
      tmap:
        'https://www.google.com/maps/search/?api=1&query=%ED%95%A9%EC%A0%95%20%EC%9B%A8%EB%94%A9%EC%8B%9C%EA%B7%B8%EB%8B%88%EC%B2%98',
    },
  },
  assets: {
    backgroundMusic: '/static/assets/audio/wedding-music.mp3',
    coverImage: '/static/assets/images/cover.webp',
    galleryPath: '/static/assets/images/wedding-snaps/',
    mapImage: '/static/assets/images/wedding-signature.webp',
    kakaotalkIcon: '/static/assets/images/kakaotalk.webp',
    letterDeco: '/static/assets/images/letter-deco.svg',
    calendarImage: '/static/assets/images/calendar.webp',
    introImage: '/static/assets/images/animation1.webp',
    introFont: '/static/assets/fonts/json/Parisienne.json',
    varaScript: '/static/js/vara.min.js',
  },
};
