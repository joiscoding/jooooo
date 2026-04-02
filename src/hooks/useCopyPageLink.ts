import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useCopyFeedback } from '../context/CopyFeedbackContext';
import { canonicalUrlForPath, canonicalUrlFromLocation } from '../lib/canonicalUrl';
import { copyTextToClipboard } from '../lib/copyToClipboard';

export function useCopyPageLink() {
  const location = useLocation();
  const { notifyCopySuccess, notifyCopyError } = useCopyFeedback();

  return useCallback(
    async (pathOverride?: string) => {
      const origin = window.location.origin;
      const url =
        pathOverride !== undefined
          ? canonicalUrlForPath(origin, pathOverride)
          : canonicalUrlFromLocation({
              origin,
              pathname: location.pathname,
            });
      try {
        await copyTextToClipboard(url);
        notifyCopySuccess();
      } catch {
        notifyCopyError();
      }
    },
    [location.pathname, notifyCopySuccess, notifyCopyError],
  );
}
