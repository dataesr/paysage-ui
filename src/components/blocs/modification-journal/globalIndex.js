import React, { useState } from 'react';
import { Accordion, AccordionItem, Col, Pagination, Row, Tag, TagGroup, Text } from '@dataesr/react-dsfr';
import { useSearchParams } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import { Bloc, BlocContent, BlocTitle } from '../../bloc';
import ModificationDetails from './components/modification-details';
import ModificationTitle from './components/modification-title';
import useModificationData from './components/useModificationData';
import { PageSpinner } from '../../spinner';

const LAST_DAYS = 30;
const DATE = new Date(Date.now() - LAST_DAYS * 24 * 60 * 60 * 1000).toISOString();
const ITEMS_PER_PAGE = 50;

export default function GlobalModificationJournal() {
  const { topUsers } = useModificationData(LAST_DAYS);
  const [openAccordions, setOpenAccordions] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = searchParams.get('page') || 1;
  const id = searchParams.get('id');

  const limit = ITEMS_PER_PAGE;
  const skip = (page - 1) * limit;

  const url = id
    ? `/journal?filters[userId]=${id}&filters[createdAt][$gte]=${DATE}&sort=-createdAt&limit=${limit}&skip=${skip}&filters[resourceType][$ne]=admin`
    : `/journal?filters[createdAt][$gte]=${DATE}&sort=-createdAt&skip=${skip}&limit=${limit}&filters[resourceType][$ne]=admin`;

  const { data, error, isLoading } = useFetch(url);

  if (isLoading) return <PageSpinner />;
  if (!data?.data?.length) return `L'utilisateur n'a pas effectué de modification depuis les ${LAST_DAYS} derniers jours`;

  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h1" look="h3">
        Journal des modifications
      </BlocTitle>
      <BlocContent>
        <Row alignItems="middle" spacing="mb-1v">
          <Text className="fr-m-0" size="sm" as="span"><i>Filtrer par utilisateurs ayant effectué une modification dans les 30 derniers jours :</i></Text>
        </Row>
        <TagGroup>
          {topUsers.map((user) => (
            <Tag
              key={user._id}
              onClick={() => {
                if (id === user._id) {
                  setSearchParams({});
                } else { setSearchParams({ id: user._id }); }
              }}
              selected={id === user._id}
              className="no-span"
            >
              {user.displayName}
              {' '}
              (
              {user.totalOperations}
              )
            </Tag>
          ))}
        </TagGroup>
        <Row gutters>
          <Col n="12">
            <Accordion keepOpen>
              {data?.data.map((event, i) => (
                <AccordionItem
                  key={event.createdAt}
                  onClick={() => setOpenAccordions((prev) => [...prev, i])}
                  title={<ModificationTitle data={event} />}
                >
                  {openAccordions.includes(i) && <ModificationDetails data={event} />}
                </AccordionItem>
              ))}
              <Row className="flex--space-around fr-pt-3w">
                <Pagination
                  onClick={(newPage) => {
                    searchParams.set('page', newPage);
                    setSearchParams(searchParams);
                  }}
                  surroundingPages={2}
                  currentPage={Number(page)}
                  pageCount={data?.totalCount ? Math.ceil(data.totalCount / ITEMS_PER_PAGE) : 0}
                />
              </Row>
            </Accordion>
          </Col>
        </Row>
      </BlocContent>
    </Bloc>
  );
}
