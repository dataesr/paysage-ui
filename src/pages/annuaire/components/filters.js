import { useSearchParams } from 'react-router-dom';
import { BadgeGroup, Col, Row, SearchableSelect, Text } from '@dataesr/react-dsfr';
import useFetch from '../../../hooks/useFetch';
import ActionBadge from '../../../components/badge/action-badge';

export default function Filters() {
  const [searchParams, setSearchParams] = useSearchParams({ limit: 1000 });

  const { data: aggs } = useFetch('/annuaire/aggregations');
  const relationTypesOptions = (aggs?.relationTypes?.map((element) => ({ label: element, value: element }))) || [];
  const categoriesOptions = (aggs?.categories?.map((element) => ({ label: element, value: element }))) || [];
  const mandateTypeGroupOptions = (aggs?.mandateTypeGroups?.map((element) => ({ label: element, value: element }))) || [];
  const structuresOptions = (aggs?.structures?.map((element) => ({ label: element, value: element }))) || [];

  function addFilter(key, value) {
    if (!value) return;
    if (!searchParams.get(key)) {
      searchParams.set(key, value);
      setSearchParams(searchParams);
    } else {
      const temp = searchParams.get(key).split(',');
      temp.push(value);
      searchParams.set(key, [...new Set(temp)].join(','));
      setSearchParams(searchParams);
    }
  }

  return (
    <Row className="fr-mb-2w" gutters alignItems="top">
      <Col n="12 md-6">
        <SearchableSelect
          hint="Sélection multiple possible"
          label="Groupe de fonction"
          options={mandateTypeGroupOptions}
          onChange={(v) => addFilter('mandateTypeGroup', v)}
          tabIndex={0}
          className="fr-mb-1v"
          placeholder="Rechercher des groupes de fonctions..."
        />
        <Row alignItems="bottom">
          <Text className="fr-mb-0 fr-mr-1w" as="span" bold size="sm">Raccourcis :</Text>
          <BadgeGroup>
            <ActionBadge className="fr-mb-0" isSmall colorFamily="purple-glycine" onClick={() => addFilter('mandateTypeGroup', 'Équipe de direction')}>
              Équipe de direction
            </ActionBadge>
            <ActionBadge className="fr-mb-0" isSmall colorFamily="purple-glycine" onClick={() => addFilter('catmandateTypeGroupegory', 'Cabinet')}>
              Cabinet
            </ActionBadge>
          </BadgeGroup>
        </Row>
      </Col>
      <Col n="12 md-6">
        <SearchableSelect
          hint="Sélection multiple possible"
          multiple
          label="Fonction"
          options={relationTypesOptions}
          onChange={(v) => addFilter('relationType', v)}
          tabIndex={0}
          className="fr-mb-1v"
          placeholder="Rechercher des fonctions..."
        />
        <Row alignItems="bottom">
          <Text className="fr-mb-0 fr-mr-1w" as="span" bold size="sm">Raccourcis :</Text>
          <BadgeGroup>
            <ActionBadge className="fr-mb-0" isSmall colorFamily="purple-glycine" onClick={() => addFilter('relationType', 'Présidente/Président')}>
              Président
            </ActionBadge>
            <ActionBadge className="fr-mb-0" isSmall colorFamily="purple-glycine" onClick={() => addFilter('relationType', 'Directrice générale/directeur général des services')}>
              Directeur général des services
            </ActionBadge>
          </BadgeGroup>
        </Row>
      </Col>
      <Col n="12 md-6">
        <SearchableSelect
          hint="Sélection multiple possible"
          label="Catégorie de l'établissement"
          options={categoriesOptions}
          selected=""
          onChange={(v) => addFilter('category', v)}
          tabIndex={0}
          className="fr-mb-1v"
          placeholder="Rechercher des catégories..."
        />
        <Row alignItems="bottom">
          <Text className="fr-mb-0 fr-mr-1w" as="span" bold size="sm">Raccourcis :</Text>
          <BadgeGroup>
            <ActionBadge className="fr-mb-0" isSmall colorFamily="purple-glycine" onClick={() => addFilter('category', 'Université')}>
              Université
            </ActionBadge>
            <ActionBadge className="fr-mb-0" isSmall colorFamily="purple-glycine" onClick={() => addFilter('category', 'Établissement public expérimental')}>
              Établissement public expérimental
            </ActionBadge>
          </BadgeGroup>
        </Row>
      </Col>
      <Col n="12 md-6">
        <SearchableSelect
          hint="Sélection multiple possible"
          label="Établissement"
          options={structuresOptions}
          onChange={(v) => addFilter('structure', v)}
          tabIndex={0}
          placeholder="Rechercher des établissements..."
        />
      </Col>
    </Row>
  );
}
