import { useEffect, useState } from 'react';
import api from '../../../utils/api';
import { getComparableNow } from '../../../utils/dates';

export default function useGetLogo(id) {
  const [logo, setLogo] = useState(null);

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
        const firstLogo = currentLogos?.[0];
        if (firstLogo?.id) {
          const file = firstLogo?.files?.[0];
          if (file) {
            await api.get(new URL(file.url).pathname, { Accept: file.mimetype })
              .then((response) => response.blob())
              .then((blob) => {
                const downloadUrl = URL.createObjectURL(new Blob([blob], { type: file.mimetype }));
                setLogo(downloadUrl);
              });
          }
        }
      }
    };
    getLogos();
  }, [id]);
  return logo;
}
