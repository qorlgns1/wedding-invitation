import type { WeddingConfig } from '../config/wedding';

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function getCountdown(targetIso: string): Countdown {
  const targetDate = new Date(targetIso);
  const diff = targetDate.getTime() - Date.now();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

type WeddingDate = WeddingConfig['wedding']['date'];

export function formatKoreanWeddingDate(date: WeddingDate): string {
  return `${date.year}년 ${date.month}월 ${date.day}일 (${date.dayOfWeek}) ${date.displayTime}`;
}

export function formatDottedWeddingDate(date: WeddingDate, spaced = false): string {
  const month = String(date.month).padStart(2, '0');
  const day = String(date.day).padStart(2, '0');
  const separator = spaced ? '. ' : '.';

  return `${date.year}${separator}${month}${separator}${day}`;
}

export function createGoogleCalendarUrl(config: WeddingConfig): string {
  const { wedding } = config;
  const startDate = `${new Date(wedding.date.isoFormat)
    .toISOString()
    .replace(/[-:]/g, '')
    .split('.')[0]}Z`;
  const endDate = `${new Date(
    new Date(wedding.date.isoFormat).getTime() + 2 * 60 * 60 * 1000
  )
    .toISOString()
    .replace(/[-:]/g, '')
    .split('.')[0]}Z`;

  const title = encodeURIComponent(`${wedding.groom.nameKr} ♥ ${wedding.bride.nameKr} 결혼식`);
  const details = encodeURIComponent(
    `${wedding.groom.nameKr}과 ${wedding.bride.nameKr}의 결혼식에 초대합니다!\n\n📍 장소: ${wedding.venue.name}\n📍 주소: ${wedding.venue.address}\n⏰ 시간: ${wedding.date.displayTime}\n\n따뜻한 축복과 응원 부탁드립니다.`
  );
  const location = encodeURIComponent(`${wedding.venue.name}, ${wedding.venue.address}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}&sf=true&output=xml`;
}
