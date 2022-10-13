import { Row, Title, Icon } from '@dataesr/react-dsfr';
import Identifiers from '../../../components/blocs/identifiers';
import SocialMedias from '../../../components/blocs/social-medias';
import Weblinks from '../../../components/blocs/weblinks';
import Spinner from '../../../components/spinner';
import useFetch from '../../../hooks/useFetch';
import useHashScroll from '../../../hooks/useHashScroll';
import useUrl from '../../../hooks/useUrl';

export default function PersonPresentationPage() {
  useHashScroll();
  const { url } = useUrl();
  const { data, isLoading, error } = useFetch(url);
  if (isLoading) return <Row className="fr-my-2w flex--space-around"><Spinner /></Row>;
  if (error) return <Row className="fr-my-2w flex--space-around">Erreur...</Row>;
  return (
    <>
      <Row>
        <Title as="h2" look="h3">
          En un coup d’œil
          <Icon className="ri-eye-2-line fr-ml-1w" />
        </Title>
      </Row>
      <Row className="flex--col-reverse">
        <pre>
          {JSON.stringify(data, null, 2)}
        </pre>
      </Row>
      <Title as="h3" look="h4">Présence sur le web</Title>
      <Weblinks />
      <SocialMedias />
      <Identifiers />
    </>
  );
}
