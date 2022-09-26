import { Children } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Highlight, ButtonGroup } from '@dataesr/react-dsfr';
import Spinner from '../spinner';
import useEditMode from '../../hooks/useEditMode';

export default function Bloc({ children, data, error, isLoading }) {
  const { editMode } = useEditMode();
  const header = Children.toArray(children).find((child) => child.props.__TYPE === 'BlocTitle');
  const actions = Children.toArray(children).filter((child) => child.props.__TYPE === 'BlocActionButton');
  const modals = Children.toArray(children).filter((child) => child.props.__TYPE === 'BlocModal');
  const blocContent = Children.toArray(children).find((child) => child.props.__TYPE === 'BlocContent');

  return (
    <Container fluid className="fr-mb-5w" as="section">
      <Row className="flex--nowrap">
        <div className="flex--grow">{header}</div>
        {(editMode) && (<ButtonGroup size="sm" isInlineFrom="xs">{actions.map((element) => <div key={element.id}>{element}</div>)}</ButtonGroup>)}
      </Row>
      {isLoading && <Row className="fr-my-2w flex--space-around"><Spinner /></Row>}
      {error && <Highlight color="var(--page-border)">Une erreur s'est produite lors du chargement des données</Highlight>}
      {(!error && !isLoading && !data?.totalCount) && <Highlight color="var(--page-border)">Cette section est vide pour le moment</Highlight>}
      {data?.totalCount ? blocContent : null}
      {modals}
    </Container>
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
