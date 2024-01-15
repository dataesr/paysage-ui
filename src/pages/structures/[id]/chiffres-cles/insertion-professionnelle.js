import { Col, Icon, Row, Title } from '@dataesr/react-dsfr';

import { useEffect, useState } from 'react';
import {
  Bloc,
  BlocContent,
  BlocTitle,
} from '../../../../components/bloc';
import WeblinkCard from '../../../../components/card/weblink-card';
import { Spinner } from '../../../../components/spinner';
import useFetch from '../../../../hooks/useFetch';
import useUrl from '../../../../hooks/useUrl';

export default function StructureInsertionProfessionnellePage() {
  const { id } = useUrl('keynumbers');
  const { url } = useUrl('identifiers');
  const { error, isLoading } = useFetch(url);
  const [inserSup, setInserSup] = useState({ totalCount: 0 });
  const [ipDoc, setIpDoc] = useState({ totalCount: 0 });
  const [licenceInser, setLicenceInser] = useState({ totalCount: 0 });
  const [masterInser, setMasterInser] = useState({ totalCount: 0 });

  useEffect(() => {
    fetch(`https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr-esr-insersup/records?limit=0&refine=id_paysage:"${id}"`)
      .then((response) => response.json())
      .then((data) => {
        const totalCount = data && data.total_count ? data.total_count : 0;
        setInserSup({ totalCount });
      });

    // eslint-disable-next-line max-len
    fetch(`https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr-esr-insertion-professionnelle-des-diplomes-doctorat-par-etablissement/records?limit=0&refine=paysage:"${id}"`)
      .then((response) => response.json())
      .then((data) => {
        const totalCount = data && data.total_count ? data.total_count : 0;
        setIpDoc({ totalCount });
      });

    fetch(`https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr-esr-insertion_professionnelle-lp/records?limit=20&refine=id_paysage:"${id}"`)
      .then((response) => response.json())
      .then((data) => {
        const totalCount = data && data.total_count ? data.total_count : 0;
        setLicenceInser({ totalCount });
      });
    fetch(`https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr-esr-insertion_professionnelle-master/records?limit=20&refine=id_paysage:"${id}"`)
      .then((response) => response.json())
      .then((data) => {
        const totalCount = data && data.total_count ? data.total_count : 0;
        setMasterInser({ totalCount });
      });
  }, [id]);

  if (inserSup.totalCount === 0 && ipDoc.totalCount === 0 && licenceInser.totalCount === 0 && masterInser.totalCount === 0) {
    return (
      <Title as="h2">
        Pas de données sur l'insertion professionnelle
      </Title>
    );
  }

  if (isLoading) return <Spinner size={48} />;
  if (error) return <>Erreur...</>;

  return (
    <>
      <Title>
        <Icon name="ri-building-fill" className="fr-pl-1w" />
        Insertion professionnelle
      </Title>
      <Bloc isLoading={false} error={false} data={{ totalCount: 42 }} noBadge>
        <BlocTitle as="h3">
          Ressource(s) en ligne : #dataESR
        </BlocTitle>
        <BlocContent>
          {inserSup.totalCount > 0
          && (
            <>
              <Title as="h2" look="h5" className="fr-mb-2w">
                Dispositif InserSup
              </Title>
              <Row spacing="mb-5v">
                <Col n="12 md-6">
                  <WeblinkCard
                    title={(
                      <>
                        <Icon className="ri-grid-line" />
                        Donnée sur l'insertion professionnelle des diplômés en open data
                      </>
                    )}
                    // eslint-disable-next-line max-len
                    downloadUrl={`https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-insersup/table/?disjunctive.source&disjunctive.reg_id&disjunctive.aca_id&disjunctive.id_paysage&disjunctive.id_paysage_actuel&disjunctive.etablissement&disjunctive.type_diplome&disjunctive.dom&disjunctive.discipli&disjunctive.sectdis&disjunctive.diplome&disjunctive.date_inser&sort=-promo&refine.id_paysage=${id}`}
                    canEdit={false}
                  />
                </Col>
              </Row>
            </>
          )}
          {licenceInser.totalCount > 0
          && (
            <>
              <Title as="h2" look="h5" className="fr-mb-2w">
                Enquête insertion professionnelle
              </Title>
              <Row spacing="mb-5v">
                <Col n="12 md-6">
                  <WeblinkCard
                    title={(
                      <>
                        <Icon className="ri-table-line" />
                        Insertion professionnelle des diplômés de Licence professionnelle LMD
                      </>
                    )}
                    // eslint-disable-next-line max-len
                    downloadUrl={`https://data.enseignementsup-recherche.gouv.fr/pages/insertion_historique_etab_lp/?refine.id_paysage=${id}`}
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
                    // eslint-disable-next-line max-len
                    downloadUrl={`https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-insertion_professionnelle-lp/table/?disjunctive.numero_de_l_etablissement&disjunctive.academie&refine.id_paysage=${id}&sort=-annee`}
                    canEdit={false}
                  />
                </Col>
              </Row>
            </>
          )}
          {masterInser.totalCount > 0 && (
            <Row spacing="mb-1v">
              <Col n="12 md-6">
                <WeblinkCard
                  title={(
                    <>
                      <Icon className="ri-table-line" />
                      Insertion professionnelle des diplômés de Master LMD
                    </>
                  )}
                  // eslint-disable-next-line max-len
                  downloadUrl={`https://data.enseignementsup-recherche.gouv.fr/pages/insertion_historique_etab_master/?refine.id_paysage=${id}`}
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
                  // eslint-disable-next-line max-len
                  downloadUrl={`https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-insertion_professionnelle-master/table/?disjunctive.numero_de_l_etablissement&disjunctive.academie&refine.id_paysage=${id}&sort=-annee`}
                  canEdit={false}
                />
              </Col>
            </Row>
          )}
          {ipDoc.totalCount > 0 && (
            <>
              <Title as="h2" look="h5" className="fr-mb-2w">
                IpDoc
              </Title>
              { id && (
                <Row spacing="mb-1v">
                  <Col n="12 md-6">
                    <WeblinkCard
                      title={(
                        <>
                          <Icon className="ri-grid-line" />
                          Données sur l'insertion professionnelle des diplômés de doctorat en open data
                        </>
                      )}
                      // eslint-disable-next-line max-len
                      downloadUrl={`https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-insertion-professionnelle-des-diplomes-doctorat-par-etablissement/table/?sort=-annee&refine.paysage=${id}`}
                      canEdit={false}
                    />
                  </Col>
                </Row>
              )}
            </>
          )}
        </BlocContent>
      </Bloc>
    </>
  );
}
