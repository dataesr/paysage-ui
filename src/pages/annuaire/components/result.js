import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link, Row, Table, Text } from '@dataesr/react-dsfr';
import useFetch from '../../../hooks/useFetch';
import Button from '../../../components/button';
import { spreadByStatus } from '../../../components/blocs/relations/utils/status';
import { BlocFilter } from '../../../components/bloc';
import { exportToCsv } from '../../../components/blocs/relations/utils/exports';
import api from '../../../utils/api';

function addMonths(months) {
  const date = new Date();
  date.setMonth(date.getMonth() + months);

  return date.toISOString().split('T')[0];
}
function substractMonths(months) {
  const date = new Date();
  date.setMonth(date.getMonth() - months);

  return date.toISOString().split('T')[0];
}
function now() {
  return new Date().toISOString().split('T')[0];
}

function ND() {
  return <i className="fr-card__detail">NR</i>;
}

function Mailto({ email }) {
  return (
    <a style={{ wordBreak: 'break-all', wordSpacing: '-.4ch' }} href={`mailto:${email}`}>
      {/* eslint-disable-next-line react/prop-types */}
      {email?.split('@').map((part, i) => (
        <>
          {i === 1 ? '@' : null}
          {part}
          <br />
        </>
      ))}
    </a>
  );
}
Mailto.propTypes = {
  email: PropTypes.string,
};
Mailto.defaultProps = {
  email: '',
};

function formatDate(date) {
  if (!date) return null;
  if (date.length === 4) return date;
  try {
    const d = new Date(date);
    if (date.length === 7) return d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' });
    return d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return date;
  }
}

const otherColumns = [
  {
    name: 'person',
    label: 'Personne',
    sortable: true,
    render: ({ personId, person }) => <Link href={`/personnes/${personId}/mandats`}>{person}</Link>,
  },
  {
    name: 'relationType',
    label: 'Titre',
    sortable: true,
    render: ({ relationType, mandateTemporary, mandatePrecision }) => {
      if (mandatePrecision) return mandatePrecision;
      return `${relationType}${mandateTemporary ? ' par interim' : ''}`;
    },
  },
  {
    name: 'structure',
    label: 'Structure',
    sortable: true,
    render: ({ structureId, structureName }) => <Link href={`/structures/${structureId}/gouvernance-et-referents`}>{structureName}</Link>,
  },
  {
    name: 'startDate',
    label: 'Date de début',
    sortable: true,
    render: ({ startDate }) => formatDate(startDate) || <ND />,
    cellClassRender: ({ startDate }) => (startDate >= substractMonths(6) ? 'notice-success' : null),
  },
  {
    name: 'endDate',
    label: 'Date de fin',
    sortable: true,
    render: ({ endDate, endDatePrevisional }) => formatDate(endDate) || formatDate(endDatePrevisional) || <ND />,
    cellClassRender: ({ endDate, endDatePrevisional }) => {
      const date = endDate || endDatePrevisional;
      if (!date) return null;
      return ((date >= now() && date <= addMonths(6)) ? 'notice-error' : null);
    },
  },
];
const currentColumns = [
  ...otherColumns,
  {
    name: 'email',
    label: 'Email',
    render: ({ mandateEmail, personalEmail }) => {
      if (mandateEmail) return <Mailto email={mandateEmail} />;
      if (personalEmail) return <Mailto email={personalEmail} />;
      return <ND />;
    },
  },
  {
    name: 'mandatePhonenumber',
    label: 'Téléphone',
    render: ({ mandatePhonenumber }) => {
      if (!mandatePhonenumber) return <ND />;
      return <span style={{ whiteSpace: 'nowrap' }}>{mandatePhonenumber}</span>;
    },
  },
];

export default function Results() {
  const [searchParams] = useSearchParams({ limit: 1000 });
  const { data } = useFetch(`/annuaire?${searchParams.toString()}`);
  const { data: spreadedByStatusRelations, counts, defaultFilter } = spreadByStatus(data?.data);
  const [statusFilter, setStatusFilter] = useState(defaultFilter);

  return (
    <>
      <Row alignItems="bottom" className="fr-mt-3w">
        <div style={{ flexGrow: 1 }}>
          <Text bold size="lead" className="fr-mb-1w">
            {data?.totalCount}
            {' '}
            mandat
            {(data?.totalCount > 1) ? 's trouvés' : ' trouvé'}
            <Text as="span" className="fr-mb-1w">
              {' '}
              {data?.totalCount > 1000 && '(tableau limité à 1000 entrées)'}
            </Text>
          </Text>
        </div>
        {data?.totalCount > 0
          ? (
            <div>
              <Button
                icon="ri-download-line"
                size="sm"
                secondary
                onClick={async () => exportToCsv({
                  data: await api.get(`/annuaire/export?${searchParams.toString()}`, {}).then((res) => res.data),
                  fileName: 'annuaire',
                  listName: 'annuaire',
                  tag: 'gouvernance',
                })}
              >
                Télécharger la liste
              </Button>
            </div>
          )
          : null}
      </Row>
      <BlocFilter statusFilter={statusFilter} setStatusFilter={setStatusFilter} counts={counts} label="Fonctions" />
      <Row>
        <Table
          fixedLayout
          rowKey={(x) => x.id}
          data={spreadedByStatusRelations[statusFilter] || []}
          columns={statusFilter === 'current' ? currentColumns : otherColumns}
          pagination
          paginationPosition="center"
          perPage={10}
        />
      </Row>
    </>
  );
}
