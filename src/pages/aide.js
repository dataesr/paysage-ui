import { useEffect } from 'react';
import { Container, Icon, Text } from '@dataesr/react-dsfr';

export default function Aide() {
  useEffect(() => { document.title = 'Paysage · Aide'; }, []);
  return (
    <Container>
      <Text size="lg" bold className="fr-mt-5w">
        <Icon name="ri-tools-fill" size="3x" color="var(--text-default-warning)" />
        Encore un peu de patience, cette page est en développement...
      </Text>
    </Container>
  );
}
