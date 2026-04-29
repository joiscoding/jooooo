import { useCallback } from 'react';
import { buildCanonicalPageUrl } from '../lib/canonicalUrl';
import { copyTextToClipboard } from '../lib/copyToClipboard';
import { useToast } from '../context/ToastContext';

/**
 * Copies a canonical URL (origin + pathname) to the clipboard and shows a toast.
 */
export function useCopyLink() {
  const { showToast } = useToast();

  return useCallback(
    async (pathname: string) => {
      const url = buildCanonicalPageUrl(window.location.origin, pathname);
      try {
        await copyTextToClipboard(url);
        showToast('Link copied.');
      } catch {
        showToast('Could not copy link.');
      }
    },
    [showToast],
  );
}
