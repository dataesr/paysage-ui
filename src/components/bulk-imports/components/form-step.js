import { Alert, Button, ButtonGroup, Icon, Link, Modal, ModalContent, Text, TextInput } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useState } from 'react';

const MODELS = {
  structures: '/models/BulkImportStructures.xlsx',
  personnes: '/models/BulkImportPersons.xlsx',
  prix: '/models/BulkImportPrizes.xslx',
  laureats: '/models/BulkImportLaureats.xslx',
  gouvernance: '/models/BulkImportGouvernance.xslx',
};

export default function FormStep({ type, onInputValidation, fileError }) {
  const [input, setInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState();

  return (
    <>
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
        {type === 'structures' && (
          <Button
            hasBorder={false}
            onClick={() => setIsModalOpen(true)}
            size="sm"
          >
            Voir les conditions d'import en masse
            <Icon iconPosition="right" size="xl" name="ri-information-line" color="var(--border-action-high-blue-france)" />
            <Modal size="lg" isOpen={isModalOpen} hide={() => setIsModalOpen(false)}>
              <ModalContent>
                <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', padding: '20px' }}>
                  <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Conditions et conseils d'utilisation de l'import en masse</h2>
                  <ul style={{ fontSize: '18px', lineHeight: '1.6', paddingLeft: '30px' }}>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ color: 'purple', marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Les champs en violet sont obligatoires dans le fichier xlsx
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Vérifiez que les catégories existent avant de soumettre l'import
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Vérifiez que le statut juridique existe et que le code ait 15 caractères
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Vérifiez que les identifiants aient le bon nombre de caractères
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
                      L'iso3 est obligatoire
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Le format des dates doit être le même que dans la première ligne
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
                      S'il y a plusieurs dénominations/catégories, elles doivent être séparées par des ";"
                    </li>
                  </ul>
                  <p style={{ fontSize: '16px', fontStyle: 'italic', marginTop: '20px' }}>En cas de problème, merci de contacter l'équipe technique.</p>
                </div>
              </ModalContent>
            </Modal>
          </Button>
        )}
      </Text>
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
  type: PropTypes.oneOf(['structures', 'personnes', 'gouvernance', 'prix', 'laureats']).isRequired,
  onInputValidation: PropTypes.func.isRequired,
  fileError: PropTypes.bool,
};

FormStep.defaultProps = {
  fileError: false,
};
