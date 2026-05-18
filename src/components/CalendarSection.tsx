import { Plus } from 'lucide-react';
import { weddingConfig } from '../config/wedding';
import { useCountdown } from '../hooks/useCountdown';
import { assetPath } from '../lib/assets';
import { createGoogleCalendarUrl } from '../lib/date';

export function CalendarSection() {
  const countdown = useCountdown(weddingConfig.wedding.date.isoFormat);
  const { countdown: countdownContent } = weddingConfig.content;
  const [messagePrefix, messageSuffix = ''] = countdownContent.message.split('{days}');
  const normalizedMessageSuffix = messageSuffix.startsWith('일')
    ? messageSuffix.slice(1)
    : messageSuffix;
  const labelCellClass =
    'border-0 px-[0.8em] pb-[0.3em] pt-[0.2em] text-center align-middle font-kr text-[0.85em] font-medium tracking-[1px] text-[#A7A4A4] max-[768px]:px-[0.4em] max-[768px]:text-[0.7em] max-[400px]:px-[0.25em] max-[400px]:text-[0.65em] max-[400px]:tracking-[0.5px] max-[320px]:text-[0.6em]';
  const valueCellClass =
    'border-0 px-[0.8em] py-[0.2em] text-center align-middle font-kr text-[2em] font-semibold text-[#5B5555] max-[768px]:px-[0.4em] max-[768px]:text-[1.5em] max-[400px]:px-[0.25em] max-[400px]:text-[1.3em] max-[320px]:text-[1.1em]';
  const emptySeparatorCellClass =
    'border-0 px-[0.3em] py-[0.2em] text-center align-middle max-[768px]:px-[0.15em] max-[400px]:px-[0.1em]';
  const separatorCellClass =
    'border-0 px-[0.3em] py-[0.2em] text-center align-middle font-kr text-[1.5em] font-normal text-[#5B5555] max-[768px]:px-[0.15em] max-[768px]:text-[1.2em] max-[400px]:px-[0.1em] max-[400px]:text-[1em] max-[320px]:text-[0.9em]';

  return (
    <section className="mx-auto max-w-[var(--content-max-width)] bg-white px-[1.2em] py-8 text-center max-[768px]:px-4 max-[768px]:py-6">
      <img
        className="mb-6 block w-full"
        src={assetPath(weddingConfig.assets.calendarImage)}
        alt="calendar deco"
        loading="lazy"
      />
      <div
        className="mb-8 text-center font-kr text-[0.95em] leading-[1.6] text-black max-[768px]:text-[0.85em]"
        data-scroll-animate="calendar-countdown"
      >
        <table className="mx-auto mb-4 border-collapse border-0">
          <tbody>
            <tr>
              <td className={labelCellClass}>{countdownContent.labels.days}</td>
              <td className={emptySeparatorCellClass} />
              <td className={labelCellClass}>{countdownContent.labels.hour}</td>
              <td className={emptySeparatorCellClass} />
              <td className={labelCellClass}>{countdownContent.labels.min}</td>
              <td className={emptySeparatorCellClass} />
              <td className={labelCellClass}>{countdownContent.labels.sec}</td>
            </tr>
            <tr>
              <td className={valueCellClass}>{countdown.days}</td>
              <td className={separatorCellClass}>:</td>
              <td className={valueCellClass}>{countdown.hours}</td>
              <td className={separatorCellClass}>:</td>
              <td className={valueCellClass}>{countdown.minutes}</td>
              <td className={separatorCellClass}>:</td>
              <td className={valueCellClass}>{countdown.seconds}</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-4 font-kr text-[0.9em] text-black max-[768px]:text-[0.9em]">
          {messagePrefix}
          <span className="font-semibold text-[#A7A4A4]">{countdown.days}일</span>
          {normalizedMessageSuffix}
        </p>
      </div>
      <div
        className="flex w-full flex-col items-center justify-center gap-4"
        data-scroll-animate="calendar-buttons"
      >
        <button
          type="button"
          className="flex w-[260px] items-center justify-center gap-2 whitespace-nowrap rounded-[25px] bg-[linear-gradient(135deg,#4285f4,#34a853)] px-10 py-4 font-kr text-[1em] font-medium text-white shadow-[0_4px_15px_rgba(66,133,244,0.3)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(66,133,244,0.4)] max-[768px]:w-60 max-[768px]:px-[2.2em] max-[768px]:py-[0.9em] max-[768px]:text-[0.95em]"
          onClick={() => window.open(createGoogleCalendarUrl(weddingConfig), '_blank')}
        >
          <Plus className="h-[1em] w-[1em]" aria-hidden="true" />
          {weddingConfig.content.buttons.googleCalendar}
        </button>
      </div>
    </section>
  );
}
