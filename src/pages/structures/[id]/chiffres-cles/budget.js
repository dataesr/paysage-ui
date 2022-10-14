import { Icon, Row, Text, Title } from '@dataesr/react-dsfr';

import {
  Bloc,
  BlocContent,
  BlocTitle,
} from '../../../../components/bloc';
import Card from '../../../../components/card';
import ExpendableListCards from '../../../../components/card/expendable-list-cards';
import Spinner from '../../../../components/spinner';
import useFetch from '../../../../hooks/useFetch';
import useHashScroll from '../../../../hooks/useHashScroll';
import cleanNumber from '../../../../hooks/useNumbers';
import useUrl from '../../../../hooks/useUrl';

export default function StructureBudgetPage() {
  useHashScroll();
  const { url } = useUrl('keynumbers');
  const { data, isLoading, error } = useFetch(`${url}/finance`);

  const sortedData = data?.data.sort((a, b) => b.exercice - a.exercice) || [];
  const lastData = sortedData?.[0];
  const year = lastData?.exercice;

  const financialBalance = [{
    key: 'Résultat net comptable',
    value: `${cleanNumber(lastData?.resultat_net_comptable).toLocaleString('fr-FR')}€`,
    info: 'Le résultat net comptable mesure les ressources nettes restant à l’établissement à l’issue de l’exercice',
  }, {
    key: 'Résultat net comptable hors SIE',
    value: `${cleanNumber(lastData?.resultat_net_comptable_hors_sie)}€`,
    info: 'Résultat de l’établissement hors SIE (périmètre agrégé)',
  }, {
    key: 'Capacité d’autofinancement',
    value: `${cleanNumber(lastData?.capacite_d_autofinancement)}€`,
    info: 'Excédent dégagé pendant l’exercice qui permettra d’assurer tout ou partie de l’investissement de l’année et d’augmenter le fonds de roulement.',
  }, {
    key: 'CAF / Produits encaissables',
    value: `${cleanNumber(lastData?.caf_produits_encaissables)} %`,
    info: 'Part de la CAF dans les produits encaissables',
  }];

  const operatingCycle = [{
    key: 'Besoin en fonds de roulement',
    value: `${cleanNumber(lastData?.besoin_en_fonds_de_roulement)}€`,
    info: 'Le besoin en fonds de roulement mesure le décalage entre les encaissements et les décaissements du cycle d’activité',
  }, {
    key: 'Fonds de roulement en jours de charges décaissables',
    value: `${cleanNumber(lastData?.fonds_de_roulement_en_jours_de_charges_decaissables)} jours`,
    info: 'Fonds de roulement exprimé en jours de dépenses de fonctionnement décaissables',
  }, {
    key: 'Fonds de roulement net global',
    value: `${cleanNumber(lastData?.fonds_de_roulement_net_global)}€`,
    info: 'Ressource mise à disposition de l’établissement pour financer des emplois (investissements). Il constitue une marge de sécurité financière destinée à financer une partie de l’actif circulant',
  }, {
    key: 'Trésorerie',
    value: `${cleanNumber(lastData?.tresorerie)}€`,
    info: 'Liquidités immédiatement disponibles (caisse, banque, Valeurs Mobilières de Placement)',
  }, {
    key: 'Trésorerie en jours de charges décaissables',
    value: `${cleanNumber(lastData?.tresorerie_en_jours_de_charges_decaissables)} jours`,
    info: 'Expression de la trésorerie en nombre de jours de dépenses de fonctionnement décaissables',
  }];

  const activityFinancing = [{
    key: 'Charges décaissables / Produits encaissables',
    value: `${cleanNumber(lastData?.charges_decaissables_produits_encaissables)} %`,
    info: 'Part des charges décaissables dans les produits encaissables',
  }, {
    key: 'Dépenses de personnel / Produits encaissables',
    value: `${cleanNumber(lastData?.depenses_de_personnel_produits_encaissables)} %`,
    info: 'Poids des dépenses de personnel au regard des produits encaissables',
  }, {
    key: 'Ressources propres / Produits encaissables',
    value: `${cleanNumber(lastData?.ressources_propres_produits_encaissables)} %`,
    info: 'Poids des ressources propres au sein des recettes encaissables',
  }, {
    key: 'Taux de rémunération des permanents',
    value: `${cleanNumber(lastData?.taux_de_remuneration_des_permanents)} %`,
    info: 'Rémunération des personnels permanents / total des dépenses de personnel',
  }];

  const investmentsSelfFinancing = [{
    key: 'CAF / Acquisitions d’immobilisations',
    value: `${cleanNumber(lastData?.caf_acquisitions_d_immobilisations)} %`,
    info: 'Part de la capacité d’autofinancement permettant de financer les investissements de l’exercice',
  }, {
    key: 'Capacité d’autofinancement',
    value: `${cleanNumber(lastData?.capacite_d_autofinancement)}€`,
    info: 'Excédent dégagé pendant l’exercice qui permettra d’assurer tout ou partie de l’investissement de l’année et d’augmenter le fonds de roulement.',
  }];

  const gbcpIndicators = [{
    key: 'Solde budgétaire',
    value: `${cleanNumber(lastData?.solde_budgetaire)}€`,
    info: 'Solde des encaissements et des décaissements sur opérations budgétaires',
  }];

  const renderCards = (all) => {
    const list = all.map((el) => (
      <Card
        title={(
          <>
            <span>{el.key}</span>
            <Icon name="ri-information-fill" className="fr-pr-1w" title={el.info} />
          </>
        )}
        descriptionElement={(
          <Row alignItems="middle">
            <Text spacing="mr-1v mb-0">{el.value}</Text>
          </Row>
        )}
      />
    ));
    return <ExpendableListCards list={list} nCol="12 md-4" />;
  };

  if (isLoading) return <Spinner size={48} />;
  if (error) return <>Erreur...</>;
  return (
    <Bloc isLoading={isLoading} error={error} data={data} noBadge>
      <BlocTitle as="h3" look="h6">
        {`Données financières - Situation en ${year}`}
      </BlocTitle>
      <BlocContent>
        <Title as="h3" look="h6">
          Equilibre financier
        </Title>
        {renderCards(financialBalance)}
        <Title as="h3" look="h6">
          Cycle d'exploitation
        </Title>
        {renderCards(operatingCycle)}
        <Title as="h3" look="h6">
          Financement de l'activité
        </Title>
        {renderCards(activityFinancing)}
        <Title as="h3" look="h6">
          Autofinancement des investissements
        </Title>
        {renderCards(investmentsSelfFinancing)}
        <Title as="h3" look="h6">
          Indicateurs GBCP
        </Title>
        {renderCards(gbcpIndicators)}
        <Title as="h3" look="h6">
          Ressources en ligne : #dataESR
        </Title>
      </BlocContent>
    </Bloc>
  );
}
