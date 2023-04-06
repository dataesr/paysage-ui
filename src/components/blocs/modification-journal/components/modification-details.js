import { Col, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import useFetch from '../../../../hooks/useFetch';
import DocumentCard from '../../../card/document-card';
import FollowUpTimelineItem from '../../../card/follow-ups-timeline-item';
import KeyValueCard from '../../../card/key-value-card';
import LastCreationCard from '../../../card/last-creation-card';
import RelationCardTwoSided from '../../../card/relation-card-two-sided';
import { PageSpinner } from '../../../spinner';
import { Timeline } from '../../../timeline';
import OfficialTextTimelineItem from '../../textes-officiels/components/official-text-timeline-item';

function buildUrl({ resourceType, resourceId, subResourceType, subResourceId }) {
  if (resourceType === 'admin') return null;
  if (!subResourceType || !subResourceId) return `/${resourceType}/${resourceId}`;
  if (subResourceType && subResourceId) return `/${resourceType}/${resourceId}/${subResourceType}/${subResourceId}`;
  return null;
}

function getKeyValueObject(subResource) {
  switch (subResource) {
  case 'identifiers':
    return ['type', 'value', 'ri-fingerprint-line', false];
  case 'social-medias':
    return ['type', 'account', 'ri-share-line', true];
  case 'weblinks':
    return ['type', 'url', 'ri-global-line', true];
  case 'names':
    return ['usualName', null, 'ri-text', false];
  case 'localisations':
    return ['city', 'address', 'ri-pushpin-2-line', false];
  default:
    return ['type', 'value', 'ri-fingerprint-line', false];
  }
}

export default function ModificationDetails({ data }) {
  const url = buildUrl(data);
  const { data: modification, isLoading, error } = useFetch(url);
  if (isLoading) return <PageSpinner />;
  if (error) return "L'objet a été supprimé";
  if (data.resourceType === 'relations') {
    return (
      <Row>
        <Col n="12">
          <RelationCardTwoSided relation={modification} />
        </Col>
      </Row>
    );
  }
  if (data.resourceType === 'documents') {
    return (
      <Row>
        <Col n="12">
          <DocumentCard document={modification} n="12" />
        </Col>
      </Row>
    );
  }
  if (data.resourceType === 'official-texts') {
    return (
      <Row>
        <Timeline>
          <OfficialTextTimelineItem data={modification} />
        </Timeline>
      </Row>
    );
  }
  if (!data.subResourceType && ['persons', 'structures', 'terms', 'categories', 'prizes', 'projects'].includes(data.resourceType)) {
    return (
      <Row>
        <LastCreationCard n="12" item={{ ...modification, collection: data.resourceType }} />
      </Row>
    );
  }
  if (data.resourceType === 'follow-ups') {
    return (
      <Row>
        <Timeline>
          <FollowUpTimelineItem event={modification} />
        </Timeline>
      </Row>
    );
  }
  if (data.subResourceType && ['social-medias', 'weblinks', 'names', 'localisations', 'identifiers'].includes(data.subResourceType)) {
    const mapping = getKeyValueObject(data.subResourceType);
    return (

      <KeyValueCard
        cardKey={modification.resource.displayName}
        cardValue={`${modification[mapping[0]]}: ${modification[mapping[1]] || ''}`}
        className={modification?.resource?.collection && `card-${modification.resource.collection}`}
        icon={mapping[2]}
        linkTo={modification?.resource?.href}
        titleAsText={mapping[3]}
      />
    );
  }
  return (
    <Row>
      <pre>
        <code>
          {JSON.stringify(modification, null, 2)}
        </code>
      </pre>
    </Row>
  );
}

ModificationDetails.propTypes = {
  data: PropTypes.object,
};
ModificationDetails.defaultProps = {
  data: null,
};
