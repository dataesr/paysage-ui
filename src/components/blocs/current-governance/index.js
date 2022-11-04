import { Row, Col } from '@dataesr/react-dsfr';
import { Bloc, BlocContent, BlocTitle } from '../../bloc';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import RelationCard from '../../card/relation-card';
import GoToCard from '../../card/go-to-card';
import { getComparableNow } from '../../../utils/dates';

export default function StructureCurrentGovernance() {
  const { id } = useUrl();
  const { data, isLoading, error } = useFetch(`/relations?filters[resourceId]=${id}&filters[relationTag]=gouvernance&limit=500`);

  const renderCurrentMandates = () => {
    if (!data?.data?.length > 0) return null;
    const currentMandates = data?.data
      .filter((mandate) => (!mandate.endDate || (mandate.endDate >= getComparableNow())))
      .filter((mandate) => (mandate?.relationType?.priority < 10))
      .sort((a, b) => ((a?.relationType?.priority || 99) > (b?.relationType?.priority || 99)));
    return (
      <Row gutters>
        {currentMandates.map((mandate) => (
          <Col key={mandate.id} n="12 md-6">
            <RelationCard
              relation={mandate}
            />
          </Col>
        ))}
        {(currentMandates.length < data.data.length) && (
          <Col n="12 md-6">
            <GoToCard
              to={`/structures/${id}/gouvernance-et-referents`}
              title="Aller à la page gouvernance"
            />
          </Col>
        )}
      </Row>
    );
  };

  return (
    <Bloc
      isLoading={isLoading}
      error={error}
      data={{ totalCount: data?.data?.filter((mandate) => !mandate.endDate).filter((mandate) => (mandate?.relationType?.priority < 10))?.length || 0 }}
      hideOnEmptyView
    >
      <BlocTitle as="h3" look="h5">Gouvernance actuelle</BlocTitle>
      <BlocContent>
        {renderCurrentMandates()}
      </BlocContent>
    </Bloc>
  );
}
