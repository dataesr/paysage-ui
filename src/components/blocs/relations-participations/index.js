import { Col, Badge, Row, BadgeGroup } from '@dataesr/react-dsfr';
import ExpendableListCards from '../../card/expendable-list-cards';
import { Bloc, BlocContent, BlocTitle } from '../../bloc';

import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import RelationCard from '../../card/relation-card';
import { getComparableNow } from '../../../utils/dates';

export default function RelationsParticipations() {
  const { id: resourceId } = useUrl();
  const url = `/relations?filters[relatedObjectId]=${resourceId}&filters[relationsGroupId][$exists]&sort=relatedObject.collection=true&limit=100`;
  const { data, isLoading, error } = useFetch(url);

  const renderCards = () => {
    if (!data && !data?.data?.length) return null;
    const actives = data.data
      .filter((element) => (
        (element.active === true)
      || (element.endDate > getComparableNow())
      || (element.startDate > getComparableNow())
      || (element.startDate < getComparableNow() && element.endDate > getComparableNow())
      || (element.startDate < getComparableNow() && !element.endDate && element.active !== false)
      || (element.startDate === null && element.endDate === null && element.active !== false)
      )).sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    const activesIds = actives.map((element) => element.id);

    const inactives = data.data.filter((element) => (!activesIds.includes(element.id)));

    const orderedList = [...actives, ...inactives];
    const isComing = actives.filter((el) => el.startDate > getComparableNow());

    const list = orderedList.map((element) => (
      <RelationCard
        relation={element}
        onEdit={null}
        inverse
      />
    ));
    return (
      <Row gutters>
        {(actives.length > 0 && inactives.length > 0) && (
          <Col n="12">
            <Col n="12">
              <BadgeGroup>
                {isComing.length > 0 && (
                  <Badge
                    isSmall
                    type="info"
                    text={`Dont ${isComing.length === 1 ? `${isComing.length} relation à venir` : `${isComing.length} relations à venir` } `}
                    spacing="ml-0"
                  />
                ) }
                {actives.length > 0 && (
                  <Badge
                    isSmall
                    type="success"
                    text={`Dont ${actives.length - isComing.length === 1 ? `${actives.length - isComing.length} relation active` : `${actives.length - isComing.length} relations actives` } `}
                    spacing="mb-0"
                  />
                ) }
                {inactives.length > 0 && (
                  <Badge
                    isSmall
                    type="inactive"
                    colorFamily="brown-opera"
                    text={`Dont ${inactives.length === 1 ? `${inactives.length} relation inactive` : `${inactives.length} relations inactives` } `}
                    spacing="mb-0"
                  />
                )}

              </BadgeGroup>
            </Col>
          </Col>

        )}
        <Col n="12">
          <ExpendableListCards list={list} nCol="12 md-6" />
        </Col>
      </Row>
    );
  };
  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h3" look="h6">Participations</BlocTitle>
      <BlocContent>{renderCards()}</BlocContent>
    </Bloc>
  );
}
