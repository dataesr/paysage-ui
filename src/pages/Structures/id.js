import { useParams, Link as RouterLink } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Col, Container, Row, Tag, Title } from '@dataesr/react-dsfr';

import useFetch from '../../hooks/useFetch';

// import Localisations from '../../components/Blocs/Localisations';
import Emails from '../../components/Blocs/Emails';
// import Names from '../../components/Blocs/Names';
import Identifiers from '../../components/Blocs/Identifiers';
import Weblinks from '../../components/Blocs/Weblinks';
import SocialMedias from '../../components/Blocs/SocialMedias';
// import OfficialTexts from '../../components/Blocs/OfficialTexts';
import Documents from '../../components/Blocs/Documents';
import Sidemenu from '../../components/Sidemenu';
import Spinner from '../../components/Spinner';

export default function StructuresByIdPage() {
  const { id } = useParams();

  const { data, isLoading, error } = useFetch('GET', `/structures/${id}`);

  if (isLoading) return <Spinner size={48} />;
  if (error) return <>Erreur...</>;
  return (
    <Container spacing="py-6w">
      <Row>
        <Col n="12 md-3">
          <Sidemenu />
        </Col>

        <Col n="12 md-9">
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>Acceuil</BreadcrumbItem>
            <BreadcrumbItem asLink={<RouterLink to="/rechercher/structures" />}>Structures</BreadcrumbItem>
            <BreadcrumbItem>{data.currentName.usualName}</BreadcrumbItem>
          </Breadcrumb>
          <Title as="h2">{data.currentName.usualName}</Title>
          <Tag className="mx-1 bg-structures">Structure</Tag>
          <Tag className="mx-1 bg-success">
            {data.structureStatus}
          </Tag>

          {/* <Localisations apiObject="structures" id={id} /> */}
          <Emails apiObject="structures" id={id} />
          {/* <Names apiObject="structures" id={id} /> */}
          <Identifiers apiObject="structures" id={id} />
          <Weblinks apiObject="structures" id={id} />
          <SocialMedias apiObject="structures" id={id} />
          <Documents apiObject="structures" id={id} />
          {/* <OfficialTexts apiObject="structures" id={id} /> */}

          {/* <div>
                <pre>{JSON.stringify(getData.data, null, 2)}</pre>
              </div> */}
        </Col>
      </Row>
    </Container>
  );
}
