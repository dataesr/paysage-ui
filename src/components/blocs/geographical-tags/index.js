import { useNavigate } from 'react-router-dom';
import { Tag, TagGroup } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { GEOGRAPHICAL_CATEGORIES_LABELS_MAPPER } from '../../../utils/constants';

export default function GeographicalTags({ data }) {
  const navigate = useNavigate();

  const sortedLevels = ['country', 'region', 'department', 'city', 'academy', 'urbanUnity'];
  data?.sort((a, b) => sortedLevels.indexOf(a?.level) - sortedLevels.indexOf(b?.level));

  if (!data) return null;

  if (data.length === 0) {
    return null;
  }
  return (
    <TagGroup>
      {data.map((categoryGeo) => (
        <Tag
          size="md"
          iconPosition="right"
          icon="ri-arrow-right-line"
          onClick={() => navigate(`/categories-geographiques/${categoryGeo.id}`)}
          key={categoryGeo.id}
        >
          {`${GEOGRAPHICAL_CATEGORIES_LABELS_MAPPER[categoryGeo.level]} : ${categoryGeo.nameFr}`}
        </Tag>
      ))}
    </TagGroup>
  );
}

GeographicalTags.propTypes = {
  data: PropTypes.array,
};

GeographicalTags.defaultProps = {
  data: [],
};
