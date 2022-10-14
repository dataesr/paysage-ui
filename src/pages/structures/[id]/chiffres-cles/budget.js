import { Col, Icon, Row, Text, Title } from '@dataesr/react-dsfr';

import {
  Bloc,
  BlocContent,
  BlocTitle,
} from '../../../../components/bloc';
import Card from '../../../../components/card';
import ExpendableListCards from '../../../../components/card/expendable-list-cards';
import WeblinkCard from '../../../../components/card/weblink-card';
import Spinner from '../../../../components/spinner';
import useFetch from '../../../../hooks/useFetch';
import useHashScroll from '../../../../hooks/useHashScroll';
import cleanNumber from '../../../../hooks/useNumbers';
import useUrl from '../../../../hooks/useUrl';

export default function StructureBudgetPage() {
  useHashScroll();
  const { id, url } = useUrl('keynumbers');
  const { data, isLoading, error } = useFetch(`${url}/finance`);

  const sortedData = data?.data.sort((a, b) => b.exercice - a.exercice) || [];
  const lastData = (Number(sortedData?.[0]?.exercice) === new Date().getFullYear()) ? sortedData?.[1] : sortedData?.[0];
  const year = lastData?.exercice;

  const financialBalance = [{
    info: 'Le résultat net comptable mesure les ressources nettes restant à l\'établissement à l\'issue de l\'exercice',
    suffix: '€',
    text: 'Résultat net comptable',
    value: lastData?.resultat_net_comptable,
  }, {
    info: 'Résultat de l\'établissement hors SIE (périmètre agrégé)',
    suffix: '€',
    text: 'Résultat net comptable hors SIE',
    value: lastData?.resultat_net_comptable_hors_sie,
  }, {
    info: 'Excédent dégagé pendant l\'exercice qui permettra d\'assurer tout ou partie de l\'investissement de l\'année et d\'augmenter le fonds de roulement.',
    suffix: '€',
    text: 'Capacité d\'autofinancement',
    value: lastData?.capacite_d_autofinancement,
  }, {
    info: 'Produits de l\'exercice qui se traduit par un encaissement',
    suffix: '€',
    text: 'Produits de fonctionnement encaissables',
    value: lastData?.produits_de_fonctionnement_encaissables,
  }, {
    info: 'Part de la CAF dans les produits encaissables',
    suffix: ' %',
    text: 'CAF / Produits encaissables',
    value: lastData?.caf_produits_encaissables,
  }];

  const operatingCycle = [{
    info: 'Le besoin en fonds de roulement mesure le décalage entre les encaissements et les décaissements du cycle d\'activité',
    suffix: '€',
    text: 'Besoin en fonds de roulement',
    value: lastData?.besoin_en_fonds_de_roulement,
  }, {
    info: 'Fonds de roulement exprimé en jours de dépenses de fonctionnement décaissables',
    suffix: ' jours',
    text: 'Fonds de roulement en jours de charges décaissables',
    value: lastData?.fonds_de_roulement_en_jours_de_charges_decaissables,
  }, {
    info: 'Ressource mise à disposition de l\'établissement pour financer des emplois (investissements). Il constitue une marge de sécurité financière destinée à financer une partie de l\'actif circulant',
    suffix: '€',
    text: 'Fonds de roulement net global',
    value: lastData?.fonds_de_roulement_net_global,
  }, {
    info: 'Liquidités immédiatement disponibles (caisse, banque, Valeurs Mobilières de Placement)',
    suffix: '€',
    text: 'Trésorerie',
    value: lastData?.tresorerie,
  }, {
    info: 'Expression de la trésorerie en nombre de jours de dépenses de fonctionnement décaissables',
    suffix: ' jours',
    text: 'Trésorerie en jours de charges décaissables',
    value: lastData?.tresorerie_en_jours_de_charges_decaissables,
  }];

  const activityFinancing = [{
    info: 'Charges de l\'exercice qui donnent lieu à un décaissement',
    suffix: '€',
    text: 'Charges de fonctionnement décaissables',
    value: lastData?.charges_de_fonctionnement_decaissables,
  }, {
    info: 'Part des charges décaissables dans les produits encaissables',
    suffix: ' %',
    text: 'Charges décaissables / Produits encaissables',
    value: lastData?.charges_decaissables_produits_encaissables,
  }, {
    info: 'Poids des dépenses de personnel au regard des produits encaissables',
    suffix: ' %',
    text: 'Dépenses de personnel / Produits encaissables',
    value: lastData?.depenses_de_personnel_produits_encaissables,
  }, {
    info: 'Produits de fonctionnement encaissables hors subvention pour charges de service public',
    suffix: '€',
    text: 'Recettes propres',
    value: lastData?.recettes_propres,
  }, {
    info: 'Poids des ressources propres au sein des recettes encaissables',
    suffix: ' %',
    text: 'Ressources propres / Produits encaissables',
    value: lastData?.ressources_propres_produits_encaissables,
  }, {
    suffix: '€',
    text: 'Ressources propres encaissables',
    value: lastData?.ressources_propres_encaissables,
  }, {
    info: 'Rémunération des personnels permanents / total des dépenses de personnel',
    suffix: ' %',
    text: 'Taux de rémunération des permanents',
    value: lastData?.taux_de_remuneration_des_permanents,
  }];

  const investmentsSelfFinancing = [{
    info: 'Ensemble des investissements réalisés au cours de l\'exercice',
    suffix: '€',
    text: 'Acquisitions d\'immobilisations',
    value: lastData?.acquisitions_d_immobilisations,
  }, {
    info: 'Part de la capacité d\'autofinancement permettant de financer les investissements de l\'exercice',
    suffix: ' %',
    text: 'CAF / Acquisitions d\'immobilisations',
    value: lastData?.caf_acquisitions_d_immobilisations,
  }, {
    info: 'Excédent dégagé pendant l\'exercice qui permettra d\'assurer tout ou partie de l\'investissement de l\'année et d\'augmenter le fonds de roulement.',
    suffix: '€',
    text: 'Capacité d\'autofinancement',
    value: lastData?.capacite_d_autofinancement,
  }];

  const gbcpIndicators = [{
    info: 'Solde des encaissements et des décaissements sur opérations budgétaires',
    suffix: '€',
    text: 'Solde budgétaire',
    value: lastData?.solde_budgetaire,
  }];

  const trainingRevenues = [{
    suffix: '€',
    text: 'Droits d\'inscription',
    value: lastData?.droits_d_inscription,
  }, {
    suffix: '€',
    text: 'Formation continue, diplômes propres et VAE',
    value: lastData?.formation_continue_diplomes_propres_et_vae,
  }, {
    suffix: '€',
    text: 'Taxe d\'apprentissage',
    value: lastData?.taxe_d_apprentissage,
  }];

  const researchRevenues = [{
    suffix: '€',
    text: 'Valorisation',
    value: lastData?.valorisation,
  }, {
    suffix: '€',
    text: 'ANR hors investissements d\'avenir',
    value: lastData?.anr_hors_investissements_d_avenir,
  }, {
    suffix: '€',
    text: 'ANR investissements d\'avenir',
    value: lastData?.anr_investissements_d_avenir,
  }, {
    suffix: '€',
    text: 'Contrats et prestations de recherche hors ANR',
    value: lastData?.contrats_et_prestations_de_recherche_hors_anr,
  }];

  const otherRevenues = [{
    suffix: '€',
    text: 'Subventions de la région',
    value: lastData?.subventions_de_la_region,
  }, {
    suffix: '€',
    text: 'Subventions Union Européenne',
    value: lastData?.subventions_union_europeenne,
  }, {
    suffix: '€',
    text: 'Autres ressources propres',
    value: lastData?.autres_ressources_propres,
  }, {
    suffix: '€',
    text: 'Autres subventions',
    value: lastData?.autres_subventions,
  }];

  const renderCards = (all) => {
    const list = all
      .filter((item) => item?.value)
      .map((item) => {
        let { value } = item;
        value = cleanNumber(value);
        value = item?.suffix ? `${value} ${item.suffix}` : value;
        return (
          <Card
            title={value}
            descriptionElement={(
              <Row alignItems="middle">
                <Text spacing="mr-1v mb-0">
                  {item.text}
                  {item?.info && (
                    <Icon name="ri-information-fill" className="fr-pl-1w" title={item.info} />
                  )}
                </Text>
              </Row>
            )}
          />
        );
      });
    return <ExpendableListCards list={list} nCol="12 md-4" max="99" />;
  };

  if (isLoading) return <Spinner size={48} />;
  if (error) return <>Erreur...</>;
  return (
    <>
      <Title as="h3">
        <Icon name="ri-scales-3-fill" className="fr-pl-1w" />
        {`Données financières - Situation en ${year}`}
      </Title>
      <Bloc isLoading={isLoading} error={error} data={data} noBadge>
        <BlocTitle as="h4">
          Equilibre financier
        </BlocTitle>
        <BlocContent>
          {renderCards(financialBalance)}
        </BlocContent>
      </Bloc>
      <Bloc isLoading={isLoading} error={error} data={data} noBadge>
        <BlocTitle as="h4">
          Cycle d'exploitation
        </BlocTitle>
        <BlocContent>
          {renderCards(operatingCycle)}
        </BlocContent>
      </Bloc>
      <Bloc isLoading={isLoading} error={error} data={data} noBadge>
        <BlocTitle as="h4">
          Financement de l'activité
        </BlocTitle>
        <BlocContent>
          {renderCards(activityFinancing)}
        </BlocContent>
      </Bloc>
      <Bloc isLoading={isLoading} error={error} data={data} noBadge>
        <BlocTitle as="h4">
          Autofinancement des investissements
        </BlocTitle>
        <BlocContent>
          {renderCards(investmentsSelfFinancing)}
        </BlocContent>
      </Bloc>
      <Bloc isLoading={isLoading} error={error} data={data} noBadge>
        <BlocTitle as="h4">
          Indicateurs GBCP
        </BlocTitle>
        <BlocContent>
          {renderCards(gbcpIndicators)}
        </BlocContent>
      </Bloc>
      <Bloc isLoading={isLoading} error={error} data={data} noBadge>
        <BlocTitle as="h4">
          Recettes formation
        </BlocTitle>
        <BlocContent>
          {renderCards(trainingRevenues)}
        </BlocContent>
      </Bloc>
      <Bloc isLoading={isLoading} error={error} data={data} noBadge>
        <BlocTitle as="h4">
          Recettes recherche
        </BlocTitle>
        <BlocContent>
          {renderCards(researchRevenues)}
        </BlocContent>
      </Bloc>
      <Bloc isLoading={isLoading} error={error} data={data} noBadge>
        <BlocTitle as="h4">
          Autres recettes
        </BlocTitle>
        <BlocContent>
          {renderCards(otherRevenues)}
        </BlocContent>
      </Bloc>
      <Bloc isLoading={isLoading} error={error} data={data} noBadge>
        <BlocTitle as="h4">
          Ressources en ligne : #dataESR
        </BlocTitle>
        <BlocContent>
          <Row gutters>
            <Col n="12 md-6">
              <WeblinkCard
                title={(
                  <>
                    <Icon className="ri-table-line" />
                    Tableau de bord financier
                  </>
                )}
                downloadUrl="https://dataesr.fr/FR/T445/P844/tableau_de_bord_financier_-_finance"
              />
            </Col>
            <Col n="12 md-6">
              <WeblinkCard
                title={(
                  <>
                    <Icon className="ri-table-line" />
                    Données en open data
                  </>
                )}
                downloadUrl={`https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-operateurs-indicateurs-financiers/table/?sort=exercice&refine.etablissement_id_paysage=${id}`}
              />
            </Col>
          </Row>
        </BlocContent>
      </Bloc>
    </>
  );
}
