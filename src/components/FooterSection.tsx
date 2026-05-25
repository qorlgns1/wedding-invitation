import { weddingConfig } from '../config/wedding';
import { formatDottedWeddingDate } from '../lib/date';

export function FooterSection() {
  const { wedding } = weddingConfig;

  return (
    <footer className="mx-auto max-w-[var(--content-max-width)] border-[rgba(185,148,147,0.2)] bg-[linear-gradient(to_bottom,#FFFFFF_0%,#F5F0F0_100%)] px-6 pb-6 pt-8 text-center max-[768px]:px-4 max-[768px]:pb-4 max-[768px]:pt-6 max-[480px]:px-[0.8em] max-[480px]:pb-[0.8em] max-[480px]:pt-[1.2em]">
      <div className="mx-auto flex max-w-[var(--content-max-width)] flex-col items-center gap-[0.8em]">
        <div className="mb-[0.2em]">
          <span className="font-sacramento text-[1.4rem] tracking-[0.05em] text-wedding-primary max-[768px]:text-[1.2rem] max-[480px]:text-[1.1rem]">
            {wedding.groom.nameEn} & {wedding.bride.nameEn}
          </span>
        </div>
        <div className="font-kr text-[0.9em] font-medium tracking-[0.1em] text-wedding-muted max-[768px]:text-[0.85em] max-[480px]:text-[0.8em]">
          {formatDottedWeddingDate(wedding.date, true)}
        </div>
        <div className="my-2 h-[1.5px] w-[45px] bg-[linear-gradient(to_right,transparent,var(--primary-color),transparent)] max-[768px]:w-10" />
      </div>
    </footer>
  );
}
