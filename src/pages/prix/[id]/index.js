import { useEffect, useState } from 'react';
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
import PriceForm from '../../../components/forms/price';
import useUrl from '../../../hooks/useUrl';
import Spinner from '../../../components/spinner';
import api from '../../../utils/api';
import useNotice from '../../../hooks/useNotice';

import PricePresentationPage from './presentation';
import PriceCategories from './categories';
import PriceExportPage from './exporter';
import { saveError, saveSuccess } from '../../../utils/notice-contents';

function PriceByIdPage() {
  const { url, id } = useUrl();
  const { data, isLoading, error, reload } = useFetch(url);
  const navigate = useNavigate();
  const { notice } = useNotice();
  const { editMode, reset, toggle } = useEditMode();
  const [isExportOpen, setIsExportOpen] = useState(false);
  // const [isFavorite, setIsFavorite] = useState(false);
  const { form, updateForm } = useForm({
    oeil: true,
    actualites: true,
    evenements: true,
    ressources: true,
    categories: true,
    textes: true,
  });
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  useEffect(() => { reset(); }, [reset]);

  const onSave = async (body) => api.patch(url, body)
    .then(() => { reload(); setIsFormModalOpen(false); notice(saveSuccess); })
    .catch(() => { setIsFormModalOpen(false); notice(saveError); });

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
          <Row className="flex--space-between flex--wrap stick">
            <Breadcrumb>
              <BreadcrumbItem asLink={<RouterLink to="/" />}>
                Accueil
              </BreadcrumbItem>
              <BreadcrumbItem
                asLink={<RouterLink to="/rechercher/prix?query=&page=1" />}
              >
                Prix
              </BreadcrumbItem>
              <BreadcrumbItem>{data.nameFr}</BreadcrumbItem>
            </Breadcrumb>
            <ButtonGroup align="right" isInlineFrom="xs" className="fr-mt-1w flex--grow">
              {editMode && (
                <DropdownButton align="right" title="options">
                  <DropdownButtonItem onClick={() => setIsFormModalOpen(true)}>
                    Modifier les informations
                    <Icon iconPosition="right" size="xl" name="ri-edit-line" color="var(--border-action-high-blue-france)" />
                    <Modal canClose={false} size="lg" isOpen={isFormModalOpen} hide={() => setIsFormModalOpen(false)}>
                      <ModalTitle>
                        Modifier les informations de
                        {' '}
                        {data.nameFr}
                      </ModalTitle>
                      <ModalContent>
                        <PriceForm id={data.id} data={data} onSave={onSave} />
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
              <Button
                tertiary
                borderless
                rounded
                title="Activer le mode édition"
                onClick={() => toggle()}
                icon={`ri-edit-${editMode ? 'fill' : 'line'}`}
              />
            </ButtonGroup>
          </Row>
          <Row>
            <Title as="h2">
              {data.nameFr}
              <BadgeGroup className="fr-pt-1w">
                <Badge type="info" text="prix" />
                <CopyBadgeButton
                  colorFamily="yellow-tournesol"
                  text={data.id}
                  lowercase
                />
              </BadgeGroup>
            </Title>
            <Modal canClose={false} size="sm" isOpen={isExportOpen} hide={() => setIsExportOpen(false)}>
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
                    checked={form.categories}
                    onChange={(e) => updateForm({ categories: e.target.checked })}
                    label="Catégories et termes"
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
                    navigate(`/prix/${id}/exporter?${new URLSearchParams(form)}`);
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
  PriceByIdPage,
  PriceExportPage,
  PricePresentationPage,
  PriceCategories,
};
