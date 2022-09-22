/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-unused-prop-types */
import { Children, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Highlight } from '@dataesr/react-dsfr';
import Spinner from '../spinner';
import useEditMode from '../../hooks/useEditMode';

export default function Bloc({ children, data, error, isLoading }) {
  const { editMode } = useEditMode();
  const [content, setContent] = useState(null);
  const header = Children.toArray(children).find((child) => child.props.__TYPE === 'BlocTitle');
  const action = Children.toArray(children).find((child) => child.props.__TYPE === 'BlocActionButton');
  const modal = Children.toArray(children).find((child) => child.props.__TYPE === 'BlocModal');
  const blocContent = Children.toArray(children).find((child) => child.props.__TYPE === 'BlocContent');

  useEffect(() => {
    if (isLoading) setContent(<Row className="fr-my-2w flex--space-around"><Spinner /></Row>);
    if (error) setContent(<Highlight style={{ borderColor: 'var(--border-color)' }}>Une erreur s'est produite au chargement des données</Highlight>);
    if (!data?.data?.length) setContent(<Highlight style={{ borderColor: 'var(--border-color)' }}>Cette section est vide pour le moment</Highlight>);
    if (data?.data?.length) setContent(blocContent);
  }, [data, error, isLoading]);

  return (
    <div className="fr-container-fluid fr-mb-5w" as="section">
      <Row className="flex--nowrap flex--last-baseline">
        <div className="flex--grow">{header}</div>
        {editMode && (<div>{action}</div>)}
      </Row>
      {content}
      {modal}
    </div>
  );
}

Bloc.propTypes = {
  children: PropTypes.node,
  data: PropTypes.object,
  isLoading: PropTypes.bool,
  error: PropTypes.bool,
};

Bloc.defaultProps = {
  children: null,
  data: null,
  isLoading: null,
  error: null,
};
