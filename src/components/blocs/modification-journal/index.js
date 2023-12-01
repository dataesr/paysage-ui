import React, { useState } from 'react';
import { Accordion, AccordionItem, Col, Pagination, Row } from '@dataesr/react-dsfr';
import { useParams, useSearchParams } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import { Bloc, BlocContent, BlocTitle } from '../../bloc';
import ModificationDetails from './components/modification-details';
import ModificationTitle from './components/modification-title';

const LAST_DAYS = 15;
const DATE = new Date(Date.now() - LAST_DAYS * 24 * 60 * 60 * 1000).toISOString();

export default function ModificationJournal() {
  const [openAccordions, setOpenAccordions] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page') || 1;
  const limit = 50;
  const skip = (page - 1) * 50;
  const { id: resourceId } = useParams();
  const url = resourceId
    ? `/journal?filters[resourceId]=${resourceId}&filters[createdAt][$gte]=${DATE}&sort=-createdAt&skip=${skip}&limit=${limit}&filters[resourceType][$ne]=admin&filters[resourceType][$ne]=groups`
    : `/journal?filters[createdAt][$gte]=${DATE}&sort=-createdAt&skip=${skip}&limit=${limit}&filters[resourceType][$ne]=admin`;

  const { data, error, isLoading } = useFetch(url);
  if (!data?.totalCount) {
    return null;
  }

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
        <Row className="flex--space-around fr-pt-3w">
          <Pagination
            onClick={(newPage) => setSearchParams({ page: newPage })}
            surrendingPages={2}
            currentPage={Number(page)}
            pageCount={data?.totalCount ? Math.ceil(data.totalCount / limit) : 0}
          />
        </Row>
      </BlocContent>
    </Bloc>
  );
}
