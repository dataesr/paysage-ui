import { Container, Highlight, Title } from '@dataesr/react-dsfr';

export default function Bienvenue() {
  return (
    <Container spacing="mt-10w">
      <Title as="h1">Compte crée</Title>
      <Highlight>
        Votre compte viens d’être crée. Vous allez recevoir un premier email qui comfirera la prise en compte de votre inscription
        Un administrateur doit valider votre inscription. Lorsque cela aura été fait, vous revevrez un autre email de confirmation et vous pourrez alors vous connecter.
        Cette procédure peut durer 1 à 3 jours.
      </Highlight>
    </Container>
  );
}
