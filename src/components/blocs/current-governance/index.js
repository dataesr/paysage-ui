import { Row, Col } from '@dataesr/react-dsfr';
import { Bloc, BlocContent, BlocTitle } from '../../bloc';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import RelationCard from '../../card/relation-card';
import GoToCard from '../../card/go-to-card';
import { getComparableNow } from '../../../utils/dates';
import { GOUVERNANCE as tag } from '../../../utils/relations-tags';

const MANDATE_PRIORITY_THRESHOLD = 10;

export default function StructureCurrentGovernance() {
  const { id } = useUrl();
  const { data, isLoading, error } = useFetch(`/relations?filters[resourceId]=${id}&filters[relationTag]=${tag}&limit=500&sort=relationType.priority`);

  if (!data?.data?.length > 0) return null;
  const currentMandates = data?.data
    .filter((mandate) => (!mandate.endDate || (mandate.endDate >= getComparableNow())))
    .filter((mandate) => (mandate?.relationType?.priority < MANDATE_PRIORITY_THRESHOLD));

  return (
    <Bloc
      isLoading={isLoading}
      error={error}
      data={{ totalCount: currentMandates?.length || 0 }}
      hideOnEmptyView
    >
      <BlocTitle as="h3" look="h5">Gouvernance actuelle</BlocTitle>
      <BlocContent>
        <Row gutters>
          {currentMandates.map((mandate) => (
            <Col key={mandate.id} n="12 md-6">
              <RelationCard relation={mandate} />
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
      </BlocContent>
    </Bloc>
  );
}
