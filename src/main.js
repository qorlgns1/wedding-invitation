import './styles.css';
import { resolveAssetPath } from './lib/path';
import { isSupabaseConfigured } from './lib/supabaseClient';
import { submitRsvp } from './services/rsvpService';
import configData from '../config/config.json';
import {
  listGuestbook,
  createGuestbook,
  verifyGuestbookPassword,
  updateGuestbook,
  deleteGuestbook,
} from './services/guestbookService';

const state = {
  config: null,
  countdownTimer: null,
  gallery: [],
  guestbook: {
    page: 1,
    limit: 10,
    totalPages: 1,
    entries: [],
  },
  verifyContext: null,
  verifiedPassword: '',
};

function el(id) {
  return document.getElementById(id);
}

function setText(id, value = '') {
  const node = el(id);
  if (node) {
    node.textContent = value;
  }
}

function setHtml(id, value = '') {
  const node = el(id);
  if (node) {
    node.innerHTML = value;
  }
}

function showToast(message) {
  const toast = el('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

async function loadConfig() {
  return JSON.parse(JSON.stringify(configData));
}

function applyMeta(config) {
  document.title = config.content.page_title || 'Wedding Invitation';

  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  const ogImage = document.querySelector('meta[property="og:image"]');

  if (ogTitle) ogTitle.content = config.content.meta.title || document.title;
  if (ogDescription) ogDescription.content = config.content.meta.description || '';
  if (ogImage) ogImage.content = config.content.meta.image || '';
}

function applyHero(config) {
  const { wedding, content } = config;

  setText('groom-name-kr', wedding.groom.name_kr);
  setText('bride-name-kr', wedding.bride.name_kr);
  setText('names-en', `${wedding.groom.name_en} & ${wedding.bride.name_en}`);
  setText(
    'event-date-time',
    `${wedding.date.year}년 ${wedding.date.month}월 ${wedding.date.day}일 (${wedding.date.day_of_week}) ${wedding.date.display_time}`,
  );
  setText('event-place', wedding.venue.name);

  setText('letter-date', `${wedding.date.year}.${wedding.date.month}.${wedding.date.day}`);
  setText('letter-title', content.letter.title);
  setText('letter-header', content.letter.header);
  setHtml('letter-content', content.letter.content);

  setHtml(
    'groom-family',
    `${wedding.groom.parents.father} • ${wedding.groom.parents.mother} 의 ${wedding.groom.birth_order} <span class="groom-name">${wedding.groom.display_name}</span>`,
  );
  setHtml(
    'bride-family',
    `${wedding.bride.parents.father} • ${wedding.bride.parents.mother} 의 ${wedding.bride.birth_order} <span class="bride-name">${wedding.bride.display_name}</span>`,
  );

  setText('footer-names', `${wedding.groom.name_en} & ${wedding.bride.name_en}`);
  setText('footer-date', `${wedding.date.year}. ${wedding.date.month}. ${wedding.date.day}`);
}

function setupSplash(config) {
  const overlay = el('intro-animation-overlay');
  if (!overlay) return;

  const scene = config.content?.intro_animation?.scene1;
  setText('intro-bottom-left', scene?.bottom_left || '');
  setText('intro-bottom-right', scene?.bottom_right || '');

  const closeSplash = () => {
    if (overlay.dataset.closed === 'true') return;
    overlay.dataset.closed = 'true';

    overlay.classList.add('hide');
    window.setTimeout(() => {
      overlay.remove();
      document.body.classList.remove('intro-active');
    }, 520);
  };

  const waitForIntroImages = () =>
    new Promise((resolve) => {
      const images = [...overlay.querySelectorAll('.intro-bg-image')];
      if (images.length === 0) {
        resolve();
        return;
      }

      let done = 0;
      const onDone = () => {
        done += 1;
        if (done >= images.length) resolve();
      };

      images.forEach((image) => {
        if (image.complete) {
          onDone();
          return;
        }

        image.addEventListener('load', onDone, { once: true });
        image.addEventListener('error', onDone, { once: true });
      });
    });

  const initVaraIntro = async () => {
    const container = el('vara-container');
    if (!container) return null;

    await loadScript(resolveAssetPath('static/js/vara.min.js'));
    if (typeof window.Vara === 'undefined') return null;

    container.innerHTML = '';

    const isMobile = window.innerWidth <= 768;
    const fontSize = isMobile ? 50 : 90;
    const strokeWidth = isMobile ? 1.5 : 2;
    const lineHeight = fontSize * 1.2;
    const startY = 50;
    const diagonalShift = isMobile ? 15 : 30;

    const texts = [
      {
        text: "We're",
        fontSize,
        strokeWidth,
        color: '#fff',
        duration: 700,
        textAlign: 'center',
        x: -diagonalShift,
        y: startY,
        fromCurrentPosition: { x: false, y: false },
      },
      {
        text: 'getting',
        fontSize,
        strokeWidth,
        color: '#fff',
        duration: 700,
        textAlign: 'center',
        x: 0,
        y: startY + lineHeight,
        fromCurrentPosition: { x: false, y: false },
      },
      {
        text: 'married!',
        fontSize,
        strokeWidth,
        color: '#fff',
        duration: 400,
        textAlign: 'center',
        x: diagonalShift,
        y: startY + lineHeight * 2,
        fromCurrentPosition: { x: false, y: false },
      },
    ];

    return await new Promise((resolve) => {
      try {
        const vara = new window.Vara(
          '#vara-container',
          resolveAssetPath('static/assets/fonts/json/Parisienne.json'),
          texts,
          {
            strokeWidth,
            fontSize,
            textAlign: 'center',
            autoAnimation: false,
          },
        );

        let settled = false;
        const settle = (value) => {
          if (settled) return;
          settled = true;
          resolve(value);
        };

        vara.ready(() => settle(vara));
        window.setTimeout(() => settle(null), 1800);
      } catch (error) {
        console.error('Vara intro init failed:', error);
        resolve(null);
      }
    });
  };

  const startIntro = async () => {
    document.body.classList.add('intro-active');
    overlay.classList.add('ready');

    await waitForIntroImages();
    const vara = await initVaraIntro();

    // Scene slide-in finishes around 1s (defined in legacy CSS)
    window.setTimeout(() => {
      if (vara) {
        try {
          vara.playAll();
        } catch (error) {
          console.error('Vara playAll failed:', error);
        }
      }
    }, 1000);

    // Writing duration total ~= 1800ms + buffer
    const closeDelay = vara ? 3800 : 2200;
    window.setTimeout(closeSplash, closeDelay);
  };

  overlay.addEventListener('click', closeSplash, { once: true });
  startIntro();
}

function startCountdown(config) {
  const labels = config.content.countdown.labels;
  setText('countdown-label-days', labels.days);
  setText('countdown-label-hours', labels.hour);
  setText('countdown-label-minutes', labels.min);
  setText('countdown-label-seconds', labels.sec);

  const targetDate = new Date(config.wedding.date.iso_format);

  const update = () => {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    if (diff > 0) {
      days = Math.floor(diff / (1000 * 60 * 60 * 24));
      hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      seconds = Math.floor((diff % (1000 * 60)) / 1000);
    }

    setText('countdown-days', String(days));
    setText('countdown-hours', String(hours));
    setText('countdown-minutes', String(minutes));
    setText('countdown-seconds', String(seconds));

    setHtml('countdown-message', config.content.countdown.message.replace('{days}일', `<span id="d-day-text">${days}일</span>`));
  };

  update();
  state.countdownTimer = window.setInterval(update, 1000);
}

function setupCalendar(config) {
  setText('google-calendar-btn', config.content.buttons.google_calendar);

  el('google-calendar-btn')?.addEventListener('click', () => {
    const start = new Date(config.wedding.date.iso_format);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const format = (date) => date.toISOString().replace(/[-:]/g, '').replace('.000', '');
    const dates = `${format(start)}/${format(end)}`;

    const text = encodeURIComponent(`${config.wedding.groom.display_name} ♥ ${config.wedding.bride.display_name} 결혼식`);
    const details = encodeURIComponent(config.content.meta.description);
    const location = encodeURIComponent(config.wedding.venue.full_address);

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });
}

function renderGallery(config) {
  setText('gallery-subtitle-en', config.content.gallery.subtitle_en);
  setText('gallery-title', config.content.gallery.title);
  setText('gallery-subtitle', config.content.gallery.subtitle);

  const container = el('photo-grid');
  if (!container) return;

  const total = Number(config.content.gallery.total_photos || 0);
  const basePath = config.assets.gallery_path || '/static/assets/images/wedding-snaps/';

  state.gallery = Array.from({ length: total }, (_, idx) => `${basePath}${idx + 1}.webp`);

  container.innerHTML = state.gallery
    .map(
      (imagePath, idx) => `
        <button class="gallery-photo-button" data-gallery-index="${idx}">
          <img src="${resolveAssetPath(imagePath)}" alt="gallery-${idx + 1}" loading="lazy" />
        </button>
      `,
    )
    .join('');

  container.addEventListener('click', (event) => {
    const button = event.target.closest('[data-gallery-index]');
    if (!button) return;

    const index = Number(button.dataset.galleryIndex);
    const imagePath = state.gallery[index];
    const lightbox = el('gallery-lightbox');
    const image = el('gallery-lightbox-image');

    if (image && lightbox && imagePath) {
      image.src = resolveAssetPath(imagePath);
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  });

  el('gallery-lightbox-close')?.addEventListener('click', closeGalleryLightbox);
  el('gallery-lightbox')?.addEventListener('click', (event) => {
    if (event.target.id === 'gallery-lightbox') {
      closeGalleryLightbox();
    }
  });
}

function closeGalleryLightbox() {
  const lightbox = el('gallery-lightbox');
  if (lightbox) {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function renderQna(config) {
  setText('qna-subtitle-en', config.content.qna_section.subtitle_en);
  setText('qna-title', config.content.qna_section.title);
  setText('qna-subtitle', config.content.qna_section.subtitle);

  const container = el('qna-accordion');
  if (!container) return;

  container.innerHTML = config.qna
    .map(
      (item) => `
        <details class="qna-item">
          <summary>${item.question}</summary>
          <p>${item.answer}</p>
        </details>
      `,
    )
    .join('');
}

function renderLocation(config) {
  setText('location-subtitle-en', config.content.location.subtitle_en);
  setText('location-title', config.content.location.title);
  setText('venue-address', config.wedding.venue.full_address);
  setText('map-click-hint', config.content.location.map_click_hint);

  const mapImage = el('map-image');
  if (mapImage) {
    mapImage.src = resolveAssetPath(config.assets.map_image);
    mapImage.alt = `${config.wedding.venue.name} 위치 안내도`;
  }

  const maps = config.external_links.maps;
  el('open-naver-map')?.addEventListener('click', () => window.open(maps.naver, '_blank', 'noopener,noreferrer'));
  el('open-kakao-map')?.addEventListener('click', () => window.open(maps.kakao, '_blank', 'noopener,noreferrer'));
  el('open-tmap')?.addEventListener('click', () => window.open(maps.tmap, '_blank', 'noopener,noreferrer'));

  el('map-image-container')?.addEventListener('click', () => {
    if (mapImage?.src) {
      window.open(mapImage.src, '_blank', 'noopener,noreferrer');
    }
  });
}

function renderAccounts(config) {
  setText('account-subtitle-en', config.content.account_section.subtitle_en);
  setText('account-title', config.content.account_section.title);
  setText('groom-accounts-title', config.content.account_section.groom_button);
  setText('bride-accounts-title', config.content.account_section.bride_button);

  const buildAccountHtml = (account) => {
    const kakaopayButton = account.kakaopay_url
      ? `<a href="${account.kakaopay_url}" target="_blank" rel="noopener noreferrer">${config.content.account_section.kakaopay_button_text}</a>`
      : '';

    return `
      <article class="account-card">
        <div class="account-owner">${account.name}</div>
        <div>${account.bank}</div>
        <p class="account-number">${account.number}</p>
        <div class="account-actions">
          <button type="button" data-copy-account="${account.number}">${config.content.account_section.copy_button_text}</button>
          ${kakaopayButton}
        </div>
      </article>
    `;
  };

  const groomContainer = el('groom-accounts');
  const brideContainer = el('bride-accounts');
  if (groomContainer) groomContainer.innerHTML = config.accounts.groom.map(buildAccountHtml).join('');
  if (brideContainer) brideContainer.innerHTML = config.accounts.bride.map(buildAccountHtml).join('');

  document.querySelectorAll('[data-copy-account]').forEach((node) => {
    node.addEventListener('click', async () => {
      const accountNumber = node.getAttribute('data-copy-account');
      try {
        await navigator.clipboard.writeText(accountNumber || '');
        showToast(config.content.account_section.copy_success_message);
      } catch (error) {
        showToast(config.content.account_section.copy_error_message);
      }
    });
  });
}

function setupRsvpUi(config) {
  setText('rsvp-title', config.content.rsvp.title);
  setText('rsvp-subtitle', config.content.rsvp.subtitle);
  setText('open-rsvp-btn', config.content.rsvp.button_text);

  setText('rsvp-modal-title', config.content.modals.rsvp.title);
  setText('rsvp-can-attend-label', config.content.modals.rsvp.can_attend_label);
  setText('rsvp-which-side-label', config.content.modals.rsvp.which_side_label);
  setText('rsvp-name-label', config.content.modals.rsvp.guest_name_label);
  setText('rsvp-companion-label', config.content.modals.rsvp.companion_extra_label);
  setText('rsvp-meal-label', config.content.modals.rsvp.meal_attendance_label);
  setText('rsvp-phone-label', config.content.modals.rsvp.phone_label);
  setText('rsvp-submit-btn', config.content.buttons.submit);

  const nameInput = el('rsvp-guest-name');
  const phoneInput = el('rsvp-phone');
  if (nameInput) nameInput.placeholder = config.content.modals.rsvp.guest_name_placeholder;
  if (phoneInput) phoneInput.placeholder = config.content.modals.rsvp.phone_placeholder;

  setHtml('rsvp-privacy-text', `${config.content.modals.rsvp.privacy_title}<br>${config.content.modals.rsvp.privacy_description}<br>${config.content.modals.rsvp.privacy_agree}`);

  renderOptionButtons('rsvp-can-attend-options', 'can-attend', [
    config.content.modals.rsvp.can_attend_options.yes,
    config.content.modals.rsvp.can_attend_options.no,
  ]);

  renderOptionButtons('rsvp-which-side-options', 'which-side', [
    config.content.modals.rsvp.which_side_options.groom,
    config.content.modals.rsvp.which_side_options.bride,
  ]);

  renderOptionButtons('rsvp-meal-options', 'meal-attendance', [
    config.content.modals.rsvp.meal_attendance_options.yes_value,
    config.content.modals.rsvp.meal_attendance_options.no_value,
  ], [
    config.content.modals.rsvp.meal_attendance_options.yes,
    config.content.modals.rsvp.meal_attendance_options.no,
  ]);

  el('open-rsvp-btn')?.addEventListener('click', () => openModal('rsvp-modal'));

  el('rsvp-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = {
      which_side: mapWhichSideValue(formData.get('which-side'), config),
      can_attend: formData.get('can-attend'),
      guest_name: (formData.get('guest-name') || '').toString().trim(),
      phone_number: (formData.get('phone-number') || '').toString().trim(),
      companion_count: Number(formData.get('companion-extra') || 0) + 1,
      meal_attendance: formData.get('meal-attendance'),
    };

    if (!data.which_side || !data.can_attend || !data.guest_name || !data.meal_attendance) {
      showToast('필수 항목을 입력해주세요.');
      return;
    }

    const submitButton = el('rsvp-submit-btn');
    if (submitButton) submitButton.disabled = true;

    try {
      await submitRsvp(data);
      showToast('참석 의사가 전달되었습니다.');
      event.currentTarget.reset();
      clearOptionSelection('rsvp-modal');
      closeModal('rsvp-modal');
    } catch (error) {
      showToast(error.message || '참석 의사 전달에 실패했습니다.');
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

function mapWhichSideValue(value, config) {
  if (value === config.content.modals.rsvp.which_side_options.groom) return 'groom';
  if (value === config.content.modals.rsvp.which_side_options.bride) return 'bride';
  return value;
}

function renderOptionButtons(containerId, name, values, labels = values) {
  const container = el(containerId);
  if (!container) return;

  container.innerHTML = values
    .map(
      (value, idx) => `
        <label>
          <input type="radio" name="${name}" value="${value}" required />
          <span>${labels[idx]}</span>
        </label>
      `,
    )
    .join('');

  container.querySelectorAll('label').forEach((labelNode) => {
    const input = labelNode.querySelector('input');
    input?.addEventListener('change', () => {
      container.querySelectorAll('label').forEach((n) => n.classList.remove('active'));
      labelNode.classList.add('active');
    });
  });
}

function clearOptionSelection(modalId) {
  const modal = el(modalId);
  modal?.querySelectorAll('.option-buttons label').forEach((labelNode) => {
    labelNode.classList.remove('active');
  });
}

function setupGuestbookUi(config) {
  setText('guestbook-subtitle-en', config.content.guestbook.subtitle_en);
  setText('guestbook-title', config.content.guestbook.title);
  setHtml('guestbook-subtitle', config.content.guestbook.subtitle);
  setText('guestbook-empty-title', config.content.guestbook.empty_message);
  setText('guestbook-empty-subtitle', config.content.guestbook.empty_subtitle);

  setText('open-guestbook-btn', config.content.buttons.write_message);
  setText('guestbook-modal-title', config.content.modals.guestbook.title);
  setHtml('guestbook-modal-subtitle', config.content.modals.guestbook.subtitle);
  setText('guestbook-name-label', config.content.modals.guestbook.name_label);
  setText('guestbook-message-label', config.content.modals.guestbook.message_label);
  setText('guestbook-password-label', config.content.modals.guestbook.password_label);
  setText('guestbook-password-hint', config.content.modals.guestbook.password_hint);
  setText('guestbook-submit-btn', config.content.buttons.write_complete);
  setText('guestbook-verify-title', config.content.modals.edit_message.title);
  setText('guestbook-verify-description', config.content.modals.edit_message.password_prompt);
  setText('guestbook-edit-title', config.content.modals.edit_message.title);

  const nameInput = el('guestbook-name');
  const messageInput = el('guestbook-message');
  const passwordInput = el('guestbook-password');
  if (nameInput) nameInput.placeholder = config.content.modals.guestbook.name_placeholder;
  if (messageInput) messageInput.placeholder = config.content.modals.guestbook.message_placeholder;
  if (passwordInput) passwordInput.placeholder = config.content.modals.guestbook.password_placeholder;

  el('open-guestbook-btn')?.addEventListener('click', () => openModal('guestbook-modal'));

  el('guestbook-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: (formData.get('name') || '').toString().trim(),
      message: (formData.get('message') || '').toString().trim(),
      password: (formData.get('password') || '').toString().trim(),
    };

    if (!payload.name || !payload.message || payload.password.length < 4) {
      showToast('입력값을 확인해주세요.');
      return;
    }

    const submitButton = el('guestbook-submit-btn');
    if (submitButton) submitButton.disabled = true;

    try {
      await createGuestbook(payload);
      showToast('축하 메시지가 전달되었습니다.');
      event.currentTarget.reset();
      closeModal('guestbook-modal');
      await loadGuestbookPage(1);
    } catch (error) {
      showToast(error.message || '방명록 저장에 실패했습니다.');
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });

  el('guestbook-list')?.addEventListener('click', async (event) => {
    const actionButton = event.target.closest('[data-gb-action]');
    if (!actionButton) return;

    const action = actionButton.getAttribute('data-gb-action');
    const entryId = Number(actionButton.getAttribute('data-entry-id'));

    if (!entryId || (action !== 'edit' && action !== 'delete')) return;

    state.verifyContext = { action, entryId };
    state.verifiedPassword = '';
    const verifyInput = el('guestbook-verify-password');
    if (verifyInput) verifyInput.value = '';

    const description =
      action === 'edit'
        ? config.content.modals.edit_message.password_prompt
        : config.content.modals.delete_message.password_prompt;
    setText('guestbook-verify-description', description);

    openModal('guestbook-verify-modal');
  });

  el('guestbook-verify-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!state.verifyContext) return;

    const password = (el('guestbook-verify-password')?.value || '').trim();
    if (password.length < 4) {
      showToast('비밀번호를 4자 이상 입력해주세요.');
      return;
    }

    const submitButton = el('guestbook-verify-submit-btn');
    if (submitButton) submitButton.disabled = true;

    try {
      const verified = await verifyGuestbookPassword(state.verifyContext.entryId, password);
      state.verifiedPassword = password;

      if (state.verifyContext.action === 'delete') {
        await deleteGuestbook(state.verifyContext.entryId, password);
        closeModal('guestbook-verify-modal');
        showToast('메시지가 삭제되었습니다.');
        await loadGuestbookPage(state.guestbook.page);
        return;
      }

      const data = verified.data || {};
      const editName = el('guestbook-edit-name');
      const editMessage = el('guestbook-edit-message');
      if (editName) editName.value = data.name || '';
      if (editMessage) editMessage.value = data.message || '';

      closeModal('guestbook-verify-modal');
      openModal('guestbook-edit-modal');
    } catch (error) {
      showToast(error.message || '비밀번호 확인에 실패했습니다.');
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });

  el('guestbook-edit-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!state.verifyContext?.entryId || !state.verifiedPassword) {
      showToast('다시 시도해주세요.');
      closeModal('guestbook-edit-modal');
      return;
    }

    const name = (el('guestbook-edit-name')?.value || '').trim();
    const message = (el('guestbook-edit-message')?.value || '').trim();

    if (!name || !message) {
      showToast('이름과 메시지를 입력해주세요.');
      return;
    }

    const submitButton = el('guestbook-edit-submit-btn');
    if (submitButton) submitButton.disabled = true;

    try {
      await updateGuestbook({
        id: state.verifyContext.entryId,
        name,
        message,
        password: state.verifiedPassword,
      });
      closeModal('guestbook-edit-modal');
      showToast('메시지가 수정되었습니다.');
      await loadGuestbookPage(state.guestbook.page);
    } catch (error) {
      showToast(error.message || '메시지 수정에 실패했습니다.');
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

function renderGuestbookEntries() {
  const listNode = el('guestbook-list');
  const emptyNode = el('guestbook-empty');
  if (!listNode || !emptyNode) return;

  if (state.guestbook.entries.length === 0) {
    listNode.innerHTML = '';
    emptyNode.style.display = 'block';
    return;
  }

  emptyNode.style.display = 'none';
  listNode.innerHTML = state.guestbook.entries
    .map(
      (entry) => `
        <article class="guestbook-entry">
          <header class="guestbook-entry-head">
            <span class="guestbook-entry-name">${escapeHtml(entry.name || '')}</span>
            <span>${formatDate(entry.created_at)}</span>
          </header>
          <p class="guestbook-entry-message">${escapeHtml(entry.message || '')}</p>
          <div class="guestbook-entry-actions">
            <button class="guestbook-action" data-gb-action="edit" data-entry-id="${entry.id}">수정</button>
            <button class="guestbook-action danger" data-gb-action="delete" data-entry-id="${entry.id}">삭제</button>
          </div>
        </article>
      `,
    )
    .join('');
}

function renderGuestbookPagination() {
  const pagination = el('guestbook-pagination');
  if (!pagination) return;

  const pages = state.guestbook.totalPages;
  if (pages <= 1) {
    pagination.innerHTML = '';
    return;
  }

  const buttons = [];
  for (let page = 1; page <= pages; page += 1) {
    buttons.push(`
      <button class="guestbook-page-btn ${page === state.guestbook.page ? 'active' : ''}" data-page="${page}">${page}</button>
    `);
  }

  pagination.innerHTML = buttons.join('');

  pagination.querySelectorAll('[data-page]').forEach((button) => {
    button.addEventListener('click', async () => {
      const page = Number(button.getAttribute('data-page'));
      await loadGuestbookPage(page);
    });
  });
}

async function loadGuestbookPage(page = 1) {
  const data = await listGuestbook(page, state.guestbook.limit);

  state.guestbook.page = data.page;
  state.guestbook.totalPages = data.totalPages;
  state.guestbook.entries = data.entries;

  renderGuestbookEntries();
  renderGuestbookPagination();
}

function setupShare(config) {
  setHtml('share-message', config.content.image_share.message);
  const shareImage = el('share-background-image');
  if (shareImage) {
    shareImage.src = resolveAssetPath(config.assets.share_background_image);
  }

  setText('share-kakao-btn', config.content.buttons.kakao_share);
  setText('share-native-btn', config.content.share.buttons.native);
  setText('copy-link-btn', config.content.share.buttons.link);

  el('copy-link-btn')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('링크가 복사되었습니다.');
    } catch (error) {
      showToast('링크 복사에 실패했습니다.');
    }
  });

  el('share-native-btn')?.addEventListener('click', async () => {
    if (!navigator.share) {
      showToast('이 브라우저는 기본 공유를 지원하지 않습니다.');
      return;
    }

    try {
      await navigator.share({
        title: config.content.share.kakao_share.title,
        text: config.content.share.kakao_share.description,
        url: window.location.href,
      });
    } catch {
      // user cancel no-op
    }
  });

  el('share-kakao-btn')?.addEventListener('click', async () => {
    const success = await sendKakaoShare(config);
    if (!success) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('카카오 SDK가 없어 링크를 복사했습니다.');
      } catch {
        showToast('카카오 공유를 사용할 수 없습니다.');
      }
    }
  });
}

async function sendKakaoShare(config) {
  const appKey = import.meta.env.VITE_KAKAO_APP_KEY;
  if (!appKey) return false;

  if (!window.Kakao) {
    await loadScript('https://developers.kakao.com/sdk/js/kakao.min.js');
  }

  if (!window.Kakao) return false;

  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(appKey);
  }

  try {
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: config.content.share.kakao_share.title,
        description: config.content.share.kakao_share.description,
        imageUrl: config.content.meta.image,
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
      buttons: [
        {
          title: config.content.share.kakao_share.button_title,
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
      ],
    });
    return true;
  } catch {
    return false;
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`${src} load failed`));
    document.head.appendChild(script);
  });
}

