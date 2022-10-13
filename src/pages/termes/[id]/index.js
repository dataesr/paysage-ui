import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, Outlet } from 'react-router-dom';
import {
  BadgeGroup, Breadcrumb, BreadcrumbItem, ButtonGroup, Checkbox,
  CheckboxGroup, Col, Container, Icon, Modal, ModalContent, ModalFooter,
  ModalTitle, Row, SideMenu, SideMenuLink, Title,
} from '@dataesr/react-dsfr';
import useFetch from '../../../hooks/useFetch';
import useForm from '../../../hooks/useForm';
import useEditMode from '../../../hooks/useEditMode';
import Button from '../../../components/button';
import CopyBadgeButton from '../../../components/copy/copy-badge-button';
import { DropdownButton, DropdownButtonItem } from '../../../components/dropdown-button';
import PersonForm from '../../../components/forms/person';
import useUrl from '../../../hooks/useUrl';
import Spinner from '../../../components/spinner';
import api from '../../../utils/api';
import useNotice from '../../../hooks/useNotice';

import TermPresentationPage from './presentation';
import TermCategories from './categories';

function TermByIdPage() {
  const { url, id } = useUrl();
  const { data, isLoading, error, reload } = useFetch(url);
  const navigate = useNavigate();
  const { notice } = useNotice();
  const { editMode, reset, toggle } = useEditMode();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { form, updateForm } = useForm({}, () => {});
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  useEffect(() => { reset(); }, [reset]);

  const onSave = async (body) => api.patch(url, body)
    .then(() => { reload(); setIsFormModalOpen(false); notice({ content: 'Informations sauvegardées', type: 'success' }); })
    .catch(() => { setIsFormModalOpen(false); notice({ content: 'Une erreur est survenue.', type: 'error' }); });

  if (isLoading) return <Row className="fr-my-2w flex--space-around"><Spinner /></Row>;
  if (error) return <>Erreur...</>;
  if (!data) return null;
  return (
    <Container spacing="pb-6w">
      <Row>
        <Col n="12 md-3">
          <SideMenu buttonLabel="Navigation">
            <SideMenuLink asLink={<RouterLink to="presentation#" />}>
              <Icon name="ri-eye-2-line" size="1x" />
              En un coup d’œil
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="actualites" />}>
              <Icon name="ri-newspaper-line" size="1x" />
              Actualités
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="evenements" />}>
              <Icon name="ri-calendar-line" size="1x" />
              Evènements
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="documents" />}>
              <Icon name="ri-folders-line" size="1x" />
              Ressources
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="categories" />}>
              <Icon name="ri-price-tag-3-line" size="1x" />
              Catégories et termes
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="textes-officiels" />}>
              <Icon name="ri-git-repository-line" size="1x" />
              Textes officiels
            </SideMenuLink>
          </SideMenu>
        </Col>
        <Col n="12 md-9">
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>
              Accueil
            </BreadcrumbItem>
            <BreadcrumbItem
              asLink={<RouterLink to="/rechercher/personnes?query=" />}
            >
              Termes
            </BreadcrumbItem>
            <BreadcrumbItem>{data.usualNameFr}</BreadcrumbItem>
          </Breadcrumb>
          <Row className="flex--space-between flex--wrap-reverse">
            <Title as="h2">
              {data.usualNameFr}
              <BadgeGroup>
                <CopyBadgeButton
                  colorFamily="yellow-tournesol"
                  text={data.id}
                  lowercase
                />
              </BadgeGroup>
            </Title>
            <ButtonGroup align="right" isInlineFrom="xs">
              {editMode && (
                <DropdownButton align="right" title="options">
                  <DropdownButtonItem onClick={() => setIsFormModalOpen(true)}>
                    Modifier les informations
                    <Icon iconPosition="right" size="xl" name="ri-edit-line" color="var(--border-action-high-blue-france)" />
                    <Modal size="lg" isOpen={isFormModalOpen} hide={() => setIsFormModalOpen(false)}>
                      <ModalTitle>
                        Modifier les informations de
                        {' '}
                        {data.usualNameFr}
                      </ModalTitle>
                      <ModalContent>
                        <PersonForm id={data.id} data={data} onSave={onSave} />
                      </ModalContent>
                    </Modal>
                  </DropdownButtonItem>
                </DropdownButton>
              )}
              <Button
                tertiary
                borderless
                rounded
                title="Exporter la fiche"
                onClick={() => setIsExportOpen(true)}
                icon="ri-download-2-fill"
              />
              <Button
                tertiary
                borderless
                rounded
                title="Ajouter aux favoris"
                onClick={() => setIsFavorite(!isFavorite)}
                icon={`ri-star-${isFavorite ? 'fill' : 'line'}`}
              />
              <Button
                tertiary
                borderless
                rounded
                title="Activer le mode édition"
                onClick={() => toggle()}
                icon={`ri-edit-${editMode ? 'fill' : 'line'}`}
              />
            </ButtonGroup>
            <Modal size="sm" isOpen={isExportOpen} hide={() => setIsExportOpen(false)}>
              <ModalTitle>
                Que souhaitez-vous exporter ?
              </ModalTitle>
              <ModalContent>
                <CheckboxGroup>
                  <Checkbox
                    onChange={(e) => updateForm({ oeil: e.target.checked })}
                    label="En un coup d’œil"
                  />
                </CheckboxGroup>
              </ModalContent>
              <ModalFooter>
                <ButtonGroup>
                  <Button onClick={() => {
                    if (editMode) { toggle(); }
                    navigate(`/termes/${id}/exporter?${new URLSearchParams(form)}`);
                  }}
                  >
                    Exporter
                  </Button>
                </ButtonGroup>
              </ModalFooter>
            </Modal>
          </Row>
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}

export {
  TermByIdPage,
  TermPresentationPage,
  TermCategories,
};
