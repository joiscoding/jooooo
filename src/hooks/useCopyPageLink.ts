import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { buildCanonicalPageUrl } from '../lib/canonicalUrl';
import { copyTextToClipboard } from '../lib/copyToClipboard';
import { useToast } from '../context/ToastContext';

export function useCopyPageLink() {
  const location = useLocation();
  const { showToast } = useToast();

  const copyPathLink = useCallback(
    async (pathname: string) => {
      const url = buildCanonicalPageUrl(window.location.origin, pathname);
      const ok = await copyTextToClipboard(url);
      showToast(
        ok
          ? 'Link copied to clipboard.'
          : 'Could not copy link. Copy from the address bar instead.',
      );
    },
    [showToast],
  );

  const copyCurrentPageLink = useCallback(async () => {
    await copyPathLink(location.pathname);
  }, [copyPathLink, location.pathname]);

  return { copyCurrentPageLink, copyPathLink };
}
