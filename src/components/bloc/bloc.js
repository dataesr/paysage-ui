/* eslint-disable react/no-array-index-key */
import { Children } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Highlight, ButtonGroup, Badge } from '@dataesr/react-dsfr';
import { Spinner } from '../spinner';
import useEditMode from '../../hooks/useEditMode';

export default function Bloc({ children, data, error, isLoading, hideOnEmptyView, noBadge, forceActionDisplay, forceContentDisplay }) {
  const { editMode } = useEditMode();
  const header = Children.toArray(children).find((child) => child.props.__TYPE === 'BlocTitle');
  const editActions = Children.toArray(children).filter((child) => (child.props.__TYPE === 'BlocActionButton' && child.props.edit));
  const viewActions = Children.toArray(children).filter((child) => (child.props.__TYPE === 'BlocActionButton' && !child.props.edit));
  const filters = Children.toArray(children).filter((child) => (child.props.__TYPE === 'BlocFilter'));
  const gouvernanceFilters = Children.toArray(children).filter((child) => (child.props.__TYPE === 'BlocGouvernanceFilter'));
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
        <ButtonGroup size="sm" isInlineFrom="xs">
          {(editMode || forceActionDisplay) && editActions.map((element, i) => <span key={i}>{element}</span>)}
          {((data?.totalCount > 0)) && viewActions.map((element, i) => <span key={i}>{element}</span>)}
        </ButtonGroup>
      </Row>
      {(!isLoading && !error) && filters?.[0]}
      {(!isLoading && !error) && gouvernanceFilters?.[0]}

      {isLoading && <Row className="fr-my-2w flex--space-around"><Spinner /></Row>}
      {error && <Highlight color="var(--page-border)">Une erreur s'est produite lors du chargement des données</Highlight>}
      {(data?.totalCount || forceContentDisplay) ? blocContent : null}
      {modals}
    </Container>
  );
}

Bloc.propTypes = {
  children: PropTypes.node,
  data: PropTypes.object,
  error: PropTypes.bool,
  hideOnEmptyView: PropTypes.bool,
  isLoading: PropTypes.bool,
  noBadge: PropTypes.bool,
  forceActionDisplay: PropTypes.bool,
  forceContentDisplay: PropTypes.bool,
};

Bloc.defaultProps = {
  children: null,
  data: {},
  error: null,
  hideOnEmptyView: false,
  isLoading: null,
  noBadge: false,
  forceActionDisplay: false,
  forceContentDisplay: false,
};
