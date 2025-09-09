import { Modal, ModalContent, ModalTitle, Pagination, Row } from '@dataesr/react-dsfr';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Bloc, BlocActionButton, BlocContent, BlocModal, BlocTitle } from '../../bloc';
import useFetch from '../../../hooks/useFetch';
import useNotice from '../../../hooks/useNotice';
import api from '../../../utils/api';
import { deleteError, deleteSuccess, saveError, saveSuccess } from '../../../utils/notice-contents';
import DomainsForm from './components/form';
import DomainsList from './components/domains-list';

const ITEMS_PER_PAGE = 50;

export default function Domains() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = searchParams.get('page') || 1;
  const q = searchParams.get('query') || '';

  const limit = ITEMS_PER_PAGE;
  const skip = (page - 1) * limit;
  let url = `/domains?limit=${limit}&skip=${skip}`;
  if (q) url += `&query=${q}`;
  const { data, isLoading, error, reload } = useFetch(url);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState(q);
  const [options, setOptions] = useState([]);
  const { notice } = useNotice();

  const handleSearch = (e) => {
    e.preventDefault();
    return setSearchParams({ query: searchTerm, page: 1 });
  };

  const onSave = (body) => api.post('/domains', body)
    .then((response) => {
      if (response.ok) {
        notice(saveSuccess);
        reload();
      } else {
        notice(saveError);
      }
    })
    .catch(() => notice(saveError))
    .finally(() => setShowModal(false));

  const onDelete = async (id, archive = true) => {
    if (archive) {
      return api.patch(`/domains/${id}`, { archived: true })
        .then(() => {
          notice(deleteSuccess);
          reload();
        })
        .catch(() => notice(deleteError));
    }
    return api.delete(`/domains/${id}`)
      .then(() => {
        notice(deleteSuccess);
        reload();
      })
      .catch(() => notice(deleteError));
  };

  const restore = (id) => api.patch(`/domains/${id}`, { archived: false })
    .then(() => {
      notice(deleteSuccess);
      reload();
    })
    .catch(() => notice(deleteError));

  const deleteStructure = (id, structId) => api.delete(`/domains/${id}/structures/${structId}`)
    .then(() => {
      notice(deleteSuccess);
      reload();
    })
    .catch(() => notice(deleteError));

  const addStructure = (id, body) => api.post(`/domains/${id}/structures`, body)
    .then((response) => {
      if (response.ok) {
        notice(saveSuccess);
        reload();
      } else {
        notice(saveError);
      }
    })
    .catch(() => notice(saveError));

  useEffect(() => {
    const getAutocompleteResult = async () => {
      const response = await api.get(`/domains?limit=5&query=${searchTerm}`);
      setOptions(response.data?.data);
    };
    if (searchTerm) { getAutocompleteResult(); } else { setOptions([]); }
  }, [searchTerm]);

  return (
    <Bloc isLoading={isLoading} error={error} data={data} forceActionDisplay forceContentDisplay>
      <BlocTitle as="h1" look="h4">
        Noms de domaine
      </BlocTitle>
      <BlocActionButton onClick={() => setShowModal((prev) => !prev)}>
        Ajouter un nom de domaine
      </BlocActionButton>
      <BlocContent>
        <form onSubmit={(e) => handleSearch(e)} className="fr-search-bar fr-my-4w" role="search">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="fr-label" htmlFor="search-input">Rechercher un domaine</label>
          <input
            className="fr-input"
            placeholder="Rechercher un domaine"
            id="search-input"
            type="search"
            list="domains"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <datalist id="domains">
            {options.map((option) => (
              <option key={option.id} value={option.domainName}>
                {option.domainName}
              </option>
            ))}
          </datalist>
          <button title="Rechercher" type="submit" className="fr-btn">Rechercher</button>
        </form>
        {
          !data?.data?.length
            ? 'Aucun résultat'
            : (
              <>
                <DomainsList data={data?.data} restore={restore} deleteItem={onDelete} deleteStructure={deleteStructure} addStructure={addStructure} />
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
              </>
            )
        }
      </BlocContent>
      <BlocModal>
        <Modal isOpen={showModal} size="lg" hide={() => setShowModal(false)}>
          <ModalTitle>Nouveau nom de domaine</ModalTitle>
          <ModalContent>
            <DomainsForm onSave={onSave} />
          </ModalContent>
        </Modal>
      </BlocModal>
    </Bloc>
  );
}
