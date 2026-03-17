import { useRef, useState } from 'react';
import { Alert, Button, Col, Container, Row, Text, Title } from '@dataesr/react-dsfr';

import useFileReader from '../../components/blocs/pydref/use-file-reader';
import usePydrefFetch from '../../components/blocs/pydref/use-pydref-fetch';
import usePydrefExport from '../../components/blocs/pydref/use-pydref-export';
import PydrefResultsTable from '../../components/blocs/pydref/results-table';

export default function PyDRefPage() {
  const [data, setData] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState('');
  const [selectedMatches, setSelectedMatches] = useState({});
  const fileInputRef = useRef(null);

  const { readFile, processing } = useFileReader({ setData, setError, setResults });
  const { fetchIdentifiers } = usePydrefFetch({ data, setResults, setError, setLoading });
  const { exportResults } = usePydrefExport({ results, selectedMatches });

  const handleSelectMatch = (index, match) => {
    setSelectedMatches((prev) => {
      const next = { ...prev };
      if (match === null) delete next[index];
      else next[index] = match;
      return next;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setData([]);
    setResults([]);
    setError(null);
    readFile(file);
  };

  const handleReset = () => {
    setData([]);
    setResults([]);
    setLoading(false);
    setError(null);
    setFileName('');
    setSelectedMatches({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getButtonText = () => {
    if (processing) return 'Lecture du fichier...';
    if (loading) return 'Identification en cours...';
    return "Lancer l'identification";
  };

  const canSearch = data.length > 0 && !processing && !loading;
  const showReset = fileName || data.length > 0 || results.length > 0;

  return (
    <Container className="fr-mt-3w">
      <Row>
        <Col>
          <Title as="h2">Identification de personnes (PyDRef)</Title>
          <Text size="sm">
            Importez un fichier Excel (.xlsx) contenant au moins une des colonnes
            {' '}
            <strong>last_name</strong>
            {' '}
            ou
            {' '}
            <strong>first_name</strong>
            .
            {' '}
            Plus vous renseignez d&apos;informations, plus l&apos;identification sera précise.
            {' '}
            L&apos;outil interroge l&apos;API PyDRef (Made by Eric) pour retrouver les identifiants de chaque personne
            (IdRef, ORCID, etc.) et vous permet d&apos;exporter les résultats.
          </Text>

          <Row gutters className="fr-mb-3w">
            <Col n="6">
              <table>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid black', padding: '4px 8px' }}>last_name</th>
                    <th style={{ border: '1px solid black', padding: '4px 8px' }}>first_name</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: '1px solid black', padding: '4px 8px' }}>Sabrina</td>
                    <td style={{ border: '1px solid black', padding: '4px 8px' }}>Carpenter</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid black', padding: '4px 8px' }}>Thomas</td>
                    <td style={{ border: '1px solid black', padding: '4px 8px' }}>Bangalter</td>
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>
          <Row>
            <div className="fr-mb-3w">
              <Text bold className="fr-mb-1w">Fichier Excel à importer :</Text>
              <Text size="sm" className="fr-mt-1w">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="fr-upload"
                  id="pydref-file-upload"
                />
                {fileName && (
                  <span>
                    {fileName}
                    {data.length > 0 && (
                      <>
                        {' -- '}
                        {data.length}
                        {' '}
                        personne(s) détectée(s)
                        {' --'}
                      </>
                    )}
                  </span>
                )}
              </Text>
            </div>
          </Row>

          {error && (
            <Alert
              type="error"
              description={error}
              className="fr-mb-2w"
            />
          )}

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'flex-end' }} className="fr-mb-3w">
            <Button
              onClick={fetchIdentifiers}
              disabled={!canSearch}
            >
              {getButtonText()}
            </Button>

            {showReset && (
              <Button
                onClick={handleReset}
                secondary
                color="text"
              >
                Tout réinitialiser
              </Button>
            )}
          </div>

          {results.length > 0 && (
            <PydrefResultsTable
              results={results}
              selectedMatches={selectedMatches}
              onSelectMatch={handleSelectMatch}
            />
          )}
        </Col>
      </Row>

      {results.length > 0 && (
        <Row className="fr-mt-3w" justifyContent="right">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'flex-end' }} className="fr-mb-3w">
            <Col>
              <Button
                onClick={exportResults}
                secondary
              >
                Exporter les résultats (.xlsx)
              </Button>
            </Col>
          </div>
        </Row>
      )}
    </Container>
  );
}
