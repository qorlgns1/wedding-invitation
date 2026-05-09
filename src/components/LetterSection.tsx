import { weddingConfig } from '../config/wedding';
import { assetPath } from '../lib/assets';
import { formatDottedWeddingDate } from '../lib/date';

export function LetterSection() {
  const { wedding, content, assets } = weddingConfig;

  return (
    <section className="letter">
      <div className="header">
        <img
          className="header-deco"
          src={assetPath(assets.letterDeco)}
          alt="letter header deco"
          loading="lazy"
        />
        <h2 className="title kr">{formatDottedWeddingDate(wedding.date)}</h2>
        <p className="sub-title kr">{content.letter.title}</p>
      </div>
      <h1 className="invitation-header">{content.letter.header}</h1>
      <div className="letter-container">
        <p
          className="letter kr"
          dangerouslySetInnerHTML={{ __html: content.letter.content }}
        />
        <div className="family-description kr">
          <span className="groom-line">
            {wedding.groom.parents.father} <span className="name-divider">•</span>{' '}
            {wedding.groom.parents.mother} 의 {wedding.groom.birthOrder}
            <span className="groom-name">{wedding.groom.displayName}</span>
          </span>
          <span className="bride-line">
            {wedding.bride.parents.father} <span className="name-divider">•</span>{' '}
            {wedding.bride.parents.mother} 의 {wedding.bride.birthOrder}
            <span className="bride-name">{wedding.bride.displayName}</span>
          </span>
        </div>
      </div>
    </section>
  );
}
