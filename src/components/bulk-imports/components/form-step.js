import { Alert, Button, ButtonGroup, Col, Icon, Link, Row, Text, TextInput } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useState } from 'react';
import HelperForStructures from '../lib/helpers/helper';

const MODELS = {
  structures: '/models/BulkImportStructures.xlsx',
  personnes: '/models/BulkImportPersons.xlsx',
  prix: '/models/BulkImportPrizes.xlsx',
  laureats: '/models/BulkImportLaureats.xlsx',
  gouvernance: '/models/BulkImportGouvernance.xlsx',
  termes: '/models/BulkImportTerms.xlsx',
  'structures (identifiants)': '/models/BulkImportStructuresIdentifiers.xlsx',
  'personnes (identifiants)': '/models/BulkImportPersonsIdentifiers.xlsx',
};

export default function FormStep({ type, onInputValidation, fileError }) {
  const [input, setInput] = useState('');

  return (
    <>
      <Row>
        <Text size="sm">
          <i>
            Récupérer le
            {' '}
            <Link href={MODELS[type]}>
              fichier modèle
            </Link>
            , le remplir (une ligne correspond à un élément), copier puis
            coller dans le champ ci-dessous les cellules correspondant aux
            éléments à ajouter. La première ligne doit correspondre à l'en-tête de chaque colonne. Veuillez utiliser Ctrl + 'a' pour copier votre tableau d'imports.
          </i>
        </Text>
      </Row>
      <Row>
        <HelperForStructures type={type} />
      </Row>
      <Row spacing="mb-1v">
        <Col>
          <Icon name="ri-error-warning-line" size="lg" />
          Vérifiez que votre fichier correspond au fichier modèle.
        </Col>
      </Row>
      <TextInput
        label="Coller dans le champ ci-dessous les cellules du fichier modèle correspondant aux éléments à ajouter:"
        onChange={(e) => setInput(e.target.value)}
        required
        rows="12"
        textarea
        value={input}
      />
      <ButtonGroup>
        <Button onClick={() => onInputValidation(input)}>Analyser ces données</Button>
      </ButtonGroup>
      {fileError && (
        <Alert
          description="Le fichier contient des erreurs de format. Veuillez vérifiez votre fichier. Si le problème persiste, contactez un développeur."
          type="error"
        />
      )}
    </>
  );
}

FormStep.propTypes = {
  type: PropTypes.oneOf(['structures', 'personnes', 'gouvernance', 'prix', 'laureats', 'termes', 'structures (identifiants)', 'personnes (identifiants)']).isRequired,
  onInputValidation: PropTypes.func.isRequired,
  fileError: PropTypes.bool,
};

FormStep.defaultProps = {
  fileError: false,
};
