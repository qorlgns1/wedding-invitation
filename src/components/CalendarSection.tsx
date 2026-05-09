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

  return (
    <section className="calendar">
      <img
        className="calendar-deco"
        src={assetPath(weddingConfig.assets.calendarImage)}
        alt="calendar deco"
        loading="lazy"
      />
      <div className="d-day-display">
        <table className="countdown-table">
          <tbody>
            <tr className="countdown-labels">
              <td>{countdownContent.labels.days}</td>
              <td className="separator-cell" />
              <td>{countdownContent.labels.hour}</td>
              <td className="separator-cell" />
              <td>{countdownContent.labels.min}</td>
              <td className="separator-cell" />
              <td>{countdownContent.labels.sec}</td>
            </tr>
            <tr className="countdown-values">
              <td>{countdown.days}</td>
              <td className="countdown-separator">:</td>
              <td>{countdown.hours}</td>
              <td className="countdown-separator">:</td>
              <td>{countdown.minutes}</td>
              <td className="countdown-separator">:</td>
              <td>{countdown.seconds}</td>
            </tr>
          </tbody>
        </table>
        <p className="countdown-message">
          {messagePrefix}
          <span>{countdown.days}일</span>
          {normalizedMessageSuffix}
        </p>
      </div>
      <div className="calendar-buttons">
        <button
          type="button"
          className="calendar-btn google-calendar"
          onClick={() => window.open(createGoogleCalendarUrl(weddingConfig), '_blank')}
        >
          <Plus aria-hidden="true" />
          {weddingConfig.content.buttons.googleCalendar}
        </button>
      </div>
    </section>
  );
}
