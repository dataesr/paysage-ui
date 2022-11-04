import PropTypes from 'prop-types';
import {
  Icon,
  Modal,
  ModalContent,
  ModalTitle,
} from '@dataesr/react-dsfr';
import { useState } from 'react';
import ExpendableListCards from '../../card/expendable-list-cards';
import api from '../../../utils/api';
import WeblinkForm from '../../forms/weblinks';
import { Bloc, BlocActionButton, BlocContent, BlocModal, BlocTitle } from '../../bloc';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import useEnums from '../../../hooks/useEnums';
import useNotice from '../../../hooks/useNotice';
import { deleteError, saveError, saveSuccess, deleteSuccess } from '../../../utils/notice-contents';
import Button from '../../button';
import useEditMode from '../../../hooks/useEditMode';

export default function Weblinks({ types, title }) {
  const { editMode } = useEditMode();
  const { url, apiObject } = useUrl('weblinks');
  const { data, isLoading, error, reload } = useFetch(url);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const { weblinks } = useEnums();
  const { notice } = useNotice();
  const options = types?.length
    ? weblinks[apiObject]?.filter((type) => types.includes(type.value))
    : weblinks[apiObject];

  const onSaveHandler = async (body) => {
    const method = body.id ? 'patch' : 'post';
    const saveUrl = body.id ? `${url}/${body.id}` : url;
    await api[method](saveUrl, body)
      .then(() => { notice(saveSuccess); reload(); })
      .catch(() => notice(saveError));
    return setShowModal(false);
  };

  const onDeleteHandler = async (itemId) => {
    await api.delete(`${url}/${itemId}`)
      .then(() => { notice(deleteSuccess); reload(); })
      .catch(() => notice(deleteError));
    return setShowModal(false);
  };
  const onOpenModalHandler = (element) => {
    setModalTitle(element?.id ? "Modification d'un lien" : "Ajout d'un lien");
    setModalContent(
      <WeblinkForm
        id={element?.id}
        data={element || {}}
        onDelete={onDeleteHandler}
        onSave={onSaveHandler}
        options={options}
      />,
    );
    setShowModal(true);
  };

  const getElementsCount = () => {
    if (!data) return null;
    return types?.length ? data.data.filter((el) => types.includes(el.type))?.length : data.data.length;
  };

  const renderIcon = (iconType) => {
    let rxIcon = '';

    switch (iconType) {
    case 'Facebook':
      rxIcon = 'ri-facebook-fill';
      break;
    default:
      rxIcon = 'ri-global-line';
      break;
    }

    return (
      <Icon className="fr-mb-1w fr-pt-1w" name={rxIcon} size="3x" color={`var(--${apiObject}-color)`} />
    );
  };

  const renderCards = () => {
    if (!data) return null;
    const filteredList = types.length
      ? data.data.filter((el) => types.includes(el.type))
      : data.data;
    const list = filteredList.map((el) => (
      <div key={el.id} className="fr-card fr-card--sm fr-card--grey fr-card--no-border">
        <div className={`fr-card__body ${!editMode && 'fr-enlarge-link'}`}>
          <div className="fr-card__content">
            <div className="flex-col flex--center">
              {renderIcon(el.type)}
              <span className="fr-text fr-text--sm fr-text--bold fr-m-0 flex-col">
                <a className="fr-mb-0 fr-text fr-text--sm text-center" href={el.url} target="_blank" rel="noreferrer">
                  {options?.find((type) => (el.type === type.value))?.label}
                  {el.language && ` (${el.language})`}
                </a>
                <span className="only-print">{el.url}</span>
              </span>
            </div>
            {editMode && <Button color="text" size="md" onClick={() => onOpenModalHandler(el)} tertiary borderless rounded icon="ri-edit-line" className="edit-button" />}
          </div>
        </div>
      </div>
    ));
    return <ExpendableListCards list={list} nCol="12 lg-6 md-12 sm-6" order={types} sortOn="props.type" />;
  };

  return (
    <Bloc isLoading={isLoading} error={error} data={{ totalCount: getElementsCount() }}>
      <BlocTitle as="h4" look="h6">{title}</BlocTitle>
      <BlocActionButton onClick={onOpenModalHandler} isSmall>Ajouter un lien</BlocActionButton>
      <BlocContent>{renderCards()}</BlocContent>
      <BlocModal>
        <Modal canClose={false} isOpen={showModal} size="lg" hide={() => setShowModal(false)}>
          <ModalTitle>{modalTitle}</ModalTitle>
          <ModalContent>{modalContent}</ModalContent>
        </Modal>
      </BlocModal>
    </Bloc>
  );
}

Weblinks.propTypes = {
  types: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
};

Weblinks.defaultProps = {
  types: [],
  title: 'Liens web',
};
