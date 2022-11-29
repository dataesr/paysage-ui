import { Link } from 'react-router-dom';
import { ReactComponent as TechErrorSVG } from '../../assets/technical-error.svg';

export default function Error500() {
  return (
    <div className="fr-container">
      <div className="fr-my-7w fr-mt-md-12w fr-mb-md-10w fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-grid-row--center">
        <div className="fr-py-0 fr-col-12 fr-col-md-6">
          <h1>Erreur inattendue</h1>
          <p className="fr-text--sm fr-mb-3w">Erreur 500</p>
          <p className="fr-text--lead fr-mb-3w">Essayez de rafraichir la page ou bien ressayez plus tard.</p>
          <p className="fr-text--sm fr-mb-5w">
            Désolé, le service rencontre un problème, nous travaillons pour le résoudre le plus rapidement possible.
          </p>
          <ul className="fr-btns-group fr-btns-group--inline-md">
            <li>
              <Link className="fr-btn fr-btn--secondary" to="/nous-contacter">
                Contactez-nous
              </Link>
            </li>
          </ul>
        </div>
        <div className="fr-col-12 fr-col-md-3 fr-col-offset-md-1 fr-px-6w fr-px-md-0 fr-py-0">
          <TechErrorSVG />
        </div>
      </div>
    </div>
  );
}