function setupModalControls() {
  document.querySelectorAll('[data-close-modal]').forEach((button) => {
    button.addEventListener('click', () => {
      const modalId = button.getAttribute('data-close-modal');
      if (modalId) closeModal(modalId);
    });
  });

  document.querySelectorAll('.modal').forEach((modal) => {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal(modal.id);
      }
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      document.querySelectorAll('.modal.is-open').forEach((modal) => closeModal(modal.id));
      closeGalleryLightbox();
    }
  });
}

function openModal(modalId) {
  const modal = el(modalId);
  if (!modal) return;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const modal = el(modalId);
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');

  const hasOpenModal = document.querySelector('.modal.is-open');
  if (!hasOpenModal) {
    document.body.style.overflow = '';
  }
}

function setupSupabaseNotice() {
  if (isSupabaseConfigured()) return;

  const targets = ['rsvp-form', 'guestbook-form', 'guestbook-verify-form', 'guestbook-edit-form'];
  targets.forEach((id) => {
    const form = el(id);
    if (!form) return;

    form.querySelectorAll('input, textarea, button').forEach((node) => {
      node.disabled = true;
    });

    const note = document.createElement('p');
    note.className = 'app-disabled-note';
    note.textContent = 'Supabase 환경변수가 없어 입력 기능이 비활성화되었습니다.';
    form.appendChild(note);
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

async function bootstrap() {
  // Legacy CSS keeps body hidden until `.loaded` is set.
  document.body.classList.add('loaded');

  try {
    state.config = await loadConfig();

    applyMeta(state.config);
    applyHero(state.config);
    setupSplash(state.config);
    startCountdown(state.config);
    setupCalendar(state.config);
    renderGallery(state.config);
    renderQna(state.config);
    renderLocation(state.config);
    renderAccounts(state.config);
    setupRsvpUi(state.config);
    setupGuestbookUi(state.config);
    setupShare(state.config);
    setupModalControls();
    setupSupabaseNotice();

    if (isSupabaseConfigured()) {
      await loadGuestbookPage(1);
    } else {
      state.guestbook.entries = [];
      state.guestbook.totalPages = 1;
      renderGuestbookEntries();
      renderGuestbookPagination();
    }
  } catch (error) {
    console.error(error);
    const message = String(error?.message || '');
    if (message.includes('guestbook_public_entries') || message.includes('schema cache')) {
      showToast('Supabase 스키마가 적용되지 않았습니다. supabase/schema.sql을 실행해주세요.');
    } else {
      showToast(error.message || '초기화 중 오류가 발생했습니다.');
    }
  }
}

bootstrap();
