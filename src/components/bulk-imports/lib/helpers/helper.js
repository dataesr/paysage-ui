import { Button, Icon, Modal, ModalContent } from '@dataesr/react-dsfr';
import { useState } from 'react';
import PropTypes from 'prop-types';

export default function HelperForStructures({ type }) {
  const [isModalOpen, setIsModalOpen] = useState();
  return (
    <Button
      hasBorder={false}
      onClick={() => setIsModalOpen(true)}
      size="sm"
    >
      Conditions et conseils d'utilisation de l'import en masse
      <Icon iconPosition="right" size="xl" name="ri-information-line" color="var(--border-action-high-blue-france)" />
      <Modal size="lg" isOpen={isModalOpen} hide={() => setIsModalOpen(false)}>
        <ModalContent>
          <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', padding: '20px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Conditions et conseils d'utilisation de l'import en masse</h2>
            <ul style={{ fontSize: '18px', lineHeight: '1.6', paddingLeft: '30px' }}>
              {type === 'structures'
                && (
                  <>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ color: 'purple', marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Les champs en violet sont obligatoires dans le fichier xlsx
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Vérifiez que les catégories existent
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
                      L'iso3 est obligatoire, exemple : FRA
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Le format des dates doit être le même que dans la première ligne
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Si elles sont multiples, séparez les id des catégories par des ";", sans espace
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Après validation des imports, vous pourrez exporter les objets importés en fichier XLSX.
                      Si un warning a été forcé, la dernière colonne du fichier comportera la/les raisons du/des warning(s)
                      {' '}
                    </li>
                  </>
                )}
              {type === 'personnes'
                && (
                  <>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ color: 'purple', marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Les champs en violet sont obligatoires dans le fichier xlsx
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Vérifiez que la personne que vous souhaitez créer n'existe pas déjà
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Le genre doit être 'F' pour Femme, 'H' pour Homme ou 'A' pour autre
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Séparez les autres dénominations par des ";", sans espace
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Vérifiez que les identifiants aient le bon nombre de caractères
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Après validation des imports, vous pourrez exporter les objets importés en fichier XLSX.
                      Si un warning a été forcé, la dernière colonne du fichier comportera la/les raisons du/des warning(s)
                      {' '}
                    </li>
                  </>
                )}
              {type === 'laureats'
                && (
                  <>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ color: 'purple', marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Les champs en violet sont obligatoires dans le fichier xlsx
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Vérifiez que les prix que vous souhaitez lier existent
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Vérifiez que les personnes que vous souhaitez lier aux prix existent
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Le format des dates doit être le même que dans la première ligne
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Séparez les id des structures par des ";", sans espace
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Après validation des imports, vous pourrez exporter les objets importés en fichier XLSX.
                      Si un warning a été forcé, la dernière colonne du fichier comportera la/les raisons du/des warning(s)
                      {' '}
                    </li>
                  </>
                )}
              {type === 'gouvernance'
                && (
                  <>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ color: 'purple', marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Les champs en violet sont obligatoires dans le fichier xlsx
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Vérifiez que les structures existent
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Vérifiez que les personnes existent
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Vérifiez que les fonctions/responsabilités existent. Vous les trouverez dans la partie administration, type de relation
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Le format des dates doit être le même que dans la première ligne
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Pour une election, renseigner E, pour une nomination N, sans guillemets. De même pour "En intérim" et Mandat actif
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Après validation des imports, vous pourrez exporter les objets importés en fichier XLSX.
                      Si un warning a été forcé, la dernière colonne du fichier comportera la/les raisons du/des warning(s)
                      {' '}
                    </li>
                  </>
                )}
              {type === 'prix'
                && (
                  <>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ color: 'purple', marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Les champs en violet sont obligatoires dans le fichier xlsx
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Vérifiez que le prix n'existe pas déjà
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Vérifiez que l'identifiant Wikidata est correcte
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Le format des dates doit être le même que dans la première ligne
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Les structures décernant le prix ainsi que les différentes catégories doivent être séparé par des ";", sans espace
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
                      Après validation des imports, vous pourrez exporter les objets importés en fichier XLSX.
                      Si un warning a été forcé, la dernière colonne du fichier comportera la/les raisons du/des warning(s)
                      {' '}
                    </li>
                  </>
                )}
            </ul>
            <p style={{ fontSize: '16px', fontStyle: 'italic', marginTop: '20px' }}>Si votre fichier contient des erreurs ou des warnings, vous pourrez modifier votre fichier.</p>
            <p style={{ fontSize: '16px', fontStyle: 'italic', marginTop: '20px' }}>En cas de problème, merci de contacter l'équipe technique.</p>
          </div>
        </ModalContent>
      </Modal>
    </Button>
  );
}
HelperForStructures.propTypes = {
  type: PropTypes.oneOf(['structures', 'personnes', 'gouvernance', 'prix', 'laureats']).isRequired,
};
