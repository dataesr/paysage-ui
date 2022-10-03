import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardDescription, CardTitle, Col, Row } from '@dataesr/react-dsfr';
import { Bloc, BlocActionButton, BlocContent, BlocTitle } from '../../bloc';
import useBlocUrl from '../../../hooks/useBlocUrl';
import useFetch from '../../../hooks/useFetch';

export default function OfficialTextsComponent() {
  const { id } = useParams();
  const { url } = useBlocUrl();
  const { data, isLoading, error } = useFetch(`/official-texts?filters[relatesTo]=${id}`);
  const navigate = useNavigate();

  const renderCards = () => {
    if (!data && !data?.data?.length) return null;
    return (
      <Row gutters>
        {data.data.map((item) => (
          <Col n="4" key={item.id}>
            <Card
              hasArrow
              href={`/textes-officiels/${item.id}/${url}`}
            >
              <CardTitle>{item.type}</CardTitle>
              <CardDescription>
                {item.title}
                <p className="fr-mt-2 italic">{`publié le ${item.publicationDate}`}</p>
              </CardDescription>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h3" look="h6">Textes officiels</BlocTitle>
      <BlocActionButton onClick={() => navigate(`/textes-officiels/ajouter?redirect=${url}/textes-officiels`)}>
        Ajouter un texte officiel
      </BlocActionButton>
      <BlocContent>{renderCards()}</BlocContent>
    </Bloc>
  );
}
