export type AccountGroup = 'groom' | 'bride';

export type Account = {
  name: string;
  bank: string;
  number: string;
  copyable: boolean;
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
      copyUnavailableText: string;
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
    share: {
      kakaoShare: {
        title: string;
        description: string;
        buttonTitle: string;
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
  };
};

type AccountSeed = {
  name: string;
  bank: string;
  number: string;
};

function createAccount({ name, bank, number }: AccountSeed): Account {
  return {
    name,
    bank,
    number,
    copyable: true,
  };
}

// 실제 배포에서는 아래 env 변수를 채워서 이 청첩장의 이름/날짜/장소/계좌를 지정합니다.
// 값이 비어 있으면 저장소에는 커밋되지 않는, 명백한 데모용 예시 데이터가 표시됩니다.
// 전체 목록과 설명은 .env.example을 참고하세요.
const rawEnv = import.meta.env as unknown as Record<string, string | undefined>;

function env(key: string, fallback: string): string {
  const value = rawEnv[key];
  return value && value.trim().length > 0 ? value : fallback;
}

const DAY_OF_WEEK_KR = ['일', '월', '화', '수', '목', '금', '토'];

function deriveDayOfWeek(year: number, month: number, day: number): string {
  return DAY_OF_WEEK_KR[new Date(year, month - 1, day).getDay()];
}

function deriveDisplayTime(time: string): string {
  const [hourStr, minuteStr] = time.split(':');
  const hour = Number(hourStr);
  const minute = Number(minuteStr ?? '0');
  const period = hour < 12 ? '오전' : '오후';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  const minutePart = minute > 0 ? ` ${minute}분` : '';
  return `${period} ${hour12}시${minutePart}`;
}

const groomNameKr = env('VITE_GROOM_NAME_KR', '김민준');
const groomNameEn = env('VITE_GROOM_NAME_EN', 'Minjun');
const groomDisplayName = env('VITE_GROOM_DISPLAY_NAME', '민준');
const groomBirthOrder = env('VITE_GROOM_BIRTH_ORDER', '장남');
const groomFatherName = env('VITE_GROOM_FATHER_NAME', '김철수');
const groomMotherName = env('VITE_GROOM_MOTHER_NAME', '이영희');

const brideNameKr = env('VITE_BRIDE_NAME_KR', '이서연');
const brideNameEn = env('VITE_BRIDE_NAME_EN', 'Seoyeon');
const brideDisplayName = env('VITE_BRIDE_DISPLAY_NAME', '서연');
const brideBirthOrder = env('VITE_BRIDE_BIRTH_ORDER', '장녀');
const brideFatherName = env('VITE_BRIDE_FATHER_NAME', '박정훈');
const brideMotherName = env('VITE_BRIDE_MOTHER_NAME', '최수진');

const weddingDateRaw = env('VITE_WEDDING_DATE', '2030-05-17');
const [weddingYearStr, weddingMonthStr, weddingDayStr] = weddingDateRaw.split('-');
const weddingYear = Number(weddingYearStr);
const weddingMonth = Number(weddingMonthStr);
const weddingDay = Number(weddingDayStr);
const weddingTime = env('VITE_WEDDING_TIME', '14:00');
const weddingDayOfWeek = deriveDayOfWeek(weddingYear, weddingMonth, weddingDay);
const weddingDisplayTime = deriveDisplayTime(weddingTime);
const weddingIsoFormat = `${weddingDateRaw}T${weddingTime}:00`;

const venueName = env('VITE_VENUE_NAME', '서울 그랜드 웨딩홀');
const venueAddress = env('VITE_VENUE_ADDRESS', venueName);
const venueFullAddress = env('VITE_VENUE_FULL_ADDRESS', venueAddress);
const encodedVenueName = encodeURIComponent(venueName);

const letterContent = env(
  'VITE_LETTER_CONTENT',
  '서로를 만나 함께한 시간,<br>이제 하나의 인연으로 이어갑니다.<br><br>가장 소중한 날, 곁에서 축복해 주시면<br>더없이 큰 기쁨이 되겠습니다.<br><br>믿음과 사랑으로 하나 된 시작을<br>함께 축복해 주세요.'
);

const pageTitle = env('VITE_PAGE_TITLE', `${groomNameKr} ♥ ${brideNameKr}의 결혼식에 초대합니다`);
const metaTitle = env('VITE_META_TITLE', `${groomDisplayName} ♥ ${brideDisplayName}의 결혼식`);
const metaDescription = env(
  'VITE_META_DESCRIPTION',
  `${weddingYear}년 ${String(weddingMonth).padStart(2, '0')}월 ${String(weddingDay).padStart(
    2,
    '0'
  )}일 (${weddingDayOfWeek}) ${weddingDisplayTime}, ${venueName}에서 진행됩니다`
);
const metaImage = env('VITE_META_IMAGE', '/static/assets/images/og-image.webp');

export const weddingConfig: WeddingConfig = {
  wedding: {
    groom: {
      nameKr: groomNameKr,
      nameEn: groomNameEn,
      displayName: groomDisplayName,
      birthOrder: groomBirthOrder,
      parents: { father: groomFatherName, mother: groomMotherName },
    },
    bride: {
      nameKr: brideNameKr,
      nameEn: brideNameEn,
      displayName: brideDisplayName,
      birthOrder: brideBirthOrder,
      parents: { father: brideFatherName, mother: brideMotherName },
    },
    date: {
      year: weddingYear,
      month: weddingMonth,
      day: weddingDay,
      time: weddingTime,
      dayOfWeek: weddingDayOfWeek,
      displayTime: weddingDisplayTime,
      isoFormat: weddingIsoFormat,
    },
    venue: {
      name: venueName,
      address: venueAddress,
      fullAddress: venueFullAddress,
    },
  },
  accounts: {
    groom: [
      createAccount({
        name: groomFatherName,
        bank: env('VITE_ACCOUNT_GROOM_FATHER_BANK', '카카오뱅크'),
        number: env('VITE_ACCOUNT_GROOM_FATHER_NUMBER', '3333-00-0000001'),
      }),
      createAccount({
        name: groomMotherName,
        bank: env('VITE_ACCOUNT_GROOM_MOTHER_BANK', '우리은행'),
        number: env('VITE_ACCOUNT_GROOM_MOTHER_NUMBER', '1002-000-000002'),
      }),
      createAccount({
        name: groomNameKr,
        bank: env('VITE_ACCOUNT_GROOM_BANK', '카카오뱅크'),
        number: env('VITE_ACCOUNT_GROOM_NUMBER', '3333-00-0000003'),
      }),
    ],
    bride: [
      createAccount({
        name: brideFatherName,
        bank: env('VITE_ACCOUNT_BRIDE_FATHER_BANK', '우리은행'),
        number: env('VITE_ACCOUNT_BRIDE_FATHER_NUMBER', '1002-000-000004'),
      }),
      createAccount({
        name: brideMotherName,
        bank: env('VITE_ACCOUNT_BRIDE_MOTHER_BANK', '국민은행'),
        number: env('VITE_ACCOUNT_BRIDE_MOTHER_NUMBER', '232-0000-0000005'),
      }),
      createAccount({
        name: brideNameKr,
        bank: env('VITE_ACCOUNT_BRIDE_BANK', '카카오뱅크'),
        number: env('VITE_ACCOUNT_BRIDE_NUMBER', '3333-00-0000006'),
      }),
    ],
  },
  content: {
    pageTitle,
    meta: {
      title: metaTitle,
      description: metaDescription,
      image: metaImage,
    },
    countdown: {
      labels: { days: 'DAYS', hour: 'HOUR', min: 'MIN', sec: 'SEC' },
      message: `${groomDisplayName} ♥ ${brideDisplayName}의 결혼식이 {days}일 남았습니다`,
    },
    buttons: {
      googleCalendar: 'Google Calendar에 추가',
      kakaoShare: '카카오톡으로 초대장 보내기',
    },
    letter: {
      title: '두 사람의 결혼식에 초대합니다.',
      header: 'I N V I T A T I O N',
      content: letterContent,
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
      copyUnavailableText: '비공개',
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
    share: {
      kakaoShare: {
        title: `💒 ${groomDisplayName} ♥ ${brideDisplayName}의 결혼식`,
        description: `${weddingYear}년 ${String(weddingMonth).padStart(2, '0')}월 ${String(
          weddingDay
        ).padStart(
          2,
          '0'
        )}일 (${weddingDayOfWeek}) ${weddingDisplayTime}\n${venueName}에서 진행됩니다.\n\n소중한 분을 모시고 참석해주시면 감사하겠습니다.`,
        buttonTitle: '청첩장 보기',
      },
    },
    bgm: { notification: '배경음악이 준비되었습니다' },
  },
  externalLinks: {
    maps: {
      naver: `https://map.naver.com/v5/search/${encodedVenueName}`,
      kakao: `https://map.kakao.com/?q=${encodedVenueName}`,
      tmap: `https://www.google.com/maps/search/?api=1&query=${encodedVenueName}`,
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
  },
};
