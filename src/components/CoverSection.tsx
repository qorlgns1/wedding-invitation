import { weddingConfig } from '../config/wedding';
import { assetPath } from '../lib/assets';
import { formatKoreanWeddingDate } from '../lib/date';

export function CoverSection() {
  const { assets, wedding } = weddingConfig;

  return (
    <section
      className="relative mx-auto h-[900px] max-w-[var(--content-max-width)] overflow-hidden bg-cover bg-[center_top] bg-no-repeat max-[768px]:h-screen"
      style={{ backgroundImage: `url(${assetPath(assets.coverImage)})` }}
    >
      <div className="absolute bottom-[1.5em] w-full">
        <div className="flex w-full justify-center">
          <span className="block font-sacramento text-[2.2rem] text-white [word-spacing:5px] max-[768px]:text-[1.8rem]">
            {wedding.groom.nameEn} & {wedding.bride.nameEn}
          </span>
        </div>
        <div className="flex w-full flex-col items-center">
          <span className="mb-[0.4em] block font-kr text-[1rem] text-white">
            {formatKoreanWeddingDate(wedding.date)}
          </span>
          <span className="block font-kr text-[1rem] text-white">{wedding.venue.name}</span>
        </div>
      </div>
    </section>
  );
}
