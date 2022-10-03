import { useParams, useLocation } from 'react-router-dom';

export default function useBlocUrl(blocPath) {
  const { id } = useParams();
  const { pathname } = useLocation();
  const api = pathname.split('/')?.[1];
  const url = blocPath ? `/${api}/${id}/${blocPath}` : `/${api}/${id}`;
  return { api, url };
}
