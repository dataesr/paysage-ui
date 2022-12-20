import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const pageBorderColors = {
  structures: 'var(--structures-color)',
  personnes: 'var(--persons-color)',
  categories: 'var(--categories-color)',
  prix: 'var(--prizes-color)',
  projets: 'var(--projects-color)',
  documents: 'var(--documents-color)',
  termes: 'var(--terms-color)',
  'textes-officiels': 'var(--textes-officiels-color)',
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
