import { Col, Container, Icon, Link, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import Button from '../../button';
import { personsHeadersMapping } from '../lib/analysers/persons/headers-mapping';
import { structuresHeadersMapping } from '../lib/analysers/structures/headers-mapping';
import { prizesHeadersMapping } from '../lib/analysers/prizes/headers-mapping';
import { laureatHeadersMapping } from '../lib/analysers/laureats/headers-mapping';
import { gouvernanceHeadersMapping } from '../lib/analysers/gouvernance/headers-mapping';
import { termsHeadersMapping } from '../lib/analysers/terms/headers-mapping';
import { structuresIdentifiersHeadersMapping } from '../lib/analysers/structures-identifiers/headers-mapping';
import { personsIdentifiersHeadersMapping } from '../lib/analysers/persons-identifiers/headers-mapping';

export default function Analysis({ type, rows, handleForceImport }) {
  const [displayList, setDisplayList] = useState(false);
  if (!rows.length) return null;

  const typeOfImport = rows.map((el) => el.type)[0];

  const MODELS = {
    structures: structuresHeadersMapping,
    persons: personsHeadersMapping,
    price: prizesHeadersMapping,
    laureats: laureatHeadersMapping,
    gouvernance: gouvernanceHeadersMapping,
    terms: termsHeadersMapping,
    'structures (identifiants)': structuresIdentifiersHeadersMapping,
    'personnes (identifiants)': personsIdentifiersHeadersMapping,
  };

  const convertRowsToXLSXData = (dataRows) => {
    const xlsxData = [];
    const currentModel = MODELS[typeOfImport];
    if (!currentModel) return null;

    const headerRow = Object.keys(currentModel);
    headerRow.push('statuts');

    xlsxData.push(headerRow);

    dataRows.forEach((row) => {
      const warningMessages = row.warning ? row.warning.map((warning) => warning.message).join('; ') : '';

      const rowData = headerRow.map((header) => {
        let value = '';

        if (header === 'statuts') {
          value = warningMessages;
        } else {
          const fieldKey = currentModel[header];
          const fieldValues = row.body[fieldKey];

          if (Array.isArray(fieldValues)) {
            value = fieldValues.filter(Boolean).join('; ');
          } else if (fieldValues !== undefined) {
            value = fieldValues;
          }
        }
        return value;
      });

      xlsxData.push(rowData);
    });

    return xlsxData;
  };

  function downloadXLSXFile(data, fileName) {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }

  function createXLSXFile(sheetsObject) {
    const wb = XLSX.utils.book_new();
    Object.entries(sheetsObject).forEach(([k, v]) => {
      const ws = XLSX.utils.json_to_sheet(v, { skipHeader: 1 });
      XLSX.utils.book_append_sheet(wb, ws, k);
    });
    return XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
  }

  function exportToXLSX(xlsxData) {
    const sheetsObject = {
      xlsxData,
    };
    const xlsx = createXLSXFile(sheetsObject);
    return downloadXLSXFile(xlsx, 'warning.xlsx');
  }

  return (
    <Container fluid className="fr-my-3w">
      <Row>
        <Col n="12">
          <div className={`fr-notice notice-${type}`}>
            <div className="fr-container">
              <div className="fr-notice__body">
                <p className="fr-notice__title">
                  {type === 'warning' && `${rows?.length} warning${(rows.length > 1) ? 's' : ''}`}
                  {type === 'error' && `${rows?.length} erreur${(rows.length > 1) ? 's' : ''}`}
                  {type === 'success' && `${rows?.length} objet${(rows.length > 1) ? 's' : ''} prêt${(rows.length > 1) ? 's' : ''} à l'importation`}
                </p>
                <Button
                  size="sm"
                  type="button"
                  tertiary
                  borderless
                  style={{ position: 'absolute', right: 0, top: '-3px' }}
                  icon={displayList ? 'ri-subtract-line' : 'ri-add-line'}
                  className="notice-btn--close fr-ml-auto"
                  title={displayList ? 'Réduire' : 'Afficher'}
                  onClick={() => setDisplayList(!displayList)}
                >
                  {displayList ? 'Masquer les détails' : 'Afficher les détails'}
                </Button>
              </div>
            </div>
          </div>
        </Col>
        <Col className="fr-my-2w">
          {type === 'warning' && (
            <Button
              size="sm"
              type="button"
              onClick={() => {
                const xlsxData = convertRowsToXLSXData(rows);
                if (xlsxData) {
                  exportToXLSX(xlsxData);
                }
              }}
            >
              Exporter la liste des imports qui comportent des warnings
            </Button>
          )}
        </Col>
        {displayList && (
          <Col n="12">
            <div className="fr-table fr-table--bordered">
              <table style={{ display: 'table', width: '100%' }}>
                <thead>
                  <tr>
                    <th scope="col">Index</th>
                    <th scope="col">Nom</th>
                    <th scope="col" className="fr-mr-auto">Description</th>
                    {(type !== 'error') && (<th scope="col">Action</th>)}
                  </tr>
                </thead>
                <tbody>
                  {rows?.map(
                    (row) => (
                      <tr key={row.index}>
                        <td>{row.index}</td>
                        <td>{row.displayName}</td>
                        <td>
                          <ul>
                            {(row?.warning && row.warning.length > 0) && row.warning.map((item) => (
                              <li key={item.index}>
                                <Icon size="1x" name="ri-alert-line" color="var(--background-action-high-warning)" />
                                {item?.message}
                                {item?.href && ' '}
                                {item?.href && <Link target="_blank" href={item.href}>Vérifier</Link>}
                              </li>
                            ))}
                            {(row?.error && row.error.length > 0) && row.error.map((item) => (
                              <li key={item.index}>
                                <Icon size="1x" name="ri-error-warning-line" color="var(--background-action-high-error)" />
                                {item?.message}
                              </li>
                            ))}
                            {((row?.error?.length === 0) && (row?.warning?.length === 0)) && (<li>L'objet est prêt à l'importation</li>)}
                          </ul>
                        </td>
                        {(type !== 'error') && (
                          <td>
                            {((row?.warning && row.warning.length > 0) && type === 'success') && (
                              <Button
                                secondary
                                color="error"
                                onClick={() => handleForceImport(row.index)}
                                size="sm"
                              >
                                Retirer
                              </Button>
                            )}
                            {(type === 'warning') && (
                              <Button
                                secondary
                                color="error"
                                onClick={() => handleForceImport(row.index)}
                                size="sm"
                              >
                                Forcer
                              </Button>
                            )}
                          </td>
                        )}
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </Col>
        )}
      </Row>
    </Container>
  );
}

Analysis.propTypes = {
  type: PropTypes.oneOf(['error', 'warning', 'success']).isRequired,
  rows: PropTypes.array,
  handleForceImport: PropTypes.func,
};

Analysis.defaultProps = {
  rows: [],
  handleForceImport: null,
};
