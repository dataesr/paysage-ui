import { Col, Icon, Row, Title } from '@dataesr/react-dsfr';

import {
  Bloc,
  BlocContent,
} from '../../../../components/bloc';
import WeblinkCard from '../../../../components/card/weblink-card';
import useHashScroll from '../../../../hooks/useHashScroll';
import useUrl from '../../../../hooks/useUrl';

export default function StructureOffreDeFormationPage() {
  useHashScroll();
  const { id } = useUrl('keynumbers');

  return (
    <>
      <Title as="h3">
        <Icon name="ri-file-list-fill" className="fr-pl-1w" />
        Offre de formation
      </Title>
      {/* <Bloc isLoading={isLoading} error={error} data={data} noBadge> */}
      <Bloc data={{ totalCount: 42 }} noBadge>
        <BlocContent>
          <Row gutters>
            <Col n="12 md-6">
              <WeblinkCard
                title={(
                  <>
                    <Icon className="ri-table-line" />
                    Les formations dans Parcoursup (open data)
                  </>
                )}
                downloadUrl={`https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-cartographie_formations_parcoursup/table/?disjunctive.tf&disjunctive.nm&disjunctive.fl&disjunctive.amg&refine.etablissement_id_paysage=${id}&disjunctive.nmc&sort=-annee`}
              />
            </Col>
            <Col n="12 md-6">
              <WeblinkCard
                title={(
                  <>
                    <Icon className="ri-table-line" />
                    Les mentions dans Trouver Mon Master (TMM) (open data)
                  </>
                )}
                downloadUrl={`https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-tmm-donnees-du-portail-dinformation-trouver-mon-master-mentions-de-master/table/?disjunctive.for_modalite&disjunctive.for_lic_cons&refine.etablissement_id_paysage=${id}`}
              />
            </Col>
            <Col n="12 md-6">
              <WeblinkCard
                title={(
                  <>
                    <Icon className="ri-table-line" />
                    Les parcours dans Trouver Mon Master (TMM) (open data)
                  </>
                )}
                downloadUrl={`https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-tmm-donnees-du-portail-dinformation-trouver-mon-master-parcours-de-format/table/?refine.etablissement_id_paysage=${id}`}
              />
            </Col>
          </Row>
        </BlocContent>
      </Bloc>
    </>
  );
}
