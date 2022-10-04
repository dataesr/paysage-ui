import { useParams, useLocation } from 'react-router-dom';
import { getTypeFromUrl } from '../utils/types-url-mapper';

export default function useUrl(sufix) {
  const { id } = useParams();
  const { pathname } = useLocation();
  const apiObject = getTypeFromUrl(pathname.split('/')?.[1]);
  const url = sufix ? `/${apiObject}/${id}/${sufix}` : `/${apiObject}/${id}`;
  return { url, id, apiObject };
}
