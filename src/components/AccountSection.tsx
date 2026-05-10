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
    <div
      className={`w-full overflow-hidden rounded-xl border bg-white/80 shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-300 ease-in-out hover:border-[rgba(185,148,147,0.4)] hover:shadow-[0_4px_16px_rgba(185,148,147,0.15)] ${
        expanded[type]
          ? 'border-wedding-primary bg-white shadow-[0_4px_20px_rgba(185,148,147,0.2)]'
          : 'border-[rgba(185,148,147,0.2)]'
      }`}
    >
      <button
        type="button"
        className={`relative flex w-full items-center justify-between overflow-hidden px-[1.5em] py-[1.2em] text-left font-kr text-[1.1em] font-semibold text-wedding-text transition-all duration-300 ease-in-out before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-[linear-gradient(90deg,var(--primary-color),transparent)] before:transition-[width] before:duration-300 hover:bg-[rgba(185,148,147,0.05)] hover:before:w-1 max-[768px]:px-[1.2em] max-[768px]:py-[1em] max-[768px]:text-[1em] max-[480px]:px-[1em] max-[480px]:py-[0.9em] max-[480px]:text-[0.95em] ${
          expanded[type] ? 'border-b border-[rgba(185,148,147,0.1)]' : ''
        }`}
        onClick={() => toggle(type)}
      >
        <span>{label}</span>
        <ChevronDown
          className={`h-6 w-6 shrink-0 text-wedding-primary transition-transform duration-300 ease-in-out max-[768px]:h-5 max-[768px]:w-5 ${
            expanded[type] ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>
      <div
        className="flex max-h-0 w-full flex-col overflow-hidden bg-[rgba(185,148,147,0.02)] transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight: expanded[type] ? '1000px' : undefined }}
      >
        {weddingConfig.accounts[type].map((account) => (
          <div
            className="flex w-full flex-col items-center gap-4 border-b border-[rgba(185,148,147,0.1)] bg-transparent p-6 last:border-b-0 max-[768px]:p-[1.2em] max-[480px]:p-4"
            key={`${type}-${account.name}-${account.number}`}
          >
            <div className="mb-2 text-center font-kr text-[1.4em] font-bold text-wedding-primary max-[768px]:text-[1.2em] max-[480px]:text-[1.1em]">
              {account.name}
            </div>
            <div className="flex w-full flex-col gap-[0.8em]">
              <div className="flex w-full items-center justify-between gap-[0.8em] rounded-xl bg-[#f8f9fa] p-4 max-[480px]:flex-col max-[480px]:items-stretch max-[480px]:gap-[0.6em]">
                <div className="min-w-0 flex-1">
                  <div className="mb-[0.3em] font-kr text-[0.85em] text-[#666] max-[768px]:text-[0.8em]">
                    {account.bank}
                  </div>
                  <div className="break-all font-mono text-[0.9em] font-semibold text-[#333] max-[768px]:text-[0.85em]">
                    {account.number}
                  </div>
                </div>
                <button
                  type="button"
                  className="flex shrink-0 items-center justify-center gap-[0.4em] rounded-lg border border-[rgba(185,148,147,0.3)] bg-white px-4 py-[0.6em] font-kr text-[0.85em] font-semibold text-wedding-primary transition-all duration-300 ease-in-out hover:scale-[1.02] hover:border-wedding-primary hover:bg-[rgba(185,148,147,0.1)] max-[768px]:px-[0.8em] max-[768px]:py-[0.5em] max-[768px]:text-[0.8em] max-[480px]:w-full"
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
    <section className="mx-auto flex max-w-[var(--content-max-width)] flex-col items-center bg-white px-8 py-16 max-[768px]:px-6 max-[768px]:py-12 max-[480px]:px-4 max-[480px]:py-8">
      <p className="mb-2 text-center font-sriracha text-[0.9em] tracking-[1px] text-[#999] max-[768px]:text-[0.85em] max-[480px]:text-[0.8em]">
        {accountConfig.subtitleEn}
      </p>
      <h2
        className="mb-8 text-center font-kr text-[1.3rem] font-semibold tracking-[1px] text-wedding-primary max-[768px]:mb-6 max-[768px]:text-[1.2rem] max-[480px]:text-[1.1rem]"
        data-scroll-animate="account-title"
      >
        {accountConfig.title}
      </h2>
      <div
        className="flex w-full max-w-[var(--content-max-width)] flex-col gap-4"
        data-scroll-animate="account-list"
      >
        {renderGroup('groom', accountConfig.groomButton)}
        {renderGroup('bride', accountConfig.brideButton)}
      </div>
    </section>
  );
}
