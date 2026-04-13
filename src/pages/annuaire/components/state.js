import { useSearchParams } from 'react-router-dom';
import { ButtonGroup, Icon, Row, Tag, TagGroup, Text } from '@dataesr/react-dsfr';
import Button from '../../../components/button';

function paramsToObject(entries) {
  const result = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of entries) {
    result[key] = value;
  }
  return result;
}

export default function State() {
  const [searchParams, setSearchParams] = useSearchParams({ limit: 1000 });

  const { limit, ...filters } = paramsToObject(searchParams);

  function deleteFilter(key, value) {
    if (!value) return;
    const newFilter = searchParams.get(key)?.split(',').filter((v) => v !== value).join(',');
    if (newFilter) searchParams.set(key, newFilter); else searchParams.delete(key);
    setSearchParams(searchParams);
  }

  if (!(Object.keys(filters)?.length > 0)) return <hr />;

  return (
    <>
      <hr />
      <Row className="fr-mb-1v" alignItems="top">
        <div style={{ flexGrow: 1, flexWrap: 1 }}>
          <Text bold className="fr-mr-1w fr-mb-1w fr-card__detail">
            Filtres actifs :
          </Text>
        </div>
        <ButtonGroup size="sm">
          <Button className="fr-mb-0" secondary onClick={() => setSearchParams({ limit: 1000 })}>Réinitialiser les filtres</Button>
        </ButtonGroup>
      </Row>
      <TagGroup>
        {Object.entries(filters || {}).map(([key, value]) => {
          if (!value) return null;
          const values = value.split(',');
          return values.map((v) => (
            <Tag
              key={`${key}-${v}`}
              onClick={() => deleteFilter(key, v)}
              className="fr-mb-1v"
            >
              {v}
              <Icon iconPosition="right" name="ri-close-line" />
            </Tag>
          ));
        })}
      </TagGroup>
      <hr className="fr-mt-0" />
    </>
  );
}
