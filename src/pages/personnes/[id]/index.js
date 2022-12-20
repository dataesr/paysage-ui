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
import PersonForm from '../../../components/forms/person';
import useUrl from '../../../hooks/useUrl';
import { PageSpinner } from '../../../components/spinner';
import api from '../../../utils/api';
import useNotice from '../../../hooks/useNotice';

import PersonPresentationPage from './presentation';
import PersonMandats from './mandats';
import PersonCategories from './categories';
import PersonProjets from './projets';
import PersonPrices from './prix-et-recompenses';
import PersonsRelatedElements from './elements-lies';
import PersonExportPage from './exporter';
import { saveError, saveSuccess } from '../../../utils/notice-contents';
import useAuth from '../../../hooks/useAuth';
import Error from '../../../components/errors';
import usePageTitle from '../../../hooks/usePageTitle';

function PersonByIdPage() {
  const { viewer } = useAuth();
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
    mandats: true,
    evenements: true,
    ressources: true,
    categories: true,
    textes: true,
    prix: true,
    elements: true,
  });
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  useEffect(() => { reset(); }, [reset]);
  usePageTitle(`Personnes · ${`${data?.firstName} ${data?.lastName}`.trim()}`);

  const onSave = async (body) => {
    await api.patch(url, body)
      .then(() => { reload(); notice(saveSuccess); })
      .catch(() => { notice(saveError); });
    return setIsFormModalOpen(false);
  };

  if (isLoading) return <PageSpinner />;
  if (error) return <Error status={error} />;
  const personName = `${data.firstName} ${data.lastName}`.trim();
  const genreIcon = (data.gender === 'Homme') ? 'ri-men-line' : 'ri-women-line';
  return (
    <Container spacing="pb-6w">
      <Row>
        <Col n="12 md-3">
          <SideMenu buttonLabel="Navigation">
            <SideMenuLink asLink={<RouterLink to="presentation" replace />}>
              <Icon name="ri-eye-2-line" size="1x" />
              En un coup d’œil
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="actualites" replace />}>
              <Icon name="ri-newspaper-line" size="1x" />
              Actualités
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="mandats" replace />}>
              <Icon name="ri-building-line" size="1x" />
              Rôles et mandats
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="evenements" replace />}>
              <Icon name="ri-calendar-line" size="1x" />
              Evènements
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="documents" replace />}>
              <Icon name="ri-folders-line" size="1x" />
              Ressources
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="categories" replace />}>
              <Icon name="ri-price-tag-3-line" size="1x" />
              Catégories et termes
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="textes-officiels" replace />}>
              <Icon name="ri-git-repository-line" size="1x" />
              Textes officiels
            </SideMenuLink>
            {/* TODO: Restore projects */}
            {/* <SideMenuLink asLink={<RouterLink to="projets" replace />}>
              <Icon name="ri-booklet-line" size="1x" />
              Projets
            </SideMenuLink> */}
            <SideMenuLink asLink={<RouterLink to="prix-et-recompenses" replace />}>
              <Icon name="ri-award-line" size="1x" />
              Prix et récompenses
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="elements-lies" replace />}>
              <Icon name="ri-links-line" size="1x" />
              Eléments liés
            </SideMenuLink>
            {(viewer.role === 'admin') && (
              <SideMenuLink asLink={<RouterLink to="journal" replace />}>
                <Icon name="ri-refresh-line" size="1x" />
                Journal de modifications
              </SideMenuLink>
            )}
          </SideMenu>
        </Col>
        <Col n="12 md-9">
          <Row className="flex--space-between flex--wrap stick">

            <Breadcrumb>
              <BreadcrumbItem asLink={<RouterLink to="/" />}>
                Accueil
              </BreadcrumbItem>
              <BreadcrumbItem
                asLink={<RouterLink to="/rechercher/personnes?query=&page=1" />}
              >
                Personnes
              </BreadcrumbItem>
              <BreadcrumbItem>{personName}</BreadcrumbItem>
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
                        {personName}
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
          <Row className="flex--space-between flex--wrap-reverse">
            <Title as="h2">
              {personName}
              <BadgeGroup className="fr-pt-1w">
                <Badge text="personne" type="info" />
                <CopyBadgeButton
                  colorFamily="yellow-tournesol"
                  text={data.id}
                  lowercase
                />
                {data.gender && <Badge type="success" text={data.gender} icon={(data.gender === 'Autre') ? '' : genreIcon} />}
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
                    checked={form.actualites}
                    onChange={(e) => updateForm({ actualites: e.target.checked })}
                    label="Actualités"
                  />
                  <Checkbox
                    checked={form.mandats}
                    onChange={(e) => updateForm({ mandats: e.target.checked })}
                    label="Rôles et mandats"
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
                  {/* TODO: Restore projects */}
                  {/* <Checkbox
                    checked={form.projets}
                    onChange={(e) => updateForm({ projets: e.target.checked })}
                    label="Projets"
                  /> */}
                  <Checkbox
                    checked={form.prix}
                    onChange={(e) => updateForm({ prix: e.target.checked })}
                    label="Prix et récompenses"
                  />
                  <Checkbox
                    checked={form.elements}
                    onChange={(e) => updateForm({ elements: e.target.checked })}
                    label="Eléments liés"
                  />
                </CheckboxGroup>
              </ModalContent>
              <ModalFooter>
                <ButtonGroup>
                  <Button onClick={() => {
                    if (editMode) { toggle(); }
                    navigate(`/personnes/${id}/exporter?${new URLSearchParams(form)}`);
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
  PersonByIdPage,
  PersonExportPage,
  PersonPresentationPage,
  PersonMandats,
  PersonCategories,
  PersonProjets,
  PersonPrices,
  PersonsRelatedElements,
};
