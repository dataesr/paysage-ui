import { Link, useParams } from 'react-router-dom';
import { Col, Row, Text } from '@dataesr/react-dsfr';
import useFetch from '../../hooks/useFetch';
import useHashScroll from '../../hooks/useHashScroll';

import { Bloc, BlocContent, BlocTitle } from '../bloc';
import Avatar from '../avatar';

export default function JournalOutlet() {
  const { id: resourceId } = useParams();
  const url = `/journal?filters[resourceId]=${resourceId}&sort=-createdAt`;
  const { data, isLoading, error } = useFetch(url);
  useHashScroll();

  const renderContent = () => {
    if (!data || !data.data.length) return null;
    return (
      <Row gutters>
        {data.data.map((event) => (
          <Col n="12" key={JSON.stringify(event)}>
            <div className="flex flex--center">
              <Avatar name={event.user.lastName} size="24px" src={event.user.avatar} />
              <Text spacing="ml-1v mb-0">
                {`${event.user.firstName} ${event.user.lastName}`}
                {' le '}
                {new Date(event.createdAt).toLocaleDateString()}
                {' a '}
                {['PUT', 'POST'].includes(event.method.toUpperCase()) && 'crée' }
                {['DELETE'].includes(event.method.toUpperCase()) && 'supprimé' }
                {['PATCH'].includes(event.method.toUpperCase()) && 'modifié' }
                {' un objet '}
                <Link to={`/${event.resourceType}/${event.resourceId}`}>{event.resourceType}</Link>
                {event.subResourceType && `/${event.subResourceType}`}
              </Text>
            </div>
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h2" look="h6">Journal des modifications</BlocTitle>
      <BlocContent>{renderContent()}</BlocContent>
    </Bloc>
  );
}
