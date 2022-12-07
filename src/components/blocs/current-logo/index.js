import { Col } from '@dataesr/react-dsfr';
import useUrl from '../../../hooks/useUrl';
import useGetLogo from './useGetLogo';
import styles from './styles.module.scss';

export default function CurrentLogos() {
  const { id } = useUrl();
  const logo = useGetLogo(id);

  if (!logo) return null;
  return (
    <Col n="12 lg-4">
      <div className="fr-card fr-card--xs fr-card--horizontal fr-card--grey fr-card--no-border">
        <div className="fr-card__body">
          <div className="fr-card__content flex flex--center flex--space-around">
            <img alt="logo" src={logo} className={styles.logo} />
          </div>
        </div>
      </div>
    </Col>
  );
}
