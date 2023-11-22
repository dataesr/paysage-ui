import { Accordion, AccordionItem, Col, Row } from '@dataesr/react-dsfr';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import { Bloc, BlocContent, BlocTitle } from '../../bloc';
import ModificationDetails from './components/modification-details';
import ModificationTitle from './components/modification-title';

const LAST_DAYS = 15;
const DATE = new Date(Date.now() - LAST_DAYS * 24 * 60 * 60 * 1000).toISOString();

export default function ModificationJournal() {
  const [openAccordions, setOpenAccordions] = useState([]);
  const { id: resourceId } = useParams();
  const url = resourceId
    ? `/journal?filters[resourceId]=${resourceId}&filters[createdAt][$gte]=${DATE}&sort=-createdAt&limit=100&filters[resourceType][$ne]=admin&filters[resourceType][$ne]=groups`
    : `/journal?filters[createdAt][$gte]=${DATE}&sort=-createdAt&limit=100&filters[resourceType][$ne]=admin`;
  const { data, error, isLoading } = useFetch(url);
  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h1" look="h3">Journal des modifications</BlocTitle>
      <BlocContent>
        <Row gutters>
          <Col n="12">
            <Accordion keepOpen>
              {data?.data?.length && data.data.map((event, i) => (
                <AccordionItem onClick={() => setOpenAccordions((prev) => [...prev, i])} key={event.createdAt} title={<ModificationTitle data={event} />}>
                  {openAccordions.includes(i) && <ModificationDetails data={event} />}
                </AccordionItem>
              ))}
            </Accordion>
          </Col>
        </Row>
      </BlocContent>
    </Bloc>
  );
}
