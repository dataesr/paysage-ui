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
  const [pastedText, setPastedText] = useState('');

  const { fetchMatches } = useMatchFetcher({
    data,
    setError,
    setLoading,
    setMatchedData,
    setSelectedMatches,
    searchType,
  });

  const handleDataProcessed = (processedData) => {
    setData(processedData);
    if (processedData && processedData.length > 0) {
      setTimeout(() => {
        fetchMatches();
      }, 50);
    }
  };

  const { processTableText, processing } = useTextProcessor({
    setData: handleDataProcessed,
    setError,
    setMatchedData,
    setSelectedMatches,
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

  const handleReset = () => {
    setData([]);
    setMatchedData([]);
    setLoading(false);
    setError(null);
    setSelectedMatches({});
    setPastedText('');
  };

  const getTypeLabel = () => {
    switch (searchType) {
    case 'structures': return 'structures';
    case 'persons': return 'personnes';
    case 'prizes': return 'prix';
    default: return '';
    }
  };

  const handleProcessAndSearch = () => {
    processTableText(pastedText);
  };

  const getButtonText = () => {
    if (processing) return 'Traitement en cours...';
    if (loading) return 'Recherche en cours...';
    return 'Traiter les données et rechercher';
  };

  const showResetButton = pastedText.trim() || data.length > 0 || matchedData.length > 0;

  return (
    <Container className="fr-mt-3w">
      <Row>
        <Col>
          <Title as="h2">Machine à coder</Title>
          <Text size="sm">Copiez et collez un tableau depuis Excel ou CSV pour trouver les objets Paysage correspondants.</Text>
          <Text size="sm">
            Les colonnes du tableau doivent contenir des noms de
            {' '}
            {getTypeLabel()}
            .
            La première colonne doit avoir pour nom "Name", et les suivantes les noms d'identifiants
          </Text>
          <Text size="sm">
            Les colonnes du tableau peuvent contenir:
            {' '}

            <ul>
              <li>Soit une première colonne "Name" suivie d'identifiants (format standard)</li>
              <li>Soit uniquement une colonne contenant identifiants (SIRET, UAI, RNSR, etc.) sans colonne "Name"</li>
            </ul>
          </Text>

          Exemple :
          <Row gutters className="fr-mb-3w">
            <Col n="6">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SIRET</th>
                  <th>UAI</th>
                </tr>
                <tr>
                  <td>Structure 1</td>
                  <td>12345678901234</td>
                  <td>0123456A</td>
                </tr>
              </thead>
            </Col>
            <Col n="6">
              <thead>
                <tr>
                  <th>Siret</th>
                </tr>
                <tr>
                  <td>12345678901234</td>
                </tr>
              </thead>
            </Col>
          </Row>
          <div className="fr-mb-3w">

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
          <TextPasteArea onChange={setPastedText} value={pastedText} />
          {error && (
            <Alert
              type="error"
              description={error}
              className="fr-mb-2w"
            />
          )}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Button
              onClick={handleProcessAndSearch}
              disabled={!pastedText.trim() || processing || loading}
            >
              {getButtonText()}
            </Button>

            {showResetButton && (
              <Button
                onClick={handleReset}
                secondary
                color="text"
              >
                Tout réinitialiser
              </Button>
            )}
          </div>
          {matchedData.length > 0 && (
            <div className="fr-mt-3w">
              <MatchResultsTable
                matchedData={matchedData}
                setMatchedData={setMatchedData}
                setSelectedMatches={setSelectedMatches}
                selectedMatches={selectedMatches}
                onMatchSelection={handleMatchSelection}
                searchType={searchType}
              />
            </div>
          )}
        </Col>
      </Row>
      {matchedData.length > 0 && (
        <Button
          onClick={exportResults}
          secondary
        >
          Exporter les correspondances sélectionnées
        </Button>
      )}
    </Container>
  );
}
