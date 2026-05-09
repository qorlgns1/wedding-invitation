import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { type AccountGroup, weddingConfig } from '../config/wedding';
import { copyText } from '../lib/clipboard';

type AccountSectionProps = {
  showAccountToast: (message: string) => void;
};

export function AccountSection({ showAccountToast }: AccountSectionProps) {
  const [expanded, setExpanded] = useState<Record<AccountGroup, boolean>>({
    groom: false,
    bride: false,
  });
  const accountConfig = weddingConfig.content.accountSection;

  const toggle = (type: AccountGroup) => {
    setExpanded((current) => ({ ...current, [type]: !current[type] }));
  };

  const handleCopy = async (number: string) => {
    try {
      await copyText(number);
      showAccountToast(accountConfig.copySuccessMessage);
    } catch {
      showAccountToast(accountConfig.copyErrorMessage);
    }
  };

  const renderGroup = (type: AccountGroup, label: string) => (
    <div className={`account-accordion-item${expanded[type] ? ' active' : ''}`}>
      <button
        type="button"
        className="account-accordion-button"
        onClick={() => toggle(type)}
      >
        <span>{label}</span>
        <ChevronDown className="accordion-icon" aria-hidden="true" />
      </button>
      <div
        className="account-accordion-content"
        style={{ maxHeight: expanded[type] ? '1000px' : undefined }}
      >
        {weddingConfig.accounts[type].map((account) => (
          <div className="account-card" key={`${type}-${account.name}-${account.number}`}>
            <div className="account-card-name">{account.name}</div>
            <div className="account-card-info">
              <div className="account-card-bank-row">
                <div className="account-card-bank-info">
                  <div className="account-card-bank-name">{account.bank}</div>
                  <div className="account-card-number">{account.number}</div>
                </div>
                <button
                  type="button"
                  className="account-card-copy-button"
                  onClick={() => void handleCopy(account.number)}
                >
                  {accountConfig.copyButtonText}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="account-trapezoid">
      <p className="snap-subtitle-en">{accountConfig.subtitleEn}</p>
      <h2 className="account-title">{accountConfig.title}</h2>
      <div className="account-accordion-container">
        {renderGroup('groom', accountConfig.groomButton)}
        {renderGroup('bride', accountConfig.brideButton)}
      </div>
    </section>
  );
}
