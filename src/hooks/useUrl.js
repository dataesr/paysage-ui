import { useParams, useLocation } from 'react-router-dom';

import { getTypeFromUrl } from '../utils/types-url-mapper';

export default function useUrl(suffix) {
  const { id } = useParams();
  const { pathname } = useLocation();
  const apiObject = getTypeFromUrl(pathname.split('/')?.[1]);
  const url = suffix ? `/${apiObject}/${id}/${suffix}` : `/${apiObject}/${id}`;
  return { apiObject, id, url };
}
