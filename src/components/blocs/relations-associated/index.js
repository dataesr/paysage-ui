import PropTypes from 'prop-types';
import RelationCard from '../../card/relation-card';
import ExpendableListCards from '../../card/expendable-list-cards';
import { Bloc, BlocContent, BlocTitle } from '../../bloc';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';

export default function RelationsAssociated({ blocName, tag }) {
  const { id: resourceId } = useUrl();
  const url = `/relations?filters[relationTag]=${tag}&filters[otherAssociatedObjectIds]=${resourceId}&limit=200`;
  const { data, isLoading, error } = useFetch(url);

  const renderCards = () => {
    if (!data && !data?.data?.length) return null;
    const list = data.data.map((element) => (
      <RelationCard relation={element} />
    ));
    return (
      <ExpendableListCards list={list} nCol="12 md-6" />
    );
  };

  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h3" look="h6">{blocName || tag}</BlocTitle>
      <BlocContent>{renderCards()}</BlocContent>
    </Bloc>
  );
}

RelationsAssociated.propTypes = {
  blocName: PropTypes.string,
  tag: PropTypes.string.isRequired,
};

RelationsAssociated.defaultProps = {
  blocName: '',
};