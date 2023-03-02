import { Row, Col } from '@dataesr/react-dsfr';
import { Bloc, BlocContent, BlocTitle } from '../../bloc';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import GoToCard from '../../card/go-to-card';
import { RelationsByTag } from '../relations';
import { STRUCTURE_CATEGORIE } from '../../../utils/relations-tags';

export default function RelationCurrent() {
  const { id } = useUrl();
  const { data, isLoading, error } = useFetch(`/relations?filters[relationTag]=structure-categorie&filters[relatedObjectId]=${id}&limit=2000&sort=-startDate`);
  if (!data?.data?.length > 0) return null;
  const renderCurrentRelations = () => (
    <Row>
      <Col n="12">
        <RelationsByTag
          tag={STRUCTURE_CATEGORIE}
          blocName="Structures associées"
          noRelationType
          inverse
          max={6}
        />
        {data.data.length > 0 && <Col n="12 md-6"><GoToCard to={`/categories/${id}/elements-lies`} title="Aller vers tous les éléments liés" /></Col>}
      </Col>
    </Row>
  );
  return (
    <Bloc isLoading={isLoading} error={error} data={{ totalCount: data?.data?.filter((relations) => !relations.endDate)?.length || 0 }}>
      <BlocTitle as="h3" look="h4">Elements liés</BlocTitle>
      <BlocContent>
        {renderCurrentRelations()}
      </BlocContent>
    </Bloc>
  );
}
