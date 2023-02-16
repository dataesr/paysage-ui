import { useEffect } from 'react';

import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function MatomoReport() {
  const { viewer } = useAuth();
  const { trackPageView } = useMatomo();
  const { pathname } = useLocation();

  useEffect(() => {
    trackPageView({
      customDimensions: [
        { id: 1, value: viewer?.groups?.map((group) => group.acronym).join(';') },
      ],
    });
  }, [trackPageView, pathname, viewer]);
}
