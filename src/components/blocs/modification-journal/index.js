import React, { useState } from 'react';
import { Accordion, AccordionItem, Col, Pagination, Row, Tag, TagGroup } from '@dataesr/react-dsfr';
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
  const [filterName, setFilterName] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

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
  const uniqueUserNames = Array.from(
    new Set(data?.data?.map((el) => `${el.user.firstName} ${el.user.lastName}`) || []),
  );

  const handleUserFilter = (userName) => {
    setSearchParams({ page: 1 });
    setSelectedUser((prevSelectedUser) => (prevSelectedUser === userName ? '' : userName));

    setFilterName(userName);
  };

  const sortedUniqueUserNames = [...uniqueUserNames].sort((a, b) => {
    const countA = data.data.filter(
      (event) => `${event.user.firstName} ${event.user.lastName}` === a,
    ).length;

    const countB = data.data.filter(
      (event) => `${event.user.firstName} ${event.user.lastName}` === b,
    ).length;
    return countB - countA;
  });

  return (
    <Bloc isLoading={isLoading} error={error} data={data}>
      <BlocTitle as="h1" look="h3">Journal des modifications</BlocTitle>
      <BlocContent>
        <TagGroup>
          {sortedUniqueUserNames.map((userName) => {
            const modificationsCount = data?.data?.filter(
              (el) => `${el.user.firstName} ${el.user.lastName}` === userName,
            ).length;
            return (
              <Tag
                onClick={() => handleUserFilter(userName)}
                selected={selectedUser === userName}
                className="no-span"
              >
                {userName}
                {' '}
                (
                {modificationsCount}
                )
              </Tag>
            );
          })}
        </TagGroup>
        <Row gutters>
          <Col n="12">
            <Accordion keepOpen>
              {data?.data?.length > 0
            && data.data.map((event, i) => (
              (!filterName || filterName === `${event.user.firstName} ${event.user.lastName}`) && (
                <AccordionItem
                  onClick={() => setOpenAccordions((prev) => [...prev, i])}
                  key={event.createdAt}
                  title={<ModificationTitle data={event} />}
                >
                  {openAccordions.includes(i) && <ModificationDetails data={event} />}
                </AccordionItem>
              )
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
