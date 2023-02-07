import { Col, Icon, Row, Text, Title } from '@dataesr/react-dsfr';

import {
  Bloc,
  BlocContent,
  BlocTitle,
} from '../../../../components/bloc';
import Card from '../../../../components/card';
import ExpendableListCards from '../../../../components/card/expendable-list-cards';
import WeblinkCard from '../../../../components/card/weblink-card';
import { Spinner } from '../../../../components/spinner';
import useFetch from '../../../../hooks/useFetch';
import useUrl from '../../../../hooks/useUrl';
import cleanNumber from '../../../../utils/clean-numbers';

export default function StructureBudgetPage() {
  const { id, url } = useUrl('keynumbers');
  const { data, error, isLoading } = useFetch(`${url}/finance?sort=-exercice&limit=2`);

  const lastIndex = Math.max((data?.data?.length || 0) - 1, 0);
  const beforeLastData = data?.data?.[lastIndex] || {};
  const beforeLastYear = beforeLastData?.exercice;
  const lastData = data?.data?.[lastIndex - 1] || {};
  const lastYear = lastData?.exercice;

  const financialBalance = [{
    field: 'resultat_net_comptable',
    info: 'Le résultat net comptable mesure les ressources nettes restant à l\'établissement à l\'issue de l\'exercice',
    suffix: '€',
    text: 'Résultat net comptable',
    thresholdRed: 0,
    thresholdSort: 'asc',
  }, {
    field: 'resultat_net_comptable_hors_sie',
    info: 'Résultat de l\'établissement hors SIE (périmètre agrégé)',
    suffix: '€',
    text: 'Résultat net comptable hors SIE',
    thresholdRed: 0,
    thresholdSort: 'asc',
  }, {
    field: 'capacite_d_autofinancement',
    info: 'Excédent dégagé pendant l\'exercice qui permettra d\'assurer tout ou partie de l\'investissement de l\'année et d\'augmenter le fonds de roulement.',
    suffix: '€',
    text: 'Capacité d\'autofinancement',
    thresholdRed: 0,
    thresholdSort: 'asc',
  }, {
    field: 'produits_de_fonctionnement_encaissables',
    info: 'Produits de l\'exercice qui se traduit par un encaissement',
    suffix: '€',
    text: 'Produits de fonctionnement encaissables',
    thresholdGreen: 1,
    thresholdRed: 0.5,
    thresholdSort: 'asc',
  }, {
    field: 'caf_produits_encaissables',
    info: 'Part de la CAF dans les produits encaissables',
    suffix: ' %',
    text: 'CAF / Produits encaissables',
    thresholdGreen: 1,
    thresholdRed: 0.5,
    thresholdSort: 'asc',
  }];

  const operatingCycle = [{
    field: 'besoin_en_fonds_de_roulement',
    info: 'Le besoin en fonds de roulement mesure le décalage entre les encaissements et les décaissements du cycle d\'activité',
    suffix: '€',
    text: 'Besoin en fonds de roulement',
  }, {
    field: 'fonds_de_roulement_en_jours_de_charges_decaissables',
    info: 'Fonds de roulement exprimé en jours de dépenses de fonctionnement décaissables',
    suffix: ' jours',
    text: 'Fonds de roulement en jours de charges décaissables',
    thresholdGreen: 30,
    thresholdRed: 25,
    thresholdSort: 'asc',
  }, {
    field: 'fonds_de_roulement_net_global',
    info: `Ressource mise à disposition de l'établissement pour financer des emplois (investissements). 
Il constitue une marge de sécurité financière destinée à financer une partie de l'actif circulant`,
    suffix: '€',
    text: 'Fonds de roulement net global',
    thresholdRed: 0,
    thresholdSort: 'asc',
  }, {
    field: 'tresorerie',
    info: 'Liquidités immédiatement disponibles (caisse, banque, Valeurs Mobilières de Placement)',
    suffix: '€',
    text: 'Trésorerie',
    thresholdRed: 0,
    thresholdSort: 'asc',
  }, {
    field: 'tresorerie_en_jours_de_charges_decaissables',
    info: 'Expression de la trésorerie en nombre de jours de dépenses de fonctionnement décaissables',
    suffix: ' jours',
    text: 'Trésorerie en jours de charges décaissables',
    thresholdGreen: 30,
    thresholdRed: 25,
    thresholdSort: 'asc',
  }];

  const activityFinancing = [{
    field: 'charges_de_fonctionnement_decaissables',
    info: 'Charges de l\'exercice qui donnent lieu à un décaissement',
    suffix: '€',
    text: 'Charges de fonctionnement décaissables',
  }, {
    field: 'charges_decaissables_produits_encaissables',
    info: 'Part des charges décaissables dans les produits encaissables',
    suffix: ' %',
    text: 'Charges décaissables / Produits encaissables',
    thresholdGreen: 98,
    thresholdRed: 100,
    thresholdSort: 'desc',
  }, {
    field: 'depenses_de_personnel_produits_encaissables',
    info: 'Poids des dépenses de personnel au regard des produits encaissables',
    suffix: ' %',
    text: 'Dépenses de personnel / Produits encaissables',
    thresholdGreen: 82,
    thresholdRed: 83,
    thresholdSort: 'desc',
  }, {
    field: 'recettes_propres',
    info: 'Produits de fonctionnement encaissables hors subvention pour charges de service public',
    suffix: '€',
    text: 'Recettes propres',
    thresholdGreen: 15,
    thresholdRed: 13,
    thresholdSort: 'asc',
  }, {
    field: 'ressources_propres_produits_encaissables',
    info: 'Poids des ressources propres au sein des recettes encaissables',
    suffix: ' %',
    text: 'Ressources propres / Produits encaissables',
    thresholdGreen: 15,
    thresholdRed: 13,
    thresholdSort: 'asc',
  }, {
    field: 'ressources_propres_encaissables',
    suffix: '€',
    text: 'Ressources propres encaissables',
  }, {
    field: 'taux_de_remuneration_des_permanents',
    info: 'Rémunération des personnels permanents / total des dépenses de personnel',
    suffix: ' %',
    text: 'Taux de rémunération des permanents',
    thresholdGreen: 83,
    thresholdRed: 85,
    thresholdSort: 'desc',
  }];

  const investmentsSelfFinancing = [{
    field: 'acquisitions_d_immobilisations',
    info: 'Ensemble des investissements réalisés au cours de l\'exercice',
    suffix: '€',
    text: 'Acquisitions d\'immobilisations',
    thresholdGreen: 30,
    thresholdRed: 20,
    thresholdSort: 'asc',
  }, {
    field: 'caf_acquisitions_d_immobilisations',
    info: 'Part de la capacité d\'autofinancement permettant de financer les investissements de l\'exercice',
    suffix: ' %',
    text: 'CAF / Acquisitions d\'immobilisations',
    thresholdGreen: 30,
    thresholdRed: 20,
    thresholdSort: 'asc',
  }, {
    field: 'capacite_d_autofinancement',
    info: 'Excédent dégagé pendant l\'exercice qui permettra d\'assurer tout ou partie de l\'investissement de l\'année et d\'augmenter le fonds de roulement.',
    suffix: '€',
    text: 'Capacité d\'autofinancement',
    thresholdRed: 0,
    thresholdSort: 'asc',
  }];

  const gbcpIndicators = [{
    field: 'solde_budgetaire',
    info: 'Solde des encaissements et des décaissements sur opérations budgétaires',
    suffix: '€',
    text: 'Solde budgétaire',
  }];

  const trainingRevenues = [{
    field: 'droits_d_inscription',
    suffix: '€',
    text: 'Droits d\'inscription',
  }, {
    field: 'formation_continue_diplomes_propres_et_vae',
    suffix: '€',
    text: 'Formation continue, diplômes propres et VAE',
  }, {
    field: 'taxe_d_apprentissage',
    suffix: '€',
    text: 'Taxe d\'apprentissage',
  }];

  const researchRevenues = [{
    field: 'valorisation',
    suffix: '€',
    text: 'Valorisation',
  }, {
    field: 'anr_hors_investissements_d_avenir',
    suffix: '€',
    text: 'ANR hors investissements d\'avenir',
  }, {
    field: 'anr_investissements_d_avenir',
    suffix: '€',
    text: 'ANR investissements d\'avenir',
  }, {
    field: 'contrats_et_prestations_de_recherche_hors_anr',
    suffix: '€',
    text: 'Contrats et prestations de recherche hors ANR',
  }];

  const otherRevenues = [{
    field: 'subventions_de_la_region',
    suffix: '€',
    text: 'Subventions de la région',
  }, {
    field: 'subventions_union_europeenne',
    suffix: '€',
    text: 'Subventions Union Européenne',
  }, {
    field: 'autres_ressources_propres',
    suffix: '€',
    text: 'Autres ressources propres',
  }, {
    field: 'autres_subventions',
    suffix: '€',
    text: 'Autres subventions',
  }];

  const getIconColorAndTooltip = (item) => {
    const difference = lastData?.[item?.field];
    let color;
    let tooltip = '';
    if (difference) {
      if (item.thresholdSort === 'asc') {
        if (difference < item.thresholdRed) {
          color = 'pink-tuile';
          tooltip += `Seuil d'alerte : Valeur < ${item.thresholdRed}`;
        }
        if (item.thresholdRed <= difference && difference <= item.thresholdGreen) {
          color = 'yellow-tournesol';
          tooltip += `Seuil de vigilance : ${item.thresholdRed} ≤ Valeur ≤ ${item.thresholdGreen}`;
        }
      }
      if (item.thresholdSort === 'desc') {
        if (difference > item.thresholdRed) {
          color = 'pink-tuile';
          tooltip += `Seuil d'alerte : Valeur > ${item.thresholdRed}`;
        }
        if (item.thresholdGreen <= difference && difference <= item.thresholdRed) {
          color = 'yellow-tournesol';
          tooltip += `Seuil de vigilance : ${item.thresholdGreen} ≤ Valeur ≤ ${item.thresholdRed}`;
        }
      }
    }
    return { color, tooltip };
  };

  const renderCards = (all) => {
    const list = all
      .filter((item) => beforeLastData?.[item?.field])
      .map((item) => {
        let difference = lastData?.[item?.field];
        if (difference) {
          difference = cleanNumber(difference);
          difference = item?.suffix ? `${difference}${item.suffix}` : difference;
        }
        let value = beforeLastData?.[item?.field];
        value = cleanNumber(value);
        value = item?.suffix ? `${value}${item.suffix}` : value;
        const { color, tooltip } = getIconColorAndTooltip(item);
        return (
          <Card
            subtitle={difference && (
              <div title={`Budget ${lastYear}`}>
                (Budget
                {' '}
                {lastYear}
                {' '}
                :&ensp;
                {difference}
                {color && (<Icon name={`ri-stop-fill fr-badge--${color}`} className="fr-ml-1w fr-mr-0 fr-icon--sm" title={tooltip} />)}
                )
              </div>
            )}
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
      {!data?.data?.length && (
        <Title as="h3">
          Pas de données financières pour cette structure
        </Title>
      )}
      {!!data?.data?.length && (
        <>
          <Title as="h3">
            <Icon name="ri-scales-3-fill" className="fr-pl-1w" />
            {`Données financières - Situation en ${beforeLastYear}${beforeLastData?.source === 'Budget' ? ' (Budget)' : ''}`}
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
                    canEdit={false}
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
                    canEdit={false}
                  />
                </Col>
              </Row>
            </BlocContent>
          </Bloc>
        </>
      )}
    </>
  );
}
