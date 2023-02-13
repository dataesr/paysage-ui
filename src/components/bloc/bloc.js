/* eslint-disable react/no-array-index-key */
import { Children } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Highlight, ButtonGroup, BadgeGroup, Badge } from '@dataesr/react-dsfr';
import { Spinner } from '../spinner';
import useEditMode from '../../hooks/useEditMode';
import { getComparableNow } from '../../utils/dates';

const isFinished = (relation) => (relation?.active === false) || (relation?.endDate < getComparableNow());

function calcultateCount(data) {
  const current = data?.filter((el) => (el.startDate < getComparableNow()) && !isFinished(el))?.length;
  const inactive = data?.filter((el) => isFinished(el))?.length;
  const forthcoming = data?.filter((el) => el.startDate > getComparableNow())?.length;

  return { current, inactive, forthcoming };
}

export default function Bloc({ children, data, error, isLoading, hideOnEmptyView, noBadge, isRelation }) {
  const { editMode } = useEditMode();
  const header = Children.toArray(children).find((child) => child.props.__TYPE === 'BlocTitle');
  const editActions = Children.toArray(children).filter((child) => (child.props.__TYPE === 'BlocActionButton' && child.props.edit));
  const viewActions = Children.toArray(children).filter((child) => (child.props.__TYPE === 'BlocActionButton' && !child.props.edit));
  const modals = Children.toArray(children).filter((child) => child.props.__TYPE === 'BlocModal');
  const blocContent = Children.toArray(children).find((child) => child.props.__TYPE === 'BlocContent');
  const { current, inactive, forthcoming } = calcultateCount(data?.data);
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
          {(editMode) && editActions.map((element, i) => <span key={i}>{element}</span>)}
          {((data?.totalCount > 0)) && viewActions.map((element, i) => <span key={i}>{element}</span>)}
        </ButtonGroup>
      </Row>
      {(isRelation && data?.totalCount > 1) && (
        <Row>
          <BadgeGroup>
            {forthcoming > 0 && (
              <Badge
                isSmall
                type="info"
                text={`Dont ${forthcoming} à venir`}
                spacing="ml-0"
              />
            ) }
            {current !== 0 && (
              <Badge
                isSmall
                type="success"
                text={`Dont ${current === 1 ? `${current} relation active` : `${current} relations actives` } `}
                spacing="mb-0"
              />
            ) }
            {inactive !== 0 && (
              <Badge
                isSmall
                type="inactive"
                colorFamily="brown-opera"
                text={`Dont ${inactive === 1 ? `${inactive} relation inactive` : `${inactive} relations inactives` } `}
                spacing="mb-0"
              />
            )}
          </BadgeGroup>
        </Row>
      )}
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
  error: PropTypes.bool,
  hideOnEmptyView: PropTypes.bool,
  isLoading: PropTypes.bool,
  isRelation: PropTypes.bool,
  noBadge: PropTypes.bool,
};

Bloc.defaultProps = {
  children: null,
  data: {},
  error: null,
  hideOnEmptyView: false,
  isLoading: null,
  isRelation: false,
  noBadge: false,
};
