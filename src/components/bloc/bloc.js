/* eslint-disable react/no-array-index-key */
import { Children } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Highlight, ButtonGroup, Badge } from '@dataesr/react-dsfr';
import { Spinner } from '../spinner';
import useEditMode from '../../hooks/useEditMode';

export default function Bloc({ children, data, error, isLoading, hideOnEmptyView, noBadge }) {
  const { editMode } = useEditMode();
  const header = Children.toArray(children).find((child) => child.props.__TYPE === 'BlocTitle');
  const editActions = Children.toArray(children).filter((child) => (child.props.__TYPE === 'BlocActionButton' && child.props.edit));
  const viewActions = Children.toArray(children).filter((child) => (child.props.__TYPE === 'BlocActionButton' && !child.props.edit));
  const modals = Children.toArray(children).filter((child) => child.props.__TYPE === 'BlocModal');
  const blocContent = Children.toArray(children).find((child) => child.props.__TYPE === 'BlocContent');
  if (!editMode && !data?.totalCount && hideOnEmptyView) return null;
  return (
    <Container fluid className={`${(data?.totalCount > 0) && 'fr-mb-5w'}`} as="section">
      <Row className="flex--nowrap">
        <div className="flex--grow">
          <Row className="flex flex--start">
            {header}
            {!noBadge && <Badge className="fr-ml-1v" type="info" text={data?.totalCount} />}
          </Row>
        </div>
        {(editMode) && (<ButtonGroup size="sm" isInlineFrom="xs">{editActions.map((element, i) => <span key={i}>{element}</span>)}</ButtonGroup>)}
        {(!editMode && (data?.totalCount > 0)) && (<ButtonGroup size="sm" isInlineFrom="xs">{viewActions.map((element, i) => <span key={i}>{element}</span>)}</ButtonGroup>)}
      </Row>
      {isLoading && <Row className="fr-my-2w flex--space-around"><Spinner /></Row>}
      {error && <Highlight color="var(--page-border)">Une erreur s'est produite lors du chargement des données</Highlight>}
      {/* {(!error && !isLoading && !data?.totalCount) && <Highlight color="var(--page-border)">Cette section est vide pour le moment</Highlight>} */}
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
  hideOnEmptyView: PropTypes.bool,
  noBadge: PropTypes.bool,
};

Bloc.defaultProps = {
  children: null,
  data: {},
  isLoading: null,
  error: null,
  hideOnEmptyView: false,
  noBadge: false,
};
