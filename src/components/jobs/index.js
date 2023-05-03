import { Breadcrumb, BreadcrumbItem, Col, Container, Highlight, Row } from '@dataesr/react-dsfr';
import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Spinner } from '../spinner';
import ScatterPlot from './components/scatterplot';
import useJobs from './hooks/useJobs';
import './styles/jobs.scss';

const pageSize = 10;

function getStatusLabel(status) {
  return { success: 'Succès', failed: 'Echec', scheduled: 'Prévu', running: 'En cours' }[status];
}

export default function Runs() {
  const [name, setName] = useState('all');
  const [status, setStatus] = useState('all');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const url = useMemo(() => {
    const skip = (page - 1) * pageSize;
    const statusFilter = (status !== 'all') ? `&filters[status]=${status}` : '';
    const nameFilter = (name !== 'all') ? `&filters[name]=${name}` : '';
    return `/jobs?skip=${skip}&limit=${pageSize}${nameFilter}${statusFilter}`;
  }, [name, status, page]);
  const { createJob, deleteJob, isLoading, error, jobs, totalCount, aggregations, selected, setSelected } = useJobs(url);
  const { byStatus, activity, byName, definitions } = aggregations || {};
  const statusesOptions = (byStatus?.length > 0)
    ? byStatus.reduce((acc, cur) => [...acc, { value: cur._id, label: `${getStatusLabel(cur._id)} (${cur.count})` }], [{ value: 'all', label: 'Tous les status' }])
    : [{ value: 'all', label: 'Toutes les tâches' }];
  const namesOptions = (byName?.length > 0)
    ? byName.reduce((acc, cur) => [...acc, { value: cur._id, label: `${cur._id} (${cur.count})` }], [{ value: 'all', label: 'Toutes les tâches' }])
    : [{ value: 'all', label: 'Toutes les tâches' }];
  return (
    <Container fluid className="fr-mb-5w">
      <Row>
        <Col>
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>Accueil</BreadcrumbItem>
            <BreadcrumbItem asLink={<RouterLink to="/admin" />}>Administration</BreadcrumbItem>
            <BreadcrumbItem asLink={<RouterLink to="/admin/taches" />}>Tâches du système</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      {/* <Row className="flex flex--baseline">
        <Title as="h1" look="h5" className="flex--grow">
          Tâches du système
        </Title>
        <Button color="success" size="sm" icon="ri-add-line" onClick={() => setIsNewModalOpen(true)}>
          Nouvelle tâche
        </Button>
        <Modal isOpen={isNewModalOpen} hide={() => setIsNewModalOpen(false)}>
          <ModalTitle>Créer un nouvelle tâche</ModalTitle>
          <ModalContent>
            <CreateTaskForm
              definitions={definitions}
              onCancel={() => setIsNewModalOpen(false)}
              onCreate={(body) => { createJob(body); setIsNewModalOpen(false); }}
            />
          </ModalContent>
        </Modal>
      </Row>
      <Row gutters>
        <Col n="12 md-6">
          <Select
            label="Filtrer par tâche"
            options={namesOptions}
            name="name"
            selected={name}
            onChange={(e) => { setName(e.target.value); setStatus('all'); setPage(1); }}
          />
        </Col>
        <Col n="12 md-6">
          <Select
            label="Filtrer par status"
            options={statusesOptions}
            selected={status}
            name="status"
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          />
        </Col>
      </Row> */}
      <Row className="fr-mt-3w">
        <p className="fr-m-0 fr-text--md fr-text--bold fr-pb-1w">
          Activité des 7 derniers jours
        </p>
      </Row>
      <Row className="fr-mb-3w">
        {(activity?.length > 0)
          ? <ScatterPlot data={activity} />
          : (
            <Col className="fr-pt-3w">
              <Highlight>
                Aucune activité pour cette tâches les 7 derniers jours
              </Highlight>
            </Col>
          )}
      </Row>
      {(totalCount) && (
        <Row>
          <p className="fr-m-0 fr-text--md fr-text--bold fr-pb-2w">
            {totalCount}
            {' '}
            résultats
          </p>
          {(isLoading) && <Spinner size="24px" />}
        </Row>
      )}
      {/* {(error) && <Error />}
      <Row gutters>
        <Col n="7">
          {(!error && totalCount === 0) && (
            <Highlight colorFamily="green-emeraude">
              Aucune tâche
            </Highlight>
          )}
          {(!error && jobs?.length > 0) && (
            <>
              <JobList jobs={jobs} selected={selected} setSelected={setSelected} />
              <Row className="flex--space-around fr-pt-3w">
                <Pagination surrendingPages={2} currentPage={Number(page)} pageCount={Math.ceil(totalCount / pageSize)} onClick={(currentPage) => { setPage(currentPage); setSelected({}); }} />
              </Row>
            </>
          )}
        </Col>
        {(!error && selected) && (
          <Col n="5">
            <SelectedJob job={selected} createJob={createJob} deleteJob={deleteJob} />
          </Col>
        )}
      </Row> */}
    </Container>
  );
}
