import { Col, Icon, Link, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import './styles.modules.scss';

export default function Card({
  title,
  iconElement,
  descriptionElement,
  onClick,
  downloadUrl,
}) {
  return (
    <div className="fr-card fr-enlarge-link fr-card--horizontal">
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
                <h4 className="fr-card__title">
                  {title}
                  <Link href={downloadUrl} target="_blank" />
                </h4>
              ) : null}
              <div className="fr-card__desc">{descriptionElement}</div>
              <div className="card-button">
                <button onClick={onClick} type="button">
                  <Icon className="ri-edit-line" size="lg" />
                </button>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string,
  descriptionElement: PropTypes.element,
  onClick: PropTypes.func.isRequired,
  downloadUrl: PropTypes.string.isRequired,
  iconElement: PropTypes.element,
};

Card.defaultProps = {
  title: '',
  descriptionElement: null,
  iconElement: null,
};
