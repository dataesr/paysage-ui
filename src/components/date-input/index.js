import {
  Tag,
  TagGroup,
  TextInput,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { forwardRef, useState } from 'react';

function fromApproximativeDate(d) {
  if (d?.length === 4) return `${d.toString()}-01-01`;
  if (d?.length === 7) return `${d.toString()}-01`;
  return d;
}

const DateInput = forwardRef((props, ref) => {
  const { value = '', onDateChange, ...rest } = props;
  const [approx, setApprox] = useState(value?.length || 10);

  const handleApproxChange = (n) => {
    setApprox(n);
    if (value) onDateChange(fromApproximativeDate(value).substring(0, n));
  };

  return (
    <>
      <TextInput
        className="fr-m-0"
        onChange={(e) => onDateChange(e.target.value.substring(0, approx))}
        ref={ref}
        type="date"
        value={fromApproximativeDate(value)}
        {...rest}
      />
      <TagGroup className="fr-mt-1w">
        <Tag size="sm" className="no-span" selected={approx === 10} onClick={() => handleApproxChange(10)}>Date exacte</Tag>
        <Tag size="sm" className="no-span" selected={approx === 7} onClick={() => handleApproxChange(7)}>Approximer au mois</Tag>
        <Tag size="sm" className="no-span" selected={approx === 4} onClick={() => handleApproxChange(4)}>Approximer à l'année</Tag>
      </TagGroup>
    </>
  );
});

DateInput.propTypes = {
  value: PropTypes.string,
  onDateChange: PropTypes.func.isRequired,
};
DateInput.defaultProps = {
  value: null,
};

export default DateInput;
