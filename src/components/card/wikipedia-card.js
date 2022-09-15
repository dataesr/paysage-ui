import { Col, Link, Row, Title } from '@dataesr/react-dsfr';
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
              <img src="/icons/logo/wikipedia-fill.svg" alt="" style={{ height: '40px' }} />
            </Col>
            <Col className="fr-pt-2w fr-pl-2w">
              <Title as="h4" look="h2">
                {lang}
                <Link href={link} target="_blank" />
              </Title>
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
