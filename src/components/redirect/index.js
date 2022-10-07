import { Navigate } from 'react-router-dom';
import useUrl from '../../hooks/useUrl';

function getRoute(apiObject) {
  switch (apiObject) {
  case 'persons':
    return 'personnes';
  case 'terms':
    return 'termes';
  case 'projects':
    return 'projets';
  case 'official-texts':
    return 'textes-officiels';

  default:
    return apiObject;
  }
}

export default function Redirect() {
  const { id, apiObject } = useUrl();
  const url = `/${getRoute(apiObject)}/${id}`;
  return <Navigate to={url} replace />;
}
