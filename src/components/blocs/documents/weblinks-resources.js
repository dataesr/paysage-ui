import PropTypes from 'prop-types';
import { Icon } from '@dataesr/react-dsfr';
import useFetch from '../../../hooks/useFetch';
import Bloc from '../../bloc/bloc';
import BlocContent from '../../bloc/bloc-content';
import BlocTitle from '../../bloc/bloc-title';
import ExpendableListCards from '../../card/expendable-list-cards';

const mapping = {
  hceres: "Rapport d'évaluation HCERES",
  jorfsearch: 'Page JORFSearch',
  PiaWEB: 'Données PiaWEB',
  RechercheDataGouv: 'Recherche data gouv',
  DataWarehouse: 'Entrepôt de données institutionnel',
};

export default function WeblinksResources({ resourceId }) {
  const { data, isLoading, error } = useFetch(`/structures/${resourceId}/weblinks?filters[type][$in]=hceres&filters[type][$in]=PiaWEB&filters[type][$in]=jorfsearch`);

  const cards = data?.data?.filter((el) => Object.keys(mapping).includes(el.type)).map((el) => (
    <div key={el.id} className="fr-card fr-card--sm fr-card--grey fr-card--no-border">
      <div className="fr-card__body fr-enlarge-link">
        <div className="fr-card__content">
          <div className="flex-col flex--center">
            <Icon
              className="fr-mb-1w fr-pt-1w"
              name="ri-global-line"
              size="3x"
              color="var(--structures-color)"
            />
            <span className="fr-text fr-text--sm fr-text--bold fr-m-0 flex-col">
              <a
                className="fr-mb-0 fr-text fr-text--sm text-center"
                href={el.url}
                target="_blank"
                rel="noreferrer"
              >
                {mapping[el.type]}
              </a>
              <span className="only-print">{el.url}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  ));

  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h2" look="h6">Ressources externes</BlocTitle>
      <BlocContent>
        <ExpendableListCards max={10000} nCol="12 sm-6 md-4" list={cards} />
      </BlocContent>
    </Bloc>
  );
}

WeblinksResources.propTypes = {
  resourceId: PropTypes.string.isRequired,
};
