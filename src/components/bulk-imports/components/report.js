import * as XLSX from 'xlsx';
import { Button, Col, Container, Icon, Link, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { personsHeadersMapping } from '../lib/analysers/persons/headers-mapping';
import { structuresHeadersMapping } from '../lib/analysers/structures/headers-mapping';
import { prizesHeadersMapping } from '../lib/analysers/prizes/headers-mapping';
import { laureatHeadersMapping } from '../lib/analysers/laureats/headers-mapping';
import { gouvernanceHeadersMapping } from '../lib/analysers/gouvernance/headers-mapping';
import { termsHeadersMapping } from '../lib/analysers/terms/headers-mapping';

export default function Report({ type, rows }) {
  const [displayList, setDisplayList] = useState(true);
  if (!rows.length) return null;

  const typeOfImport = rows.map((el) => el.type)[0];

  const MODELS = {
    structures: structuresHeadersMapping,
    persons: personsHeadersMapping,
    price: prizesHeadersMapping,
    laureats: laureatHeadersMapping,
    gouvernance: gouvernanceHeadersMapping,
    terms: termsHeadersMapping,

  };

  const convertRowsToXLSXData = (dataRows) => {
    const xlsxData = [];
    const currentModel = MODELS[typeOfImport];
    if (!currentModel) return null;

    const headerRow = Object.keys(currentModel);
    headerRow.push('nouvel Id Paysage', 'statuts');

    xlsxData.push(headerRow);

    dataRows.forEach((row) => {
      const warningMessages = row.warning ? row.warning.map((warning) => warning.message).join('; ') : '';
      const nouvelIdPaysage = row.imports.href.substring(row.imports.href.length - 5);

      const rowData = headerRow.map((header) => {
        let value = '';
        if (header === 'nouvel Id Paysage') {
          value = nouvelIdPaysage;
        } else if (header === 'statuts') {
          value = warningMessages;
        } else {
          const fieldKey = currentModel[header];
          const fieldValues = row.body[fieldKey];

          if (typeof fieldValues === 'object' && fieldValues !== null) {
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
    return downloadXLSXFile(xlsx, 'report.xlsx');
  }

  return (
    <Container fluid className="fr-my-3w">
      <Row>
        <Col n="12">
          <div className={`fr-notice notice-${type}`}>
            <div className="fr-container">
              <div className="fr-notice__body">
                <p className="fr-notice__title">
                  {type === 'error' && `${rows?.length} erreur${(rows.length > 1) ? 's' : ''}`}
                  {type === 'success' && `${rows?.length} objet${(rows.length > 1) ? 's' : ''} importé${(rows.length > 1) ? 's' : ''}`}
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
        {displayList && (
          <Col n="12">
            <div className="fr-table fr-table--bordered">
              <table style={{ display: 'table', width: '100%' }}>
                <thead>
                  <tr>
                    <th scope="col">Index</th>
                    <th scope="col">Nom</th>
                    <th scope="col" className="fr-mr-auto">Description</th>
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
                            {((row?.imports?.status === 'error') && row.imports.error?.length > 0) && row.imports.error.map((item, i) => (
                              <li key={i}>
                                <Icon size="1x" name="ri-error-warning-line" color="var(--background-action-high-error)" />
                                {item?.message}
                              </li>
                            ))}
                            {(row?.imports?.status === 'imported' && row?.type !== 'laureats') && (
                              <li>
                                L'objet a été importé avec succes
                                {row.imports?.href && ' '}
                                {row.imports?.href && !row.imports?.href.includes('/relations')
                                && <Link target="_blank" href={row.imports.href}>Voir</Link> }
                              </li>
                            )}
                            {row.imports?.href && row.type === 'laureats' && (
                              <li>
                                La relation entre
                                <Link
                                  target="_blank"
                                  href={`/personnes/${row.body.relatedObjectId}`}
                                >
                                  {' '}
                                  {row.laureatName.join()}
                                </Link>
                                et
                                {' '}
                                <Link
                                  target="_blank"
                                  href={`/prix/${row.body.resourceId}`}
                                >
                                  {row.priceName}
                                </Link>
                                a bien été effectuée
                              </li>
                            )}
                          </ul>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
            {rows.map((el) => el.type === 'persons' || el.type === 'structures') && (
              <Button
                onClick={() => {
                  const xlsxData = convertRowsToXLSXData(rows);
                  if (xlsxData) {
                    exportToXLSX(xlsxData);
                  }
                }}
              >
                Exporter la liste des imports en XLSX
              </Button>
            )}
          </Col>
        )}
      </Row>
    </Container>
  );
}

Report.propTypes = {
  type: PropTypes.oneOf(['error', 'success']).isRequired,
  rows: PropTypes.array,
};

Report.defaultProps = {
  rows: [],
};
