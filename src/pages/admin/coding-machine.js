import { useState } from 'react';
import { Container, Row, Col, Button, Alert, Text, Title, Radio, RadioGroup } from '@dataesr/react-dsfr';
import useMatchFetcher from '../../components/blocs/coding-machine/use-match-fetch';
import useExportResults from '../../components/blocs/coding-machine/use-export-results';
import MatchResultsTable from '../../components/blocs/coding-machine/match-results-table';
import useTextProcessor from '../../components/blocs/coding-machine/use-text-processor';
import TextPasteArea from '../../components/blocs/coding-machine/text-Paste-Area';

export default function CodingMachinePage() {
  const [data, setData] = useState([]);
  const [matchedData, setMatchedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMatches, setSelectedMatches] = useState({});
  const [searchType, setSearchType] = useState('structures');

  const { processTableText, processing } = useTextProcessor({
    setData,
    setError,
    setMatchedData,
    setSelectedMatches,
  });

  const { fetchMatches } = useMatchFetcher({
    data,
    setError,
    setLoading,
    setMatchedData,
    setSelectedMatches,
    searchType,
  });

  const { exportResults } = useExportResults({ matchedData, selectedMatches });

  const handleMatchSelection = (rowIndex, matchId) => {
    setSelectedMatches((prev) => ({
      ...prev,
      [rowIndex]: matchId,
    }));
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    if (matchedData.length > 0) {
      setMatchedData([]);
      setSelectedMatches({});
    }
  };

  const getTypeLabel = () => {
    switch (searchType) {
    case 'structures': return 'structures';
    case 'persons': return 'personnes';
    case 'prizes': return 'prix';
    default: return '';
    }
  };

  return (
    <Container className="fr-mt-3w">
      <Row>
        <Col>
          <Title as="h2">Machine à coder</Title>
          <Text size="sm">Copiez et collez un tableau depuis Excel ou CSV pour trouver les identifiants Paysage correspondants.</Text>

          <div className="fr-mb-3w">
            <Text size="sm">
              Les colonnes du tableau doivent contenir des noms de
              {' '}
              {getTypeLabel()}
              .
              La première colonne doit avoir pour nom "Name", et les suivantes les noms d'identifiants
            </Text>
            <Text bold className="fr-mb-1w">Type d'entités à rechercher :</Text>

            <RadioGroup
              legend=""
              name="searchType"
              isInline
            >
              <Radio
                label="Structures (établissements, organisations)"
                value="structures"
                checked={searchType === 'structures'}
                onChange={handleSearchTypeChange}
              />
              <Radio
                label="Personnes"
                value="persons"
                checked={searchType === 'persons'}
                onChange={handleSearchTypeChange}
              />
              <Radio
                label="Prix et distinctions"
                value="prizes"
                checked={searchType === 'prizes'}
                onChange={handleSearchTypeChange}
              />
            </RadioGroup>
          </div>

          <TextPasteArea onDataPaste={processTableText} />
          {error && (
            <Alert
              type="error"
              description={error}
              className="fr-mb-3w"
            />
          )}

          {data.length > 0 && (
            <div className="fr-mb-3w">
              <Text size="sm">
                {data.length}
                {' '}
                entrées chargées.
              </Text>
              <Button
                onClick={fetchMatches}
                disabled={loading || processing}
              >
                {loading
                  ? 'Recherche en cours...'
                  : `Vérifier les correspondances de ${getTypeLabel()}`}
              </Button>
              {matchedData.length > 0 && (
                <Button
                  onClick={exportResults}
                  secondary
                  className="fr-ml-2w"
                >
                  Exporter les correspondances sélectionnées
                </Button>
              )}
            </div>
          )}

          {matchedData.length > 0 && (
            <MatchResultsTable
              matchedData={matchedData}
              setMatchedData={setMatchedData}
              setSelectedMatches={setSelectedMatches}
              selectedMatches={selectedMatches}
              onMatchSelection={handleMatchSelection}
              searchType={searchType}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}
