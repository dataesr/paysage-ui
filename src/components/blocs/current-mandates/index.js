import { Row, Col } from '@dataesr/react-dsfr';
import { Bloc, BlocContent, BlocTitle } from '../../bloc';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import RelationCard from '../../card/relation-card';
import GoToCard from '../../card/go-to-card';
import { getComparableNow } from '../../../utils/dates';

export default function PersonCurrentMandates() {
  const { id } = useUrl();
  const { data, isLoading, error } = useFetch(`/relations?filters[relatedObjectId]=${id}&filters[relationTag]=gouvernance&limit=500`);

  const renderCurrentMandates = () => {
    if (!data?.data?.length > 0) return null;
    const currentMandates = data?.data
      .filter((mandate) => (!mandate.endDate || (mandate.endDate >= getComparableNow())))
      .sort((a, b) => ((a?.relationType?.priority || 99) - (b?.relationType?.priority || 99)));
    return (
      <Row gutters>
        {currentMandates.map((mandate) => (
          <Col key={mandate.id} n="12 md-6">
            <RelationCard
              inverse
              relation={mandate}
            />
          </Col>
        ))}
        {(currentMandates.length < data.data.length) && <Col n="12 md-6"><GoToCard to={`/personnes/${id}/mandats`} title="Afficher tous les mandats" /></Col>}
      </Row>
    );
  };
  return (
    <Bloc isLoading={isLoading} error={error} data={{ totalCount: data?.data?.filter((mandate) => !mandate.endDate)?.length || 0 }}>
      <BlocTitle as="h3" look="h4">Mandats actuels</BlocTitle>
      <BlocContent>
        {renderCurrentMandates()}
      </BlocContent>
    </Bloc>
  );
}
