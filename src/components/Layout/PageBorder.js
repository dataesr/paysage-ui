import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const pageBorderColors = {
  structures: 'var(--yellow-tournesol-main-731)',
  personnes: 'var(--pink-tuile-main-556)',
  termes: 'var(--yellow-tournesol-main-731)',
  categories: 'var(--yellow-tournesol-main-731)',
  'textes-officiels': 'var(--yellow-tournesol-main-731)',
  documents: 'var(--yellow-tournesol-main-731)',
};

export default function PageBorder() {
  const location = useLocation();

  useEffect(() => {
    const splitted = location?.pathname?.split('/')[1];
    const border = pageBorderColors[splitted] || 'transparent';
    document.documentElement.style.setProperty('--page-border', border);
  }, [location]);

  return <span id="page-border" />;
}
