import { useState } from 'react';
import { Button, ButtonGroup, Container, Row, Title } from '@dataesr/react-dsfr';
import TagInput from '../components/Taginput';
import useToast from '../hooks/useToast';

export default function HomePage() {
  const { toast } = useToast();
  const [tags, setTags] = useState([]);
  return (
    <Container spacing="mt-5w" as="main">
      <Row className="fr-pb-5w">
        <Title as="h2">Toast Tester</Title>
      </Row>
      <Row className="fr-pb-5w">
        <ButtonGroup isInlineFrom="lg">

          <Button onClick={() => toast({ toastType: 'info', title: 'test un peu plus long peut etre sur deux lignes', autoDismissAfter: 0 })}>Toast</Button>
          <Button onClick={() => toast({
            toastType: 'success',
            title: 'test un peu plus long peut etre sur deux lignes',
            description: 'Ici avec un dismiss de huit secondes',
            autoDismissAfter: 8000,
          })}
          >
            Toast
          </Button>
          <Button onClick={() => toast({ toastType: 'error', title: 'test', description: 'test un peu plus long eventuellement sur deux lignes' })}>Toast</Button>
          <Button onClick={() => toast({ toastType: 'warning', description: 'Impossible' })}>Toast</Button>
        </ButtonGroup>
      </Row>
      <Row className="fr-pb-5w">
        <Title as="h2">TagInput Tester</Title>
      </Row>
      <Row className="fr-pb-5w">
        <ButtonGroup isInlineFrom="lg">

          <TagInput
            label="Autres noms"
            hint='Validez votre ajout avec la touche "Entrée" afin de valider votre ajout'
            tags={tags || []}
            onTagsChange={(newTags) => setTags(newTags)}
          />
        </ButtonGroup>
      </Row>

    </Container>
  );
}
