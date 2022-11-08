/* eslint-disable react/no-unused-prop-types */
import PropTypes from 'prop-types';
import { Title } from '@dataesr/react-dsfr';

import typeValidation from '../../utils/type-validation';

export default function BlocTitle({ __TYPE, children, ...rest }) {
  return <Title {...rest}>{children}</Title>;
}

BlocTitle.propTypes = {
  __TYPE: typeValidation('BlocTitle'),
  children: PropTypes.node,
};

BlocTitle.defaultProps = {
  __TYPE: 'BlocTitle',
  children: null,
};
