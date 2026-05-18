import { weddingConfig } from '../config/wedding';
import { assetPath } from '../lib/assets';
import { formatDottedWeddingDate } from '../lib/date';

export function LetterSection() {
  const { wedding, content, assets } = weddingConfig;

  return (
    <section
      className="mx-auto max-w-[var(--content-max-width)] bg-white px-14 pb-12 pt-[4.5em] max-[768px]:px-8 max-[768px]:py-12 max-[480px]:px-6"
      data-scroll-group="letter"
    >
      <div
        className="mb-[1.2em] flex flex-col items-center"
        data-scroll-animate="letter-header"
      >
        <img
          className="mb-[0.8em] w-[12em]"
          src={assetPath(assets.letterDeco)}
          alt="letter header deco"
          loading="lazy"
        />
        <h2 className="mb-[0.4em] font-kr text-[1.3rem] font-semibold tracking-[1px] text-wedding-primary">
          {formatDottedWeddingDate(wedding.date)}
        </h2>
        <p className="font-kr text-[1rem] font-medium text-wedding-primary">
          {content.letter.title}
        </p>
      </div>
      <h1 className="my-[0.3em] mb-[0.5em] text-center font-spectral text-[2rem] font-normal tracking-[2px] text-[#6F6F6F] max-[768px]:text-[1.6rem]">
        {content.letter.header}
      </h1>
      <div>
        <p
          className="text-center font-kr text-[1rem] leading-[2.2em] text-wedding-text [word-break:keep-all]"
          data-scroll-animate="letter-body"
          dangerouslySetInnerHTML={{ __html: content.letter.content }}
        />
        <div
          className="mt-8 flex flex-col items-center justify-center gap-2 font-kr text-wedding-text"
          data-scroll-animate="letter-family"
        >
          <span className="mb-2 flex flex-row flex-wrap items-center justify-center gap-x-[0.2em] text-[1.1em]">
            {wedding.groom.parents.father}{' '}
            <span className="mx-[0.5em] flex items-center justify-center">•</span>{' '}
            {wedding.groom.parents.mother} 의 {wedding.groom.birthOrder}
            <span className="ml-[1em] text-[1.1em] font-bold text-wedding-primary">
              {wedding.groom.displayName}
            </span>
          </span>
          <span className="mb-2 flex flex-row flex-wrap items-center justify-center gap-x-[0.2em] text-[1.1em]">
            {wedding.bride.parents.father}{' '}
            <span className="mx-[0.5em] flex items-center justify-center">•</span>{' '}
            {wedding.bride.parents.mother} 의 {wedding.bride.birthOrder}
            <span className="ml-[1em] text-[1.1em] font-bold text-wedding-primary">
              {wedding.bride.displayName}
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
