import { useEffect, useState } from 'react';
import useUrl from '../../../hooks/useUrl';
import api from '../../../utils/api';
import { getComparableNow } from '../../../utils/dates';

export default function CurrentLogos() {
  const { id } = useUrl();
  const [logos, setLogos] = useState(null);

  useEffect(() => {
    const getLogos = async () => {
      const data = await api.get('/document-types?filters[usualName]=Logo')
        .then((res) => res.data.data)
        .catch(() => []);
      if (data && data[0]?.id) {
        const logosData = await api.get(`/documents?filters[relatesTo]=${id}&filters[documentTypeId]=${data[0]?.id}`)
          .then((res) => res.data.data)
          .catch(() => []);
        const currentLogos = logosData
          .filter((doc) => (!doc.endDate || (doc.endDate >= getComparableNow())))
          .sort((a, b) => a.startDate < b.startDate);
        const logo = currentLogos?.[0];
        if (logo?.id) {
          const file = logo?.files?.[0];
          if (file) {
            await api.get(new URL(file.url).pathname, { Accept: file.mimetype })
              .then((response) => response.blob())
              .then((blob) => {
                const downloadUrl = URL.createObjectURL(new Blob([blob], { type: file.mimetype }));
                setLogos(downloadUrl);
              });
          }
        }
      }
    };
    getLogos();
  }, [id]);

  if (!logos) return null;
  return (
    <div className="fr-card fr-card--xs fr-card--horizontal fr-card--grey fr-card--no-border">
      <div className="fr-card__body">
        <div className="fr-card__content flex flex--center flex--space-around">
          <img alt="logo" src={logos} height="100px" />
        </div>
      </div>
    </div>
  );
}
