import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Highlight,
  ModalContent,
  ModalTitle,
  Tag,
  TagGroup,
  Text,
} from '@dataesr/react-dsfr';
import { useNavigate } from 'react-router-dom';
import HistoDatesForm from './form';
import api from '../../../utils/api';
import Modal from '../../modal';
import { Bloc, BlocActionButton, BlocContent, BlocModal, BlocTitle } from '../../bloc';
import useToast from '../../../hooks/useToast';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import { formatDescriptionDates, toString } from '../../../utils/dates';

function HistoryCard({ creationDate, creationReason, closureDate, closureReason, creationOfficialText, closureOfficialText, predecessors, successors }) {
  const createReason = (creationReason && !['Non renseigné', 'autre', 'Création'].includes(creationReason)) && ` par ${creationReason.toLowerCase() }`;
  const closeReason = (closureReason && !['Non renseigné', 'autre', 'Création'].includes(closureReason)) && ` par ${closureReason.toLowerCase() }`;
  const navigate = useNavigate();
  if (!closureDate && !creationDate) return <Highlight>Aucune donnée historique</Highlight>;
  return (
    <div className="fr-card fr-card--xs fr-card--grey fr-card--no-border card-structures">
      <div className="fr-card__body">
        <div className="fr-card__content">
          <div className="fr-card__title">
            {creationDate && (
              <p className="fr-mb-1w">
                Créé
                {(creationDate.split('-').length === 1) ? ` en ${toString(creationDate)}` : ` le ${toString(creationDate)}`}
                {createReason}
                <br />
                {creationOfficialText?.id && (
                  <a className="fr-text--xs fr-text--regular fr-link--sm" href={creationOfficialText?.pageUrl} target="_blank" rel="noreferrer">
                    {creationOfficialText?.nature}
                    {' '}
                    {creationOfficialText?.publicationDate && formatDescriptionDates(creationOfficialText.publicationDate)}
                  </a>
                )}
              </p>
            )}
            <div>
              {(predecessors?.totalCount > 0) && (
                <div className="fr-card__desc">
                  <Text as="span" size="sm" bold>Prédécesseurs:</Text>
                  <TagGroup>
                    {predecessors.data.map(
                      ({ relatedObject: related }) => <Tag key={related.id} iconPosition="right" icon="ri-arrow-right-line" onClick={() => navigate(related.href)}>{related.displayName}</Tag>,
                    )}
                  </TagGroup>
                </div>
              )}
            </div>
            {(closureDate || (successors?.totalCount > 0)) && <hr />}
          </div>
          <div className="fr-card__title">
            {closureDate && (
              <p className="fr-text fr-mb-1v">
                Établissement fermé
                {' '}
                {formatDescriptionDates(closureDate)}
                {closeReason}
                <br />
                {closureOfficialText?.id && (
                  <a className="fr-text--xs fr-text--regular fr-link--sm" href={closureOfficialText?.pageUrl} target="_blank" rel="noreferrer">
                    {closureOfficialText?.nature}
                    {' '}
                    {closureOfficialText?.publicationDate && `du ${toString(closureOfficialText.publicationDate)}`}
                  </a>
                )}
              </p>
            )}
            <div>
              {(successors?.totalCount > 0) && (
                <div className="fr-card__desc">
                  <Text as="span" size="sm" bold>Successeurs:</Text>
                  <TagGroup>
                    {successors.data.map(
                      ({ resource: related }) => <Tag iconPosition="right" icon="ri-arrow-right-line" onClick={() => navigate(related.href)} key={related.id}>{related.displayName}</Tag>,
                    )}
                  </TagGroup>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

HistoryCard.propTypes = {
  creationDate: PropTypes.string,
  creationReason: PropTypes.string,
  closureDate: PropTypes.string,
  closureReason: PropTypes.string,
  creationOfficialText: PropTypes.object,
  closureOfficialText: PropTypes.object,
  predecessors: PropTypes.object,
  successors: PropTypes.object,
};

HistoryCard.defaultProps = {
  creationDate: null,
  creationReason: null,
  closureDate: null,
  closureReason: null,
  creationOfficialText: {},
  closureOfficialText: {},
  predecessors: {},
  successors: {},
};

export default function HistoriqueEtDates() {
  const { toast } = useToast();
  const { url, id } = useUrl('');
  const { data, isLoading, error, reload } = useFetch(url);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const { data: predecessors } = useFetch(`/relations?filters[relationTag]=predecesseurs&filters[resourceId]=${id}&limit=500`);
  const { data: successors } = useFetch(`/relations?filters[relationTag]=predecesseurs&filters[relatedObjectId]=${id}&limit=500`);

  const onSaveHandler = async (body) => {
    const response = await api.patch(url, body).catch(() => {
      toast({
        toastType: 'error',
        description: "Une erreur s'est produite",
      });
    });
    if (response.ok) {
      toast({
        toastType: 'success',
        description: 'Donnée mise à jour',
      });
      reload();
      setShowModal(false);
    }
  };

  const onClickHandler = () => {
    setModalTitle("Ajouter/Modifier l'historique");
    const body = {
      creationDate: data.creationDate || null,
      creationReason: data.creationReason || null,
      creationOfficialTextId: data.creationOfficialTextId || null,
      creationOfficialText: data.creationOfficialText || null,
      closureDate: data.closureDate || null,
      closureReason: data.closureReason || null,
      closureOfficialTextId: data.closureOfficialTextId || null,
      closureOfficialText: data.closureOfficialText || null,
    };
    setModalContent(
      <HistoDatesForm
        data={body}
        onSaveHandler={onSaveHandler}
      />,
    );
    setShowModal(true);
  };

  if (data?.creationDate || data?.closureDate) {
    data.totalCount = 1; // Pour la gestion de l'affichage dans "Bloc"
  }

  return (
    <Bloc isLoading={isLoading} error={error} data={data} noBadge>
      <BlocTitle as="h3" look="h6">Historique & dates</BlocTitle>
      <BlocActionButton onClick={onClickHandler}>Modifier l'historique</BlocActionButton>
      <BlocContent>
        <HistoryCard {...data} predecessors={predecessors} successors={successors} />
      </BlocContent>
      <BlocModal>
        <Modal isOpen={showModal} size="lg" hide={() => setShowModal(false)}>
          <ModalTitle>{modalTitle}</ModalTitle>
          <ModalContent>{modalContent}</ModalContent>
        </Modal>
      </BlocModal>
    </Bloc>
  );
}
