import {
  Tag,
  TagGroup,
  TextInput,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { forwardRef, useState } from 'react';

const fromApproximativeDate = (d) => {
  if (d?.length === 4) return `${d.toString()}-01-01`;
  if (d?.length === 7) return `${d.toString()}-01`;
  return d;
};

const getCurrentDate = () => new Date().toISOString().split('T')[0];

const DateInput = forwardRef((props, ref) => {
  const { value = '', onDateChange, ...rest } = props;
  const [selected, setSelected] = useState(() => {
    if (value === getCurrentDate()) return 0;
    if (value?.length === 7) return 2;
    if (value?.length === 4) return 3;
    return 1;
  });

  const setDate = (option, tmp) => {
    setSelected(option);
    let date;
    switch (option) {
    case 0:
      date = getCurrentDate();
      break;
    case 1:
      date = tmp;
      break;
    case 2:
      date = fromApproximativeDate(tmp).substring(0, 7);
      break;
    case 3:
      date = fromApproximativeDate(tmp).substring(0, 4);
      break;
    default:
      date = undefined;
    }
    onDateChange(date);
  };

  return (
    <>
      <TextInput
        className="fr-m-0"
        onChange={(e) => setDate(1, e.target.value)}
        ref={ref}
        type="date"
        value={fromApproximativeDate(value)}
        {...rest}
      />
      <TagGroup className="fr-mt-1w">
        <Tag size="sm" className="no-span" selected={selected === 0} onClick={() => setDate(0, value)}>
          Aujourd'hui
        </Tag>
        <Tag size="sm" className="no-span" selected={selected === 1} onClick={() => setDate(1, value)}>
          Date exacte
        </Tag>
        <Tag size="sm" className="no-span" selected={selected === 2} onClick={() => setDate(2, value)}>
          Approximer au mois
        </Tag>
        <Tag size="sm" className="no-span" selected={selected === 3} onClick={() => setDate(3, value)}>
          Approximer à l'année
        </Tag>
      </TagGroup>
    </>
  );
});

DateInput.propTypes = {
  onDateChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};
DateInput.defaultProps = {
  value: null,
};

export default DateInput;
