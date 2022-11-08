import { Col, Link, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import useEditMode from '../../hooks/useEditMode';
import Button from '../button';
import './styles.module.scss';

export default function WeblinkCard({
  canEdit,
  descriptionElement,
  downloadUrl,
  iconElement,
  onClick,
  title,
}) {
  const { editMode } = useEditMode();
  return (
    <div className="fr-card fr-enlarge-link fr-card--horizontal fr-card--grey show-bt-on-over">
      <div className="fr-card__body">
        <div className="fr-card__content fr-py-1w">
          <Row>
            {iconElement && (
              <Col n="4" className="fr-pt-2w">
                {iconElement}
              </Col>
            )}
            <Col>
              {title ? (
                <h4 className="fr-card__title text-center">
                  {title}
                  <Link href={downloadUrl} target="_blank" />
                </h4>
              ) : null}
              <div className="fr-card__desc">{descriptionElement}</div>
              {editMode && canEdit && (
                <div className="card-button">
                  <Button
                    className="bt-visible-on-over"
                    size="sm"
                    onClick={onClick}
                    color="text"
                    tertiary
                    borderless
                    rounded
                    icon="ri-edit-line"
                  />
                </div>
              )}
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}

WeblinkCard.propTypes = {
  canEdit: PropTypes.bool,
  descriptionElement: PropTypes.element,
  downloadUrl: PropTypes.string.isRequired,
  iconElement: PropTypes.element,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string,
};

WeblinkCard.defaultProps = {
  canEdit: true,
  descriptionElement: null,
  iconElement: null,
  title: '',
};
