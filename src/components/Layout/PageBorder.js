import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const pageBorderColors = {
  structures: 'var(--yellow-tournesol-main-731)',
  personnes: 'var(--pink-tuile-main-556)',
  categories: 'var(--green-bourgeon-main-640)',
  prices: 'var(--blue-ecume-main-400)',
  documents: 'var(--green-archipel-main-557)',
  termes: 'var(--purple-glycine-main-494)',
  'textes-officiels': 'var(--green-emeraude-main-632)',
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
