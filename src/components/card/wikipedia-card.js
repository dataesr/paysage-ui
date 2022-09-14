import { Col, Link, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import './styles.modules.scss';

export default function WikipediaCard({
  lang,
  link,
}) {
  return (
    <div className="fr-card fr-enlarge-link fr-card--horizontal">
      <div className="fr-card__body">
        <div className="fr-card__content fr-py-1w">
          <Row>
            <Col n="4" className="fr-pt-2w fr-pb-2w">
              <img src="./wikipedia-fill.svg" alt="alt" />
            </Col>
            <Col className="fr-pt-2w">
              <h4 className="fr-card__title">
                {lang}
                <Link href={link} target="_blank" />
              </h4>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}

WikipediaCard.propTypes = {
  lang: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};
