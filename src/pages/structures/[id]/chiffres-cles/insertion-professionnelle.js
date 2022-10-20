import { Col, Icon, Row, Title } from '@dataesr/react-dsfr';

import {
  Bloc,
  BlocContent,
  BlocTitle,
} from '../../../../components/bloc';
import WeblinkCard from '../../../../components/card/weblink-card';
import Spinner from '../../../../components/spinner';
import useFetch from '../../../../hooks/useFetch';
import useUrl from '../../../../hooks/useUrl';

export default function StructureInsertionProfessionnellePage() {
  const { id } = useUrl('keynumbers');
  const { url } = useUrl('identifiers');
  const { data, error, isLoading } = useFetch(url);
  const uai = data?.data.filter((item) => item.type === 'UAI')?.[0];

  if (isLoading) return <Spinner size={48} />;
  if (error) return <>Erreur...</>;
  return (
    <>
      <Title as="h3">
        <Icon name="ri-building-fill" className="fr-pl-1w" />
        Insertion professionnelle
      </Title>
      <Bloc isLoading={false} error={false} data={{ totalCount: 42 }} noBadge>
        <BlocTitle as="h4">
          Ressource(s) en ligne : #dataESR
        </BlocTitle>
        <BlocContent>
          <Row gutters>
            <Col n="12 md-6">
              <WeblinkCard
                title={(
                  <>
                    <Icon className="ri-table-line" />
                    Insertion professionnelle des diplômés de Licence professionnelle LMD
                  </>
                )}
                downloadUrl={`https://data.enseignementsup-recherche.gouv.fr/pages/insertion_professionnelle_etablissements/?disjunctive.discipline2&refine.diplome=LICENCE_PRO&refine.id_paysage=${id}&sort=code_de_la_discipline`}
                canEdit={false}
              />
            </Col>
            <Col n="12 md-6">
              <WeblinkCard
                title={(
                  <>
                    <Icon className="ri-grid-line" />
                    Données sur l'insertion professionnelle des diplômés de Licence professionnelle en open data
                  </>
                )}
                downloadUrl={`https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-insertion_professionnelle-lp/table/?disjunctive.numero_de_l_etablissement&disjunctive.academie&refine.id_paysage=${id}&sort=-annee`}
                canEdit={false}
              />
            </Col>
            <Col n="12 md-6">
              <WeblinkCard
                title={(
                  <>
                    <Icon className="ri-table-line" />
                    Insertion professionnelle des diplômés de Master LMD
                  </>
                )}
                downloadUrl={`https://data.enseignementsup-recherche.gouv.fr/pages/insertion_professionnelle_etablissements/?disjunctive.discipline2&refine.diplome=MASTER_LMD&refine.annee=2019&refine.id_paysage=${id}&sort=code_de_la_discipline`}
                canEdit={false}
              />
            </Col>
            <Col n="12 md-6">
              <WeblinkCard
                title={(
                  <>
                    <Icon className="ri-grid-line" />
                    Données sur l'insertion professionnelle des diplômés de Master LMD en open data
                  </>
                )}
                downloadUrl={`https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-insertion_professionnelle-master/table/?disjunctive.numero_de_l_etablissement&disjunctive.academie&refine.id_paysage=${id}&sort=-annee`}
                canEdit={false}
              />
            </Col>
            { uai?.value && (
              <Col n="12 md-6">
                <WeblinkCard
                  title={(
                    <>
                      <Icon className="ri-grid-line" />
                      Données sur l'insertion professionnelle des diplômés de doctorat en open data
                    </>
                  )}
                  downloadUrl={`https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-insertion-professionnelle-des-diplomes-doctorat-par-etablissement/table/?sort=-annee&refine.numero_uai_ori=${uai.value}`}
                  canEdit={false}
                />
              </Col>
            )}
          </Row>
        </BlocContent>
      </Bloc>
    </>
  );
}
