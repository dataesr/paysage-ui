import { Button, ButtonGroup, Container, Row, Title } from '@dataesr/react-dsfr';
import useToast from '../../hooks/useToast';

export default function HomePage() {
  const { toast } = useToast();
  return (
    <Container spacing="mt-5w" as="main">
      <Row className="fr-pb-5w">
        <Title as="h2">Toast Tester</Title>
      </Row>
      <Row className="fr-pb-5w">
        <ButtonGroup isInlineFrom="lg">

          <Button onClick={() => toast({ toastType: 'info', title: 'test un peu plus long peut etre sur deux lignes', autoDismiss: false })}>Toast</Button>
          <Button onClick={() => toast({
            toastType: 'success',
            title: 'test un peu plus long peut etre sur deux lignes',
            description: 'test un peu plus long eventuellement sur deux lignes',
          })}
          >
            Toast
          </Button>
          <Button onClick={() => toast({ toastType: 'error', title: 'test', description: 'test un peu plus long eventuellement sur deux lignes' })}>Toast</Button>
          <Button onClick={() => toast({ toastType: 'warning', description: 'Impossible' })}>Toast</Button>
        </ButtonGroup>
      </Row>

    </Container>
  );
}
