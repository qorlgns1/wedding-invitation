export function openExternalMap(url: string): void {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');

  if (isMobile) {
    window.location.href = url;
    return;
  }

  const popup = window.open(url, '_blank', 'noopener,noreferrer');
  if (popup) popup.opener = null;
  else window.location.href = url;
}
