import { Col, Icon, Row, Title } from '@dataesr/react-dsfr';
import { useEffect, useState } from 'react';
import { Bloc, BlocContent } from '../../../../components/bloc';
import WeblinkCard from '../../../../components/card/weblink-card';
import useUrl from '../../../../hooks/useUrl';

export default function StructureOffreDeFormationPage() {
  const { id } = useUrl('keynumbers');
  const [formationCount, setFormationCount] = useState({ totalCount: 0 });

  useEffect(() => {
    if (id) {
      // eslint-disable-next-line max-len
      fetch(`https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr-esr-principaux-diplomes-et-formations-prepares-etablissements-publics/records?limit=20&refine=etablissement_id_paysage:${id}`)
        .then((response) => response.json())
        .then((data) => {
          const totalCount = data && data.total_count ? data.total_count : 0;
          setFormationCount({ totalCount });
        });
    }
  }, [id]);
  if (formationCount.totalCount === 0) {
    return (
      <Title as="h2">
        Pas de données sur les offres de formations
      </Title>
    );
  }

  return (
    <>
      <Title as="h2">
        <Icon name="ri-file-list-fill" className="fr-pl-1w" />
        Offre de formation
      </Title>
      <Bloc data={{ totalCount: 42 }} noBadge>
        <BlocContent>
          <Row gutters>
            {formationCount.totalCount > 0 && (
              <>
                <Col n="12 md-6">
                  <WeblinkCard
                    title={(
                      <>
                        <Icon className="ri-table-line" />
                        Les formations dans Parcoursup (open data)
                      </>
                    )}
                    downloadUrl={`https://data.enseignementsup-recherche.gouv.fr
                      /explore/dataset/fr-esr-cartographie_formations_parcoursup
                      /table/?disjunctive.tf&disjunctive.nm&disjunctive.fl&disjunctive.amg&refine.etablissement_id_paysage=${id}&disjunctive.nmc&sort=-annee`
                      .replace(/\s/g, '')}
                    canEdit={false}
                  />
                </Col>
                <Col n="12 md-6">
                  <WeblinkCard
                    title={(
                      <>
                        <Icon className="ri-table-line" />
                        Liste des principaux diplômes et formations préparés en open data
                      </>
                    )}
                    downloadUrl={`https://data.enseignementsup-recherche.gouv.fr
                      /explore/dataset/fr-esr-principaux-diplomes-et-formations-prepares-etablissements-publics/table/?refine.etablissement_id_paysage=${id}`
                      .replace(/\s/g, '')}
                    canEdit={false}
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
                    downloadUrl={`https://data.enseignementsup-recherche.gouv.fr
                      /explore/dataset/fr-esr-tmm-donnees-du-portail-dinformation
                      -trouver-mon-master-mentions-de-master/table/?disjunctive.for_modalite&disjunctive.for_lic_cons&refine.etablissement_id_paysage=${id}`
                      .replace(/\s/g, '')}
                    canEdit={false}
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
                    downloadUrl={`https://data.enseignementsup-recherche.gouv.fr
                      /explore/dataset/fr-esr-tmm-donnees-du-portail-dinformation-trouver-mon-master-parcours-de-format/table/?refine.etablissement_id_paysage=${id}`
                      .replace(/\s/g, '')}
                    canEdit={false}
                  />
                </Col>
              </>
            )}
          </Row>
        </BlocContent>
      </Bloc>
    </>
  );
}
