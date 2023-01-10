import { useState } from 'react';
import { Link as RouterLink, useNavigate, Outlet } from 'react-router-dom';
import {
  Badge,
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
import useUrl from '../../../hooks/useUrl';
import { PageSpinner } from '../../../components/spinner';
import api from '../../../utils/api';
import useNotice from '../../../hooks/useNotice';

import CategoryPresentationPage from './presentation';
import CategoryRelatedElements from './elements-lies';
import CategoryForm from '../../../components/forms/category-term';
import CategoriesExportPage from './exporter';
import { saveError, saveSuccess } from '../../../utils/notice-contents';
import Error from '../../../components/errors';
import usePageTitle from '../../../hooks/usePageTitle';
import useAuth from '../../../hooks/useAuth';

function CategoryByIdPage() {
  const { url, id } = useUrl();
  const { viewer } = useAuth();
  const { data, isLoading, error, reload } = useFetch(url);
  const navigate = useNavigate();
  const { notice } = useNotice();
  const { editMode, toggle } = useEditMode();
  const [isExportOpen, setIsExportOpen] = useState(false);
  // const [isFavorite, setIsFavorite] = useState(false);
  const { form, updateForm } = useForm({
    oeil: true,
    actualites: true,
    evenements: true,
    ressources: true,
    related: true,
    textes: true,
  });
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  usePageTitle(`Catégories · ${data?.usualNameFr}`);

  const onSave = async (body) => api.patch(url, body)
    .then(() => { reload(); setIsFormModalOpen(false); notice(saveSuccess); })
    .catch(() => { setIsFormModalOpen(false); notice(saveError); });
  if (isLoading) return <PageSpinner />;
  if (error) return <Error status={error} />;
  return (
    <Container spacing="pb-6w">
      <Row>
        <Col n="12 md-3">
          <SideMenu buttonLabel="Navigation">
            <SideMenuLink asLink={<RouterLink to="presentation" replace />}>
              <Icon name="ri-eye-2-line" size="1x" />
              En un coup d’œil
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="elements-lies" replace />}>
              <Icon name="ri-links-line" size="1x" />
              Eléments liés
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="actualites" replace />}>
              <Icon name="ri-newspaper-line" size="1x" />
              Actualités
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="evenements" replace />}>
              <Icon name="ri-calendar-line" size="1x" />
              Evènements
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="documents" replace />}>
              <Icon name="ri-folders-line" size="1x" />
              Ressources
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="textes-officiels" replace />}>
              <Icon name="ri-git-repository-line" size="1x" />
              Textes officiels
            </SideMenuLink>
          </SideMenu>
        </Col>
        <Col n="12 md-9">
          <Row className="flex--space-between flex--wrap stick">
            <Breadcrumb>
              <BreadcrumbItem asLink={<RouterLink to="/" />}>
                Accueil
              </BreadcrumbItem>
              <BreadcrumbItem
                asLink={<RouterLink to="/rechercher/categories?query=&page=1" />}
              >
                Catégories
              </BreadcrumbItem>
              <BreadcrumbItem>{data.usualNameFr}</BreadcrumbItem>
            </Breadcrumb>
            <ButtonGroup align="right" isInlineFrom="xs" className="fr-mt-1w flex--grow">
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
                        <CategoryForm id={data.id} data={data} onSave={onSave} />
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
              {/* <Button
                tertiary
                borderless
                rounded
                title="Ajouter aux favoris"
                onClick={() => setIsFavorite(!isFavorite)}
                icon={`ri-star-${isFavorite ? 'fill' : 'line'}`}
              /> */}
              {(viewer.role !== 'reader') && (
                <Button
                  tertiary
                  borderless
                  rounded
                  title="Activer le mode édition"
                  onClick={() => toggle()}
                  icon={`ri-edit-${editMode ? 'fill' : 'line'}`}
                />
              )}
            </ButtonGroup>

          </Row>
          <Row className="flex--space-between flex--wrap-reverse">
            <Title as="h2">
              {data.usualNameFr}
              <BadgeGroup className="fr-pt-1w">
                <Badge text="catégorie" type="info" />
                <CopyBadgeButton
                  colorFamily="yellow-tournesol"
                  text={data.id}
                  lowercase
                />
              </BadgeGroup>
            </Title>
            <Modal size="sm" isOpen={isExportOpen} hide={() => setIsExportOpen(false)}>
              <ModalTitle>
                Que souhaitez-vous exporter ?
              </ModalTitle>
              <ModalContent>
                <CheckboxGroup>
                  <Checkbox
                    checked={form.oeil}
                    onChange={(e) => updateForm({ oeil: e.target.checked })}
                    label="En un coup d’œil"
                  />
                  <Checkbox
                    checked={form.related}
                    onChange={(e) => updateForm({ related: e.target.checked })}
                    label="Eléments liés"
                  />
                  <Checkbox
                    checked={form.actualites}
                    onChange={(e) => updateForm({ actualites: e.target.checked })}
                    label="Actualités"
                  />
                  <Checkbox
                    checked={form.evenements}
                    onChange={(e) => updateForm({ evenements: e.target.checked })}
                    label="Evènements"
                  />
                  <Checkbox
                    checked={form.ressources}
                    onChange={(e) => updateForm({ ressources: e.target.checked })}
                    label="Ressources"
                  />
                  <Checkbox
                    checked={form.textes}
                    onChange={(e) => updateForm({ textes: e.target.checked })}
                    label="Textes officiels"
                  />
                </CheckboxGroup>
              </ModalContent>
              <ModalFooter>
                <ButtonGroup>
                  <Button onClick={() => {
                    if (editMode) { toggle(); }
                    navigate(`/categories/${id}/exporter?${new URLSearchParams(form)}`);
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
  CategoryByIdPage,
  CategoryPresentationPage,
  CategoryRelatedElements,
  CategoriesExportPage,
};
