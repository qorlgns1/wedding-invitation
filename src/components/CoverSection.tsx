import { weddingConfig } from '../config/wedding';
import { formatKoreanWeddingDate } from '../lib/date';

export function CoverSection() {
  const { wedding } = weddingConfig;

  return (
    <section className="cover">
      <div className="white-gradient-blur" />
      <div className="blur-gradient" />
      <div className="cover-title-container">
        <div className="names-en-box">
          <span className="names en-sacramento">
            {wedding.groom.nameEn} & {wedding.bride.nameEn}
          </span>
        </div>
        <div className="event-date-and-place-box">
          <span className="event-date-and-time kr">
            {formatKoreanWeddingDate(wedding.date)}
          </span>
          <span className="event-place kr">{wedding.venue.name}</span>
        </div>
      </div>
    </section>
  );
}
