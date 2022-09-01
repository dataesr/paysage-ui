import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Breadcrumb, BreadcrumbItem, Col, Container, Row, Tag, Title, Modal, ModalTitle, ModalContent, TextInput } from '@dataesr/react-dsfr';
import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import useModal from '../../hooks/useModal';
import api from '../../utils/api';
import TagInput from '../../components/Taginput';

function NomenclatureModal({ isOpen, hide, mode, initialState = { usualName: null, otherNames: [] } }) {
  const [form, setForm] = useState(initialState);
  return (
    <Modal isOpen={isOpen} hide={hide}>
      <ModalTitle>
        Ajouter une entrée
      </ModalTitle>
      <ModalContent>
        <form>
          <Container fluid>
            <Row>
              <TextInput name="usualName" value={form.usualName} onChange={(e) => setForm({ ...form, usualName: e.target.value })} />
              <TagInput
                label="Autres noms"
                hint='Validez votre ajout avec la touche "Entrée" afin de valider votre ajout'
                tags={form.otherNames}
                onTagsChange={(tags) => setForm({ ...form, otherNames: tags })}
              />
            </Row>
          </Container>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default function NomenclaturesPage({ route, title }) {
  const { data, isLoading, error, reload } = useFetch('GET', route);
  const [isEditModalOpen, toggleEditModal] = useModal();
  const [isCreateModalOpen, toggleCreateModal] = useModal();
  const [usualName, setUsualName] = useState('');

  const onSaveHandler = async () => {
    const body = {
      usualName,
    };
    const response = await api.post(route, body);

    if (response.ok) {
      reload();
      setUsualName('');
    }
  };

  if (error) return <div>Erreur</div>;
  if (isLoading) return <div>Chargement</div>;
  return (
    <Container fluid>
      <Row>
        <Col>
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>Accueil</BreadcrumbItem>
            <BreadcrumbItem asLink={<RouterLink to="/admin" />}>Administration</BreadcrumbItem>
            <BreadcrumbItem>{title}</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <Row className="fr-row--space-between fr-row--baseline">
        <Title as="h2" look="h3">{title}</Title>
        <Button secondary size="sm" icon="ri-add-line" onClick={toggleCreateModal}>Ajouter</Button>
        <NomenclatureModal isOpen={isCreateModalOpen} hide={toggleCreateModal} mode="create" />
      </Row>
      <Row>
        <Col>
          {data.data?.map((item) => (
            <>
              <Tag key={item.id} onClick={toggleEditModal}>
                {item.usualName}
              </Tag>
              <NomenclatureModal isOpen={isEditModalOpen} hide={toggleEditModal} mode="update" initialState={{ usualName: item.usualName, otherNames: item.otherNames }} />
            </>
          ))}
        </Col>
      </Row>
    </Container>
  );
}

NomenclaturesPage.propTypes = {
  route: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
