import { Container, Row, Title, Text, Link } from '@dataesr/react-dsfr';
import BulkImport from '../../components/blocs/import';

export default function StructureBulkImport() {
  return (
    <Container>
      <Row>
        <Title>Import de structure en masse</Title>
      </Row>
      <Row>
        <Text>
          Récupérer le
          {' '}
          <Link href="/models/AjoutEnMasseStructure.xlsx">
            fichier modèle
          </Link>
          , le remplir (une ligne correspond à un élément), copier puis
          coller dans le champ ci-dessous les cellules correspondant aux
          éléments à ajouter.
        </Text>
      </Row>
      <BulkImport type="structure" />
    </Container>
  );
}
