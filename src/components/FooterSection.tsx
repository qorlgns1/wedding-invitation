import { Users } from 'lucide-react';
import { weddingConfig } from '../config/wedding';
import { formatDottedWeddingDate } from '../lib/date';

export function FooterSection() {
  const { wedding } = weddingConfig;

  return (
    <footer className="footer-section">
      <div className="footer-content">
        <div className="visitor-stats">
          <span className="stat-item">
            <Users aria-hidden="true" />
            {weddingConfig.content.footer.visitorStats.today} <strong>-</strong>
          </span>
          <span className="stat-divider">|</span>
          <span className="stat-item">
            {weddingConfig.content.footer.visitorStats.total} <strong>-</strong>
          </span>
        </div>
        <div className="footer-couple">
          <span className="footer-names en-sacramento">
            {wedding.groom.nameEn} & {wedding.bride.nameEn}
          </span>
        </div>
        <div className="footer-date kr">{formatDottedWeddingDate(wedding.date, true)}</div>
        <div className="footer-divider" />
      </div>
    </footer>
  );
}
