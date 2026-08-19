import { useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import { copyToClipboard } from '../utils/clipboard';
import { getCanonicalUrl } from '../utils/canonicalUrl';

export function useCopyLink() {
  const { showToast } = useToast();

  const copyLink = useCallback(
    async (pathname: string) => {
      const url = getCanonicalUrl(pathname);
      const ok = await copyToClipboard(url);
      showToast(ok ? 'Link copied to clipboard.' : 'Could not copy link.');
    },
    [showToast],
  );

  return { copyLink };
}
