import { Col, Icon, Link, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';

import './styles.modules.scss';

export default function WeblinkCard({
  title,
  iconElement,
  descriptionElement,
  onClick,
  downloadUrl,
}) {
  return (
    <div className="fr-card fr-enlarge-link fr-card--horizontal show-bt-on-over">
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
              <div className="card-button">
                <button onClick={onClick} type="button" className="bt-visible-on-over">
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

WeblinkCard.propTypes = {
  descriptionElement: PropTypes.element,
  downloadUrl: PropTypes.string.isRequired,
  iconElement: PropTypes.element,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string,
};

WeblinkCard.defaultProps = {
  descriptionElement: null,
  iconElement: null,
  title: '',
};
