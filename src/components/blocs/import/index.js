import { Row, TextInput, Button, Col } from '@dataesr/react-dsfr';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { parseStructureCSV } from './utils/parse-csv-input';
import checkBeforeImport from './components/check-before-import';

export default function BulkImport({ type }) {
  const [input, setInput] = useState();

  const handleImportClick = () => {
    const parsedData = parseStructureCSV(input);
    const checkedData = checkBeforeImport(parsedData);
  };

  return (
    <Row>
      <Col>
        {' '}
        <TextInput
          label="Import en masse"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          required
          rows="12"
          textarea
        />
      </Col>
      <Col>
        <Button onClick={handleImportClick} />
      </Col>
    </Row>
  );
}

BulkImport.propTypes = {
  type: PropTypes.string,
};

BulkImport.defaultProps = {
  type: PropTypes.string,
};
