/* eslint-disable max-len */
import { useEffect } from 'react';
import { Container, Link, Text, Title } from '@dataesr/react-dsfr';

export default function ProjetEtEquipe() {
  useEffect(() => { document.title = 'Paysage · Projet & équipe'; }, []);
  return (
    <Container>
      <Title as="h2">
        Le projet Paysage
      </Title>
      <Text>
        Paysage est né d'un besoin initial de centraliser et de faciliter l'accès et la maintenabilité d'un grand nombre d'objets de l'enseignement supérieur.
        <br />
        Yann Caradec à imaginé une solution novatrice capable de s'adapter à la constante évolution de cet écosystème et de ses données.
        <br />
        La première version du projet à permis de mettre en lumière les forces d'un tel outil. La connaissance est partagée et l'utilisateur qualifie les données.
        Paysage se charge d'afficher une donnée pertinente à jour et de créer la mémoire de notre écosystème dans un historique fiable et exploitable.
        <br />
        <br />
        Victime de son succès, Paysage gère à présent X objets.
        L'architecture logicielle a atteind ses limites et a du être repensé afin de fournir à l'utilisateur une meilleure expérience de navigation. Naissance de la version 2.
      </Text>

      <Title as="h2">
        La version 2.0
      </Title>
      <Text>
        La nouvelle version était nécessaire pour des raisons de performance, d'interopérabilité et de maintenabilité.
        <br />
        La philosophie de la version 2 reste la même mais techniquement, le nouveau Paysage est entièrement repensé et réécrit.
        Le projet est maintenant entrièrement développé en Javascript (nodeJS pour l'API et React pour l'interface utilisateur).
        Les données sont stockées dans MongoDb et indexées dans Elasticsearch pour la recherche.
        Le choix de ces technologies inscrit Paysage dans les outils maitrisés par l'équipe du département des outils d'aide à la décision.
        Le code source du projet est sous licence MIT et disponible sur
        {' '}
        <Link href="https://github.com/search?q=org%3Adataesr+paysage">Github</Link>
        .
      </Text>

      <Title as="h2">
        L'équipe derrière le projet
      </Title>
      <Text>
        Cet outil, imaginé et développé dans sa première versions par Yann Caradec est dorénavant développé par l'ensemble de l'équipe du département des outils d'aide à la décision encadré par Emmanuel Weisenburger.
        Julia, Alexandra, Mialy, ... contribuent à l'enrichissement des données.
        <br />
        Pour créer cette verion 2, l'équipe aux compétences partagées et complémentaires a su reccueillir et interpréter l'information des utilisateurs de la version 1 grâce à Alexandra et Pauline.
        <br />
        Retranscrire et imaginer une nouvelle architecture adaptée au besoin grâce à Anne, Frédéric et Jérémy.
        <br />
        Et enfin développer la solution grâce à Anne, Frédéric, Yann, Jérémy et Mihoub.
      </Text>
    </Container>
  );
}
