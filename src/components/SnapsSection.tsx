import { type CSSProperties, useState } from 'react';
import {
  PHOTO_UPLOAD_ENABLED,
  UPLOAD_START_NOTICE,
  UPLOAD_START_TIME_KST,
  UPLOAD_START_TOAST,
} from '../config/features';
import { weddingConfig } from '../config/wedding';

type SnapsSectionProps = {
  showToast: (message: string) => void;
};

export function SnapsSection({ showToast }: SnapsSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const isUploadAllowed = Date.now() >= UPLOAD_START_TIME_KST.getTime();
  const uploadDisabled = !isUploadAllowed;
  const noticeStyle: CSSProperties = {
    marginTop: '12px',
    fontSize: '14px',
    color: '#888',
    textAlign: 'center',
    display: uploadDisabled ? 'block' : 'none',
  };

  const openUpload = () => {
    if (!PHOTO_UPLOAD_ENABLED) {
      showToast('사진 업로드 기능은 현재 비활성화되어 있습니다.');
      return;
    }

    if (!isUploadAllowed) {
      showToast(UPLOAD_START_TOAST);
      return;
    }

    setModalOpen(true);
  };

  return (
    <>
      <section className="snaps-section">
        <div className="header">
          <p className="snap-subtitle-en">{weddingConfig.content.snaps.subtitleEn}</p>
          <h2 className="title kr">{weddingConfig.content.snaps.title}</h2>
          <div className="snap-description">
            {weddingConfig.content.snaps.description.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
        <div className="snap-upload-container">
          <input
            type="file"
            id="snap-upload-input"
            accept="image/*,video/*"
            multiple
            style={{ display: 'none' }}
          />
          <button
            type="button"
            className="snap-upload-button"
            disabled={uploadDisabled}
            onClick={openUpload}
          >
            {weddingConfig.content.snaps.uploadButton}
          </button>
          <p className="snap-upload-notice" id="snap-upload-notice" style={noticeStyle}>
            {UPLOAD_START_NOTICE}
            <br />
            업로드 가능합니다.
          </p>
        </div>
      </section>

      {modalOpen && (
        <div className="snap-upload-modal" id="snap-upload-modal" style={{ display: 'flex' }}>
          <div className="snap-upload-modal-content">
            <h3>{weddingConfig.content.snaps.uploadModal.title}</h3>
            <div className="snap-upload-progress-bar">
              <div className="snap-upload-progress-fill" id="snap-upload-progress" />
            </div>
            <div className="snap-upload-status" id="snap-upload-status">
              {weddingConfig.content.snaps.uploadModal.preparing}
            </div>
            <button
              type="button"
              className="snap-upload-close-btn"
              id="snap-upload-close"
              onClick={() => setModalOpen(false)}
            >
              {weddingConfig.content.snaps.uploadModal.closeButton}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
