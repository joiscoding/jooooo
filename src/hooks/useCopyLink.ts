import { useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import { canonicalPageUrl } from '../lib/canonicalUrl';
import { copyTextToClipboard } from '../lib/copyToClipboard';

/**
 * Copies a canonical URL (origin + pathname) to the clipboard and shows a toast.
 * Pass `pathname` to copy a specific route (e.g. a gallery item).
 */
export function useCopyLink() {
  const { showToast } = useToast();

  const copyPageLink = useCallback(
    async (pathname?: string) => {
      const path = pathname ?? window.location.pathname;
      const url = canonicalPageUrl(window.location.origin, path);
      try {
        await copyTextToClipboard(url);
        showToast('Link copied.');
      } catch {
        showToast('Could not copy link.');
      }
    },
    [showToast],
  );

  return { copyPageLink };
}
