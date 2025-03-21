import { useState } from 'react';
import { Container, Row, Col, Button, Alert, Text, Title } from '@dataesr/react-dsfr';
import useFileProcessor from '../../components/blocs/coding-machine/use-file-processor';
import useMatchFetcher from '../../components/blocs/coding-machine/use-match-fetch';
import useExportResults from '../../components/blocs/coding-machine/use-export-results';
import FileUploader from '../../components/blocs/coding-machine/file-uploader';
import MatchResultsTable from '../../components/blocs/coding-machine/match-results-table';

export default function CodingMachinePage() {
  const [data, setData] = useState([]);
  const [matchedData, setMatchedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMatches, setSelectedMatches] = useState({});

  const { handleFileUpload } = useFileProcessor({
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
  });

  const { exportResults } = useExportResults({ matchedData, selectedMatches });

  const handleMatchSelection = (rowIndex, matchId) => {
    setSelectedMatches((prev) => ({
      ...prev,
      [rowIndex]: matchId,
    }));
  };

  return (
    <Container className="fr-mt-3w">
      <Row>
        <Col>
          <Title as="h2">Machine à coder</Title>
          <Text size="sm">Importez un fichier CSV ou Excel et trouvez les identifiants Paysage correspondants.</Text>
          <Text size="sm">
            Les colonnes du fichier doivent contenir
            des noms de structures ou de personnes. La première colonne doit avoir pour nom "Name", et les suivantes les noms d'identifiants
          </Text>
          <Text className="fr-mb-2w">Exemple de format :</Text>
          <div className="fr-table ">
            <table>
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">SIRET</th>
                  <th scope="col">SIREN</th>
                  <th scope="col">UAI</th>
                  <th scope="col">UAI 2</th>
                  <th scope="col">...</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Université de Colombie</td>
                  <td>123213213400014</td>
                  <td>421321344</td>
                  <td>532432X</td>
                </tr>
                <tr>
                  <td>Centre National de la Recherche Scientifique</td>
                  <td>180089013</td>
                  <td>180089013</td>
                  <td>0753639Y</td>
                </tr>
              </tbody>
            </table>
          </div>

          <FileUploader
            onFileUpload={handleFileUpload}
          />
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
                disabled={loading}
              >
                {loading ? 'Recherche en cours...' : 'Vérifier les correspondances'}
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
            />

          )}
        </Col>
      </Row>
    </Container>
  );
}
