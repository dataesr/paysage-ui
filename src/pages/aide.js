import { Container, Icon, Text } from '@dataesr/react-dsfr';

export default function Aide() {
  return (
    <Container>
      <Text size="lg" bold className="fr-mt-5w">
        <Icon name="ri-tools-fill" size="3x" color="var(--text-default-warning)" />
        Encore un peu de patience, cette page est en developement...
      </Text>
    </Container>
  );
}
