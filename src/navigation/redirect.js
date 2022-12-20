import { Navigate } from 'react-router-dom';
import useUrl from '../hooks/useUrl';

function getRoute(apiObject) {
  switch (apiObject) {
  case 'persons':
    return 'personnes';
  case 'prizes':
    return 'prix';
  case 'projects':
    return 'projets';
  case 'terms':
    return 'termes';
  case 'official-texts':
    return 'textes-officiels';
  case 'legal-categories':
    return 'categories-juridiques';
  case 'supervising-ministers':
    return 'ministres-de-tutelle';

  default:
    return apiObject;
  }
}

export default function Redirect() {
  const { id, apiObject } = useUrl();
  const url = `/${getRoute(apiObject)}/${id}`;
  return <Navigate to={url} replace />;
}
