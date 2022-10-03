import { useParams, useLocation } from 'react-router-dom';

export default function useUrl(sufix) {
  const { id } = useParams();
  const { pathname } = useLocation();
  const apiObject = pathname.split('/')?.[1];
  const url = sufix ? `/${apiObject}/${id}/${sufix}` : `/${apiObject}/${id}`;
  return { url, id, apiObject };
}
