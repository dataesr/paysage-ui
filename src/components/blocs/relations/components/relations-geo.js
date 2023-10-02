import PropTypes from 'prop-types';
import ExpendableListCards from '../../../card/expendable-list-cards';
import { Bloc, BlocContent, BlocTitle } from '../../../bloc';
import useFetch from '../../../../hooks/useFetch';
import useUrl from '../../../../hooks/useUrl';
import GeoRelationCard from '../../../card/geo-relation-card';

export default function RelationGeo({ blocName }) {
  const { id: resourceId } = useUrl();
  const url = `/structures/${resourceId}/localisations`;
  const { data, isLoading, error } = useFetch(url);

  const geographicalCategoriesData = data?.data;

  const renderCards = () => {
    const uniqueCategories = [];

    geographicalCategoriesData?.forEach((element) => {
      element.geoCategories.forEach((category) => {
        if (!uniqueCategories.some((c) => c.id === category.id)) {
          uniqueCategories.push(category);
        }
      });
    });

    const list = uniqueCategories.map((category) => (
      <GeoRelationCard key={category.id} element={category} />
    ));

    return <ExpendableListCards list={list} nCol="12 md-6" />;
  };

  return (
    <Bloc isLoading={isLoading} error={error} data={data} isRelation>
      <BlocTitle as="h3" look="h6">{blocName}</BlocTitle>
      <BlocContent>
        {renderCards()}
      </BlocContent>
    </Bloc>
  );
}

RelationGeo.propTypes = {
  blocName: PropTypes.string,

};

RelationGeo.defaultProps = {
  blocName: '',
};
