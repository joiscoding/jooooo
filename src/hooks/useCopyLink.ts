import { useCallback } from 'react';
import { getCanonicalUrl, getCanonicalUrlForPath } from '../lib/canonicalUrl';
import { copyToClipboard } from '../lib/copyToClipboard';
import { useToast } from '../context/ToastContext';

export function useCopyLink() {
  const { showToast } = useToast();

  const copyCurrentPageLink = useCallback(async () => {
    const url = getCanonicalUrl();
    const ok = await copyToClipboard(url);
    if (ok) {
      showToast('Link copied to clipboard.');
    } else {
      showToast('Could not copy link. Try again.');
    }
  }, [showToast]);

  const copyPathLink = useCallback(
    async (pathname: string) => {
      const url = getCanonicalUrlForPath(pathname);
      const ok = await copyToClipboard(url);
      if (ok) {
        showToast('Link copied to clipboard.');
      } else {
        showToast('Could not copy link. Try again.');
      }
    },
    [showToast],
  );

  return { copyCurrentPageLink, copyPathLink };
}
