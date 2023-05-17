import { Breadcrumb, BreadcrumbItem, Col, Container, Row, Text, Title } from '@dataesr/react-dsfr';
import { Link as RouterLink } from 'react-router-dom';

export default function CGU() {
  return (
    <Container className="fr-my-5w">
      <Row>
        <Col n="12">
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>
              Accueil
            </BreadcrumbItem>
            <BreadcrumbItem>Conditions générales d’utilisation</BreadcrumbItem>
          </Breadcrumb>
        </Col>
        <Col n="12 md-8">
          <Title as="h1">Conditions générales d’utilisation</Title>
          <Text>
            Paysage est une plateforme collaborative de partage de connaissances
            destinée aux agents du ministère en charge de l’enseignement supérieur et de la recherche, du ministère en charge
            de l’éducation nationale et des services déconcentrés. Elle permet le suivi à 360° des établissements, organismes,
            regroupements, réseaux et projets qui composent le paysage de l'enseignement supérieur, de la recherche et de l'innovation (ESRI).
            Elle est accessible sur le web sur tout support (ordinateur, tablette, téléphone portable).
            Elle permet à ses utilisateurs de partager leurs connaissances sur ces acteurs et les liens qu'ils ont tissés entre eux.
            Elle est proposée par le ministère de l’enseignement supérieur et de la recherche
            (Direction générale de l’enseignement supérieur et de l’insertion professionnelle/Direction générale de la recherche)
            et opérée par la sous-direction des systèmes d’information et des études statistiques (SIES).
            Toute utilisation de la plateforme paysage.enseignementsup-recherche.gouv.fr/ (ci-après, la Plateforme)
            est subordonnée au respect des présentes conditions générales d’utilisation (CGU).
          </Text>
          <Text>Est défini comme :</Text>
          <Text>
            <Text as="span" bold>Administrateur : </Text>
            personne disposant, en compléments des droits attribués aux utilisateurs, de droits étendus permettant de valider
            les demandes d’inscription des utilisateurs et de leur attribuer les droits adaptés, de suivre l’évolution du contenu
            de l’application et d’intervenir sur l’ensemble des données proposées dans l’application ;
          </Text>
          <Text>
            <Text as="span" bold>API (web) : </Text>
            interface web structurée permettant d’interagir automatiquement avec un système
            d’information, qui inclut généralement la récupération de données à la demande ;
          </Text>
          <Text>
            <Text as="span" bold>Catégorie : </Text>
            type d’objet constituant Paysage. Une Catégorie correspond à un ensemble de
            structures, de personnes ou de prix partageant une caractéristique commune ;
          </Text>
          <Text>
            <Text as="span" bold>Contribution : </Text>
            une contribution est une action de correction, d’enrichissement ou d’actualisation réalisée par un utilisateur sur les informations
            définies par les administrateurs comme modifiables par les utilisateurs ;
          </Text>
          <Text>
            <Text as="span" bold>Objet : </Text>
            élément d’organisation de l’information de Paysage. L’application structure et restitue de l’information sur les objets
            suivants : structures, personnes, prix, textes officiels, termes, catégories ;
          </Text>
          <Text>
            <Text as="span" bold>Personne : </Text>
            type d’objet constituant Paysage. Une Personne correspond à une personne physique
            occupant une fonction officielle au sein des institutions publiques ou
            privées (disposant ou non de la personnalité juridique) en interaction avec
            les missions placées sous la responsabilité du ministère en charge de
            la recherche, de l’innovation et de l’enseignement supérieur ou ayant
            acquis une certaine visibilité dans le cadre de leur activité d’enseignement
            supérieur, de recherche et d’innovation, via l’attribution de prix et
            distinctions ;
          </Text>
          <Text>
            <Text as="span" bold>Prix : </Text>
            type d’objet constituant Paysage. Un prix correspond à une distinction
            honorifique attribuée publiquement à une personne ou une structure en
            reconnaissance de travaux, de résultats ou d’une implication remarquable
            dans les domaines de l’enseignement supérieur, de la recherche et de
            l’innovation ;
          </Text>
          <Text>
            <Text as="span" bold>Structure : </Text>
            type d’objet constituant Paysage. Une structure correspond à une
            institution publique ou privée, implantée ou non sur le territoire
            français, disposant ou non de la personnalité morale, ayant une activité
            visible publiquement en matière d’enseignement supérieur, de recherche
            et d’innovation. Organismes de recherche, établissements d’enseignement
            supérieur et de recherche, administrations publiques, entreprises,
            associations et fondations, centres hospitaliers, laboratoires de
            recherche... sont ainsi considérés comme des structures dans Paysage ;
          </Text>
          <Text>
            <Text as="span" bold>Terme : </Text>
            type d’objet constituant Paysage décrivant un mot-clé ou un concept
            associable à un autre objet de Paysage et permettant de le qualifier ;
          </Text>
          <Text>
            <Text as="span" bold>Texte officiel : </Text>
            type d’objet constituant Paysage relatif à un texte officiel publié au
            JO ou au BOESR relatif à au moins un autre objet présent dans l’application ;
          </Text>
          <Text>
            <Text as="span" bold>Utilisateur : </Text>
            toute personne inscrite à la Plateforme afin de consulter, de télécharger
            des contenus ou d’actualiser, d’enrichir et de corriger les informations
            définies comme pouvant être modifiées par un utilisateur.
          </Text>
          <Title as="h2">Objet</Title>
          <Text>
            La Plateforme permet :
          </Text>
          <ul className="ul-styled">
            <Text as="li">
              la structuration des données publiques ou utilisées par
              l’administration dans ses opérations de gestion ou de pilotage autour des
              objets d’intérêt pour l’analyse, la définition et le suivi des politiques
              publiques relatives à l’enseignement supérieur, la recherche et l’innovation,
            </Text>
            <Text as="li">
              la consultation et le téléchargement de ces données par tout Utilisateur,
            </Text>
            <Text as="li">
              l’intégration des contributions des utilisateurs pour corriger, enrichir et actualiser certaines données proposées dans l’application.
            </Text>
          </ul>
          <Title as="h2">Fonctionnalités</Title>
          <Text>
            L’utilisation de la Plateforme est réservée aux agents de l’administration centrale
            et de leurs services déconcentrés en charge de l’enseignement supérieur et de la
            recherche à l’issue d’une procédure d’inscription modérée par un administrateur
            qui attribue des droits de visualisation et de modification en rapport avec la
            position de l’utilisateur dans une des organisations habilitées à accéder à
            l’application. Son utilisation est gratuite.
          </Text>
          <Title as="h3" look="h6">Consultation, téléchargement des données et contribution</Title>
          <Text>
            La consultation des contenus mis à disposition ou leur téléchargement,
            la réalisation de contributions nécessitent une inscription préalable établie
            sur la base d’une adresse mail professionnelle nominative.
          </Text>
          <Title as="h3" look="h6">Inscription sur la plateforme et fonctionnalités liées</Title>
          <Text>
            Les agents de l’administration centrale et des services déconcentrés relevant
            des ministères en charge de l’enseignement supérieur, de la recherche et de
            l’innovation peuvent consulter le contenu, l’exporter et/ou contribuer à la
            Plateforme.
          </Text>
          <Text>
            Pour ce faire, l’Utilisateur s’inscrit sur la Plateforme. Cette inscription
            lui est propre. Elle nécessite l’utilisation d’une adresse de messagerie
            professionnelle gérée par les institutions dont les agents sont habilités à
            accéder à l’application. Afin de maîtriser l’accès à l’information et les actions
            des utilisateurs sur les données, l’usage des adresses fonctionnelles pour
            s’identifier est proscrit. De manière périodique, la validité des adresses
            utilisées par les utilisateurs est testée. Les comptes associés à des adresses
            invalides sont suspendus.
          </Text>
          <Text>
            En s’inscrivant, l’Utilisateur crée un profil sur la Plateforme. Un administrateur
            lui attribue les droits proportionnés à sa fonction et à son organisation
            d’appartenance. Pour plus de précisions, voir la rubrique Vie privée.
          </Text>
          <Text>
            Dès validation de son inscription, les différentes fonctionnalités sont disponibles.
          </Text>
          <Text>
            Le Contributeur dispose des fonctionnalités générales suivantes :
          </Text>
          <ul className="ul-styled">
            <Text as="li">
              rechercher dans le contenu de l’application,
            </Text>
            <Text as="li">
              accéder au contenu des pages relatives à chacun des objets de l’application qui
              fédèrent l’information disponible
            </Text>
            <Text as="li">
              créer des objets
            </Text>
            <Text as="li">
              modifier (corriger, enrichir, actualiser) des objets existants pour
              l’ensemble des informations définies comme étant modifiables.
            </Text>
            <Text as="li">
              exporter les informations exposées dans l’application.
            </Text>
          </ul>
          <Text>
            Il dispose également d’autres fonctionnalités telles que le suivi des
            modifications réalisées par les utilisateurs sur les objets avec mention
            du prénom et du nom de l’utilisateur qui est intervenu ainsi que de la date
            de modification.
          </Text>
          <Text>
            Enfin, il peut participer au contrôle de la qualité de la Plateforme en
            signalant/modifiant des erreurs ou omissions ainsi que les contenus n’ayant
            pas vocation à y figurer (illicites ou contraires aux CGU) aux administrateurs.
          </Text>
          <Title as="h2">Code de conduite et responsabilités des utilisateurs</Title>
          <Title as="h3" look="h6">Règles générales</Title>
          <Text>
            L’utilisation de la Plateforme est réservée aux agents de l’administration centrale
            et de leurs services déconcentrés en charge de l’enseignement supérieur et de la
            recherche à l’issue d’une procédure d’inscription modérée par un administrateur
            qui attribue des droits de visualisation et de modification en rapport avec la
            position de l’utilisateur dans une des organisations habilitées à accéder à
            l’application. Son utilisation est gratuite.
          </Text>
          <Title as="h3" look="h6">Contributions des utilisateurs concernant les fonctionnalités de l’application</Title>
          <Text>
            Les utilisateurs de Paysage ont été mobilisés et consultés au cours des
            différentes étapes de conception de la plate-forme. Ils sont invités à interagir
            avec l’équipe en charge de l’application au cours d’événements spécifiques, via
            le formulaire de contact disponible après identification
            (
            <a target="_blank" href="https://paysage.enseignementsup-recherche.gouv.fr/nous-contacter" rel="noreferrer">https://paysage.enseignementsup-recherche.gouv.fr/nous-contacter</a>
            )
            ou sur le site d’hébergement du code du logiciel (
            <a target="_blank" href="https://github.com/dataesr/paysage-ui/issues" rel="noreferrer">https://github.com/dataesr/paysage-ui/issues</a>
            ).
          </Text>
          <Title as="h3" look="h6">Contributions des utilisateurs concernant les données proposées par l’application</Title>
          <Text>
            Les utilisateurs de l’application sont invités à contribuer à l’amélioration, à
            l’enrichissement ou la correction des données restituées sur la plate-forme.
            Cette contribution est libre et non modérée a priori. Toutefois les données
            sont supervisées en continu par l’équipe en charge de l’application. Il n’en
            reste pas moins que la pertinence de l’application repose sur la qualité, la
            réactivité et la quantité des contributions des utilisateurs. Il est donc attendu
            des contributions professionnelles et réfléchies dont la qualité, par l’affichage
            du nom du contributeur associé à sa contribution, est imputée publiquement à
            chaque utilisateur nominativement. En cas d’incertitude sur une contribution il
            est attendu des utilisateurs qu’ils s’abstiennent ou, mieux, qu’ils s’en ouvrent
            à l’équipe d’administration.
          </Text>
          <Text>
            L’usage de Paysage à d’autres fins que la consultation des informations ou la
            réalisation de contributions dans le cadre des missions de service public des
            utilisateurs est interdite. L’équipe en charge de l’application suspendra sans
            avertissement les comptes des utilisateurs qui dérogeraient à ce principe.
          </Text>
          <Title as="h2">Engagements et responsabilités de l’équipe Paysage</Title>
          <Text>
            L’équipe Paysage s’efforce de garantir la disponibilité de la plateforme 99,5 %
            du temps mensuel, apprécié au terme de chaque mois. Elle s’attache à la sécurité
            et à l’intégrité des données présentées sur la plate-forme ainsi qu’à la maîtrise
            de sa population d’utilisateurs notamment en testant régulièrement la validité
            des adresses utilisées pour les connexions ou en exigeant une réinitialisation
            des mots de passe.
          </Text>
          <Text>
            L’équipe Paysage s’efforce d’accompagner ses utilisateurs notamment les nouveaux
            et ceux souhaitant contribuer activement à l’enrichissement de l’application.
            Elle propose des supports de formation et organise des démonstrations et formations
            standards ou ad hoc en fonction des besoins des services.
          </Text>
          <Text>
            L’équipe Paysage s’efforce d’effectuer un contrôle a posteriori des contributions
            de ses utilisateurs quitte à revenir sur certaines si elles sont erronées ou si
            elles sont en contradiction avec les règles de bonne pratique en matière de
            contribution.
          </Text>
          <Text>
            L’équipe Paysage peut choisir de donner accès à certaines de ses API à des
            applications tierces dans le respect des règles de diffusion de l’information.
          </Text>
          <Text>
            L’équipe Paysage se réserve la liberté de faire évoluer, de modifier ou de
            suspendre, sans préavis, la Plateforme pour des raisons de maintenance ou pour
            tout autre motif jugé nécessaire. Dans ce cas, l’équipe Paysage s’efforce
            d’informer ses utilisateurs.
          </Text>
          <Title as="h2">Licence et code source</Title>
          <Text>
            Sauf exception les données de Paysage sont couverte par la licence ouverte (voir :
            {' '}
            <a target="_blank" href="https://www.data.gouv.fr/licences" rel="noreferrer">https://www.data.gouv.fr/licences</a>
            ).
          </Text>
          <Text>
            Le code source de la plateforme est libre et disponible
            {' '}
            <a target="_blank" href="https://github.com/dataesr" rel="noreferrer">ici</a>
            {' '}
            sous licence MIT.
          </Text>
          <Title as="h2">Évolution des conditions d’utilisation</Title>
          <Text>
            Les termes des présentes conditions d’utilisation peuvent être amendés à tout
            moment, sans préavis, en fonction des modifications apportées à la plateforme,
            de l’évolution de la législation ou pour tout autre motif jugé nécessaire.
          </Text>
          <Title as="h2">Vie privée et données personnelles</Title>
          <Text>
            Le site « paysage.enseignementsup-recherche.gouv.fr » constitue un traitement
            de données à caractère personnel mis en œuvre par le ministère en charge de
            l’enseignement supérieur et de la recherche (1 rue Descartes, 75231 Paris Cedex 5)
            pour l’exécution d’une mission d’intérêt public au sens du e) de l’article 6
            du règlement général (UE) 2016/679 du Parlement européen et du Conseil du 27
            avril 2016 sur la protection des données (RGPD).
          </Text>
          <Title as="h3" look="h6">Utilisateurs - Données à caractère personnel</Title>
          <Text>
            Le site utilise Matomo, un outil libre, paramétré pour effectuer un suivi
            statistique anonyme de l’utilisation de l’application. Il respecte les conditions
            d’exemption du consentement de l’internaute définies par la Commission nationale
            informatique et libertés (CNIL). Les données brutes anonymisées sont conservées
            15 jours avant agrégation.
          </Text>
          <Text>
            Le site stocke le token de connexion de l’utilisateur dans l’espace de stockage de
            son navigateur afin de lui permettre d’accéder au service. Le site stocke le
            prénom, le nom, la fonction et l’adresse mail professionnelle de ses utilisateurs,
            informations nécessaires au fonctionnement de l’application. Le site stocke ainsi,
            sans limitation de durée, l’historique des contributions de chaque utilisateur.
            Cette pratique a pour objectif de renforcer l’engagement des utilisateurs, la
            valorisation des contributions et la traçabilité des informations fruits des
            contributions des utilisateurs.
          </Text>
          <Title as="h3" look="h6">Personnes – Données à caractère personnel</Title>
          <Text>
            Pour effectuer des traitements statistiques, pour faciliter la prise de contact
            entre les administrations en charge de l’enseignement supérieur, de la recherche
            et de l’innovation et les acteurs de terrains, Paysage recense autant que
            possible les personnes à forte visibilité administratives ou scientifiques
            c’est-à-dire celles disposant de fonctions officielles ou celles disposant
            d’une forte visibilité conséquence de leur rayonnement académique ou scientifique
            perceptible notamment par l’attribution de prix et distinctions. Pour ces
            personnes, les informations suivantes sont recueillies, traitées,
            conservées/supprimées dans les conditions décrites dans le tableau ci-dessous :
          </Text>
          <div className="fr-table fr-table--bordered">
            <table>
              <caption>Résumé de collecte de données à caractère personnel</caption>
              <thead>
                <tr>
                  <th colSpan="3" scope="colgroup">Catégories des données à caractère personnel pouvant être collectées pour chaque personne</th>
                </tr>
                <tr>
                  <th scope="col">Catégories des données à caractère personnel collectées pour chaque personne</th>
                  <th scope="col">Détail des données traitées pour chaque catégorie </th>
                  <th scope="col">Justification de la collecte de ces données</th>
                  <th scope="col">Durée de conservation </th>
                  <th scope="col">Destinataires pour chaque catégorie de données (y compris les sous-traitants éventuels)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Données d'identité</td>
                  <td>Nom Prénom</td>
                  <td>Identification</td>
                  <td>Les données sont conservées jusqu'à la fin de l'activité de Paysage</td>
                  <td>Communauté des utilisateurs</td>
                </tr>
                <tr>
                  <td>Données d'identité</td>
                  <td>Numéro de téléphone professionnel</td>
                  <td>Prise de contact par les services AC et déconcentrés dans le cadre de leurs missions</td>
                  <td>Associé au(x) mandat(s) en cours et supprimé(s) à l’issue de la fin d’activité</td>
                  <td>Communauté des utilisateurs</td>
                </tr>
                <tr>
                  <td>Données d'identité</td>
                  <td>Adresse mail</td>
                  <td>Prise de contact par les services AC et déconcentrés dans le cadre de leurs missions</td>
                  <td>Associé au(x) mandat(s) en cours et supprimé(s) à l’issue de la fin d’activité</td>
                  <td>Communauté des utilisateurs</td>
                </tr>
                <tr>
                  <td>Données d'identité</td>
                  <td>Identifiants externes (idref, Wikidata, ORCID)</td>
                  <td>
                    Désambiguïsation des homonymes, aide à la recherche d'information
                    pour les utilisateurs (liens de redirection fournis vers pages wikipedia,
                    ORCID, catalogue Sudoc, theses.fr, ...
                  </td>
                  <td>Les données sont conservées jusqu'à la fin de l'activité de Paysage</td>
                  <td>Communauté des utilisateurs</td>
                </tr>
                <tr>
                  <td>Données d'identité</td>
                  <td>Genre</td>
                  <td>
                    prise de contact (courriers personnalisés) par les services AC et
                    déconcentrés dans le cadre de leur mission et traitements statistiques
                    liés aux problématiques de parité
                  </td>
                  <td>Les données sont conservées jusqu'à la fin de l'activité de Paysage</td>
                  <td>Communauté des utilisateurs</td>
                </tr>
                <tr>
                  <td>Données relatives aux fonctions et responsabilités exercées dans le domaine de l'enseignement supérieur, de la recherche et de l'innovation</td>
                  <td>Fonctions et responsabilités officielles (structure associée, intitulés exact et simplifié de la fonction, dates de début et de fin)</td>
                  <td>
                    prise de contact (courriers personnalisés) par les services AC et
                    déconcentrés dans le cadre de leur mission et traitements statistiques
                    liés aux problématiques de parité ou aux trajectoires professionnelles
                  </td>
                  <td>Les données sont conservées jusqu'à la fin de l'activité de Paysage</td>
                  <td>Communauté des utilisateurs</td>
                </tr>
                <tr>
                  <td>Données relatives aux prix et distinctions obtenues en liens avec une activité de recherche, d'innovation ou d'enseignement supérieur</td>
                  <td>Prix et distinctions académiques reçus</td>
                  <td>
                    Etudes statistiques (genre/discrimination, trajectoire professionnelles)
                  </td>
                  <td>Les données sont conservées jusqu'à la fin de l'activité de Paysage</td>
                  <td>Communauté des utilisateurs</td>
                </tr>
                <tr>
                  <td>Données d'identité</td>
                  <td>Date de naissance - Date de décès</td>
                  <td>
                    Désambiguïsation des homonymes, aide à la prise en compte des critères d'âge dans les nominations, études statistiques sur les parcours professionnels
                  </td>
                  <td>Les données sont conservées jusqu'à la fin de l'activité de Paysage</td>
                  <td>Administrateurs</td>
                </tr>
                <tr>
                  <td>Données d'identité</td>
                  <td>Liens vers les textes officiels (Legifrance et BOESR) et comptes sociaux professionnels (Twitter, Linkedin, ResearchGate, Academia)</td>
                  <td>
                    Désambiguisation des homonymes, aide à la recherche d'information pour les utilisateurs (liens de redirection fournis vers pages wikipedia, ORCID, catalogue Sudoc, theses.fr, ...
                  </td>
                  <td>Les données sont conservées jusqu'à la fin de l'activité de Paysage ou l'obsolescence/disparition des liens</td>
                  <td>Communauté des utilisateurs</td>
                </tr>
              </tbody>
            </table>
          </div>

          <Text>
            Les personnes qui estimeraient faire partie du périmètre couvert par l’application disposent
            d’un droit d’accès, de rectification et de suppression.
          </Text>
          <Title as="h2">Accès aux données et exercice des droits d’accès, de rectification, de limitation et d’opposition</Title>
          <Text>
            Vous pouvez accéder aux données vous concernant et exercer vos droits d’accès, de rectification, de limitation, d’opposition que vous
            tenez des articles 15, 16, 18, et 21 du RGPD à l’adresse suivante : paysage@enseignementsup-recherche.gouv.fr
          </Text>
          <Text>
            De la même manière, vous pouvez exercer les droits prévus à l’article 85 de la loi n° 78-17 du 6 janvier 1978 relative à l’informatique, aux fichiers et aux libertés.
          </Text>
          <Text>
            Pour toute question concernant le traitement de vos données à caractère personnel, vous pouvez contacter le délégué à la protection des données
            du ministère de l’Enseignement supérieur et de la Recherche :
          </Text>
          <ul className="ul-styled">
            <Text as="li">à l’adresse électronique suivante : dpd@education.gouv.fr</Text>
            <Text as="li">via le formulaire de saisine en ligne : https://www.enseignementsup-recherche.gouv.fr/fr/nous-contacter-49937#dpd</Text>
            <Text as="li">
              ou par courrier adressé à :
              <br />
              <i>
                Ministère de l'Enseignement supérieur et de la Recherche
                <br />
                Délégué à la protection des données (DPD)
                <br />
                1, rue Descartes
                <br />
                75231 Paris Cedex 5
              </i>
            </Text>

          </ul>
          <Text>
            Si vous estimez, même après avoir introduit une réclamation auprès du ministère de l’Enseignement supérieur et de la Recherche,
            que vos droits en matière de protection des données à caractère personnel ne sont pas respectés, vous avez la possibilité
            d’introduire une réclamation auprès de la CNIL à l’adresse suivante : 3 Place de Fontenoy – TSA 80715 – 75334 Paris Cedex 07.
          </Text>
          <Text>
            Dans le cadre de l’exercice de vos droits, vous devez justifier de votre identité par tout moyen.
            En cas de doute sur votre identité, les services chargés du droit d’accès et le délégué à la protection des données se réservent
            le droit de vous demander les informations supplémentaires qui leur apparaissent nécessaires,
            y compris la photocopie d’un titre d’identité portant votre signature.
          </Text>
        </Col>

      </Row>
    </Container>
  );
}
