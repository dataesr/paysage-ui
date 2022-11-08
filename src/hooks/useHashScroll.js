import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function useHashScroll(timeout = 0) {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (hash === '') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } else {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
        }
      }, timeout);
    }
  }, [pathname, hash, key, timeout]);
}
