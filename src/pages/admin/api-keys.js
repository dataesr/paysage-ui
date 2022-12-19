import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Col, Modal, ModalTitle, ModalContent, Row, Tag, Text, Title } from '@dataesr/react-dsfr';
import Button from '../../components/button';
import useFetch from '../../hooks/useFetch';
import api from '../../utils/api';
import { Bloc, BlocActionButton, BlocContent, BlocModal, BlocTitle } from '../../components/bloc';
import useNotice from '../../hooks/useNotice';
import { saveError, saveSuccess, deleteSuccess, deleteError } from '../../utils/notice-contents';
import useEditMode from '../../hooks/useEditMode';

export default function ApiKeysPage() {
  const url = '/admin/api-keys';
  const { data, isLoading, error, reload } = useFetch(`${url}?limit=500`);
  const [isOpen, setIsOpen] = useState();
  const { notice } = useNotice();
  const { setEditMode } = useEditMode();

  useEffect(() => setEditMode(true), [setEditMode]);

  const onSaveHandler = async (body) => {
    await api.post(url, body)
      .then(() => { notice(saveSuccess); reload(); })
      .catch(() => notice(saveError));
    return setIsOpen(false);
  };

  const onDeleteHandler = async (itemId) => {
    await api.delete(`${url}/${itemId}`)
      .then(() => { notice(deleteSuccess); reload(); })
      .catch(() => notice(deleteError));
    return setIsOpen(false);
  };

  // const renderGroups = () => {
  //   if (!data || !data.data?.length) return null;
  //   return data.data.map((group) => (
  //     <Col n="12" key={group.id}>
  //       <Row className="flex--space-between">
  //         <div className="flex--grow fr-pl-2w">
  //           <Text spacing="my-1v" bold size="lg">{`${group.name} ${group.acronym ? `(${group.acronym})` : ''}`.trim()}</Text>
  //           <Text as="span" bold>
  //             Autres noms :
  //           </Text>
  //           {group.otherNames.length ? group.otherNames.map((name) => <Tag key="name" as="span">{name}</Tag>) : <Text as="span">Aucun alias pour le moment</Text>}
  //         </div>
  //         <div>
  //           <Button size="sm" secondary icon="ri-edit-line" onClick={() => handleModalToggle(group)}>Editer</Button>
  //         </div>
  //       </Row>
  //       <hr />
  //     </Col>
  //   ));
  // };
  if (error) return <div>Erreur</div>;
  if (isLoading) return <div>Chargement</div>;
  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem asLink={<RouterLink to="/" />}>Accueil</BreadcrumbItem>
        <BreadcrumbItem asLink={<RouterLink to="/admin" />}>Administration</BreadcrumbItem>
        <BreadcrumbItem>Clés API</BreadcrumbItem>
      </Breadcrumb>
      <Bloc isLoading={isLoading} error={error} data={data}>
        <BlocTitle as="h3" look="h4">Clés API</BlocTitle>
        <BlocActionButton onClick={() => setIsOpen(true)}>Créer un groupe</BlocActionButton>
        <BlocContent>
          { (data?.data?.length > 0)
            ? data.data.map((apikey) => (
              <Row gutters>
                <Col n="12">
                  <Title>
                    {apikey?.name}
                  </Title>
                </Col>
              </Row>
            ))
            : null}
        </BlocContent>
        <BlocModal>
          <Modal isOpen={isOpen} size="lg" hide={() => setIsOpen(false)}>
            <ModalTitle>Ajouter un clé API</ModalTitle>
            <ModalContent>
              <ApiKeysForm
                id={id}
                data={rest}
                onDelete={onDeleteHandler}
                onSave={onSaveHandler}
              />
            </ModalContent>
          </Modal>
        </BlocModal>
      </Bloc>
    </>
  );
}
