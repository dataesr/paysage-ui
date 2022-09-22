import { useParams, useLocation } from 'react-router-dom';

export default function useUrl(blocPath) {
  const { id } = useParams();
  const { pathname } = useLocation();
  const api = pathname.split('/')?.[1];
  return blocPath ? `/${api}/${id}/${blocPath}` : `/${api}/${id}`;
}
