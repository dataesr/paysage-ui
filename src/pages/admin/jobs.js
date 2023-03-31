import { Container, Icon, Text, Title } from '@dataesr/react-dsfr';

export default function Jobs() {
  return (
    <Container fluid className="fr-my-5w">
      <Title as="h1" look="h3">Tâches du systeme</Title>
      <Text size="lg" bold className="fr-mt-5w">
        <Icon name="ri-tools-fill" size="3x" color="var(--text-default-warning)" />
        Encore un peu de patience, cette page est en développement...
      </Text>
    </Container>
  );
}
