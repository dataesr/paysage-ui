import { useNavigate } from 'react-router-dom';
import { Tag, TagGroup } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';

export default function GeographicalExceptionsTags({ data }) {
  const navigate = useNavigate();

  if (!data) return null;

  if (data.length === 0) {
    return null;
  }

  return (
    <TagGroup>
      {data.map((category) => (
        <Tag
          size="md"
          iconPosition="right"
          icon="ri-arrow-right-line"
          onClick={() => navigate(`/categories-geographiques/${category.id}`)}
          key={category.id}
        >
          {category.nameFr}
        </Tag>
      ))}
    </TagGroup>
  );
}

GeographicalExceptionsTags.propTypes = {
  data: PropTypes.array,
};

GeographicalExceptionsTags.defaultProps = {
  data: [],
};
