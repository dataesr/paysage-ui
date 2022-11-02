import { useState } from 'react';
import PropTypes from 'prop-types';
import { TagGroup } from '@dataesr/react-dsfr';
import Button from '../button';

export default function TagList({ children, maxTags, className }) {
  const [showAll, setShowAll] = useState(false);
  if (!children?.length) return null;
  return (
    <>
      <TagGroup className={className}>
        {showAll && children}
        {!showAll && children.slice(0, maxTags)}
      </TagGroup>
      {(children?.length > maxTags) && (
        <Button icon={`ri-${showAll ? 'subtract' : 'add'}-line`} iconPosition="left" tertiary borderless type="button" size="sm" onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Réduire la liste' : 'Voir tout'}
        </Button>
      )}
    </>
  );
}

TagList.propTypes = {
  children: PropTypes.array,
  maxTags: PropTypes.number,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
};

TagList.defaultProps = {
  maxTags: 6,
  children: [],
  className: '',
};
