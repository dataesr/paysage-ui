import {
  Badge, BadgeGroup, Breadcrumb, BreadcrumbItem, ButtonGroup, Checkbox,
  CheckboxGroup, Col, Container, Icon, Modal, ModalContent, ModalFooter,
  ModalTitle, Row, SideMenu, SideMenuItem, SideMenuLink, Title,
} from '@dataesr/react-dsfr';
import { useEffect, useState, useCallback } from 'react';
import { Link as RouterLink, useNavigate, Outlet, useParams } from 'react-router-dom';

import Button from '../../../components/button';
import CopyBadgeButton from '../../../components/copy/copy-badge-button';
import { DropdownButton, DropdownButtonItem } from '../../../components/dropdown-button';
import Spinner from '../../../components/spinner';
import useEditMode from '../../../hooks/useEditMode';
import useFetch from '../../../hooks/useFetch';
import useForm from '../../../hooks/useForm';
import useShortcuts from '../../../hooks/useShortcuts';
import useNotice from '../../../hooks/useNotice';
import useUrl from '../../../hooks/useUrl';
import StructureCategoriesPage from './categories';
import StructureBudgetPage from './chiffres-cles/budget';
import StructureEtudiantsPage from './chiffres-cles/etudiants';
import StructureImmobilierPage from './chiffres-cles/immobilier';
import StructureInsertionProfessionnellePage from './chiffres-cles/insertion-professionnelle';
import StructureOffreDeFormationPage from './chiffres-cles/offre-de-formation';
import StructureRHPage from './chiffres-cles/ressources-humaines';
import StructureElementsLiesPage from './elements-lies';
import StructureExportPage from './exporter';
import StructureGouvernancePage from './gouvernance';
import StructurePresentationPage from './presentation';
import StructurePrixEtRecompensesPage from './prix-et-recompenses';
import StructureProjetsPage from './projets';
import useAuth from '../../../hooks/useAuth';
import { saveError, saveSuccess } from '../../../utils/notice-contents';
import StructureDescriptionForm from '../../../components/forms/structures/descriptions';
import StructureStatusForm from '../../../components/forms/structures/status';
import StructureMottoForm from '../../../components/forms/structures/motto';
import StructureHistoryForm from '../../../components/forms/structures/historique';
import api from '../../../utils/api';
import { getName } from '../../../utils/structures';

function StructureByIdPage() {
  const { viewer } = useAuth();
  const { notice } = useNotice();
  const { id } = useParams();
  const { url } = useUrl();
  const { data, isLoading, error, reload } = useFetch(url);
  const navigate = useNavigate();
  const { editMode, reset, toggle } = useEditMode();
  const [isExportOpen, setIsExportOpen] = useState(false);
  // const [isFavorite, setIsFavorite] = useState(false);
  const { form, updateForm } = useForm({
    actualites: true,
    categories: true,
    chiffres: true,
    elements: true,
    evenements: true,
    gouvernance: true,
    oeil: true,
    prix: true,
    projets: true,
    resources: true,
    textes: true,
  });

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [isMottoModalOpen, setIsMottoModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  useEffect(() => { reset(); }, [reset]);
  useEffect(() => { document.title = `Structures · ${data?.currentName.usualName}`; }, [data]);
  useShortcuts(['Control', 'e'], useCallback(() => toggle(), [toggle]));

  const onSaveHandler = async (body) => {
    await api.patch(url, body)
      .then(() => {
        notice(saveSuccess);
        reload();
      })
      .catch(() => notice(saveError));
    setIsStatusModalOpen(false);
    setIsDescriptionModalOpen(false);
    setIsMottoModalOpen(false);
    setIsHistoryModalOpen(false);
  };

  if (isLoading) return <Row className="fr-my-2w flex--space-around"><Spinner /></Row>;
  if (error) return <>Erreur...</>;
  return (
    <Container spacing="pb-6w">
      <Row>
        <Col n="12 md-3">
          <SideMenu buttonLabel="Navigation">
            <SideMenuLink asLink={<RouterLink to="presentation#" replace />}>
              <Icon name="ri-eye-2-line" size="1x" />
              En un coup d’œil
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="actualites" replace />}>
              <Icon name="ri-newspaper-line" size="1x" />
              Actualités
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="gouvernance-et-referents" replace />}>
              <Icon name="ri-team-line" size="1x" />
              Gouvernance et référents
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="evenements" replace />}>
              <Icon name="ri-calendar-line" size="1x" />
              Evènements
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="documents" replace />}>
              <Icon name="ri-folders-line" size="1x" />
              Ressources
            </SideMenuLink>
            <SideMenuItem
              title={(
                <>
                  <Icon name="ri-bar-chart-grouped-line" size="1x" />
                  Analyses et données
                </>
              )}
            >
              <SideMenuLink asLink={<RouterLink to="chiffres-cles/immobilier" replace />}>
                Immobilier
              </SideMenuLink>
              <SideMenuLink asLink={<RouterLink to="chiffres-cles/etudiants" replace />}>
                Etudiants
              </SideMenuLink>
              <SideMenuLink asLink={<RouterLink to="chiffres-cles/offre-de-formation" replace />}>
                Offre de formation
              </SideMenuLink>
              <SideMenuLink asLink={<RouterLink to="chiffres-cles/ressources-humaines" replace />}>
                Ressources humaines
              </SideMenuLink>
              <SideMenuLink asLink={<RouterLink to="chiffres-cles/budget" replace />}>
                Indicateurs financiers
              </SideMenuLink>
              <SideMenuLink asLink={<RouterLink to="chiffres-cles/insertion-professionnelle" replace />}>
                Insertion professionnelle
              </SideMenuLink>
            </SideMenuItem>
            <SideMenuLink asLink={<RouterLink to="categories" replace />}>
              <Icon name="ri-price-tag-3-line" size="1x" />
              Catégories et termes
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="textes-officiels" replace />}>
              <Icon name="ri-git-repository-line" size="1x" />
              Textes officiels
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="projets" replace />}>
              <Icon name="ri-booklet-line" size="1x" />
              Projets
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="prix-et-recompenses" replace />}>
              <Icon name="ri-award-line" size="1x" />
              Prix & récompenses
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="elements-lies" replace />}>
              <Icon name="ri-links-line" size="1x" />
              Eléments liés
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="participations" replace />}>
              <Icon name="ri-stackshare-line" size="1x" />
              Participations
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
                asLink={<RouterLink to="/rechercher/structures?query=&page=1" />}
              >
                Structures
              </BreadcrumbItem>
              <BreadcrumbItem>
                {getName(data?.currentName)}
              </BreadcrumbItem>
            </Breadcrumb>

            <ButtonGroup align="right" isInlineFrom="xs" className="fr-mt-1w flex--grow">
              {editMode && (
                <DropdownButton align="right" title="options">
                  <DropdownButtonItem onClick={() => setIsStatusModalOpen(true)}>
                    Modifier le statut
                    <Icon iconPosition="right" size="xl" name="ri-edit-line" color="var(--border-action-high-blue-france)" />
                  </DropdownButtonItem>
                  <DropdownButtonItem onClick={() => setIsDescriptionModalOpen(true)}>
                    Ajouter/Modifier la description
                    <Icon iconPosition="right" size="xl" name="ri-edit-line" color="var(--border-action-high-blue-france)" />
                  </DropdownButtonItem>
                  <DropdownButtonItem onClick={() => setIsMottoModalOpen(true)}>
                    Ajouter/Modifier la devise
                    <Icon iconPosition="right" size="xl" name="ri-edit-line" color="var(--border-action-high-blue-france)" />
                  </DropdownButtonItem>
                  <DropdownButtonItem onClick={() => setIsHistoryModalOpen(true)}>
                    Ajouter/Modifier l'historique
                    <Icon iconPosition="right" size="xl" name="ri-edit-line" color="var(--border-action-high-blue-france)" />
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
              {getName(data?.currentName)}
              <BadgeGroup className="fr-pt-1w">
                <Badge type="info" text="structure" />
                <Badge colorFamily="green-emeraude" text={data.structureStatus || 'active'} />
                <CopyBadgeButton colorFamily="yellow-tournesol" text={data.id} lowercase />
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
                    checked={form.gouvernance}
                    onChange={(e) => updateForm({ gouvernance: e.target.checked })}
                    label="Gouvernance et référents"
                  />
                  <Checkbox
                    checked={form.evenements}
                    onChange={(e) => updateForm({ evenements: e.target.checked })}
                    label="Evènements"
                  />
                  <Checkbox
                    checked={form.resources}
                    onChange={(e) => updateForm({ resources: e.target.checked })}
                    label="Ressources"
                  />
                  <Checkbox
                    checked={form.categories}
                    onChange={(e) => updateForm({ categories: e.target.checked })}
                    label="Categories et termes"
                  />
                  <Checkbox
                    checked={form.chiffres}
                    onChange={(e) => updateForm({ chiffres: e.target.checked })}
                    label="Chiffres clés"
                  />
                  <Checkbox
                    checked={form.prix}
                    onChange={(e) => updateForm({ prix: e.target.checked })}
                    label="Prix et récompenses"
                  />
                  <Checkbox
                    checked={form.textes}
                    onChange={(e) => updateForm({ textes: e.target.checked })}
                    label="Textes officiels"
                  />
                  <Checkbox
                    checked={form.projets}
                    onChange={(e) => updateForm({ projets: e.target.checked })}
                    label="Projets"
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
                    navigate(`/structures/${id}/exporter?${new URLSearchParams(form)}`);
                  }}
                  >
                    Exporter
                  </Button>
                </ButtonGroup>
              </ModalFooter>
            </Modal>

            <Modal size="lg" isOpen={isHistoryModalOpen} hide={() => setIsHistoryModalOpen(false)}>
              <ModalTitle>
                Modification de l'historique
              </ModalTitle>
              <ModalContent>
                <StructureHistoryForm data={data} onSave={onSaveHandler} />
              </ModalContent>
            </Modal>

            <Modal size="md" isOpen={isStatusModalOpen} hide={() => setIsStatusModalOpen(false)}>
              <ModalTitle>
                Modification du statut
              </ModalTitle>
              <ModalContent>
                <StructureStatusForm data={data} onSave={onSaveHandler} />
              </ModalContent>
            </Modal>

            <Modal size="md" isOpen={isMottoModalOpen} hide={() => setIsMottoModalOpen(false)}>
              <ModalTitle>
                Modification de la devise
              </ModalTitle>
              <ModalContent>
                <StructureMottoForm data={data} onSave={onSaveHandler} />
              </ModalContent>
            </Modal>

            <Modal size="md" isOpen={isDescriptionModalOpen} hide={() => setIsDescriptionModalOpen(false)}>
              <ModalTitle>
                Modification de la description
              </ModalTitle>
              <ModalContent>
                <StructureDescriptionForm data={data} onSave={onSaveHandler} />
              </ModalContent>
            </Modal>
          </Row>
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}

export {
  StructureBudgetPage,
  StructureByIdPage,
  StructureCategoriesPage,
  StructureElementsLiesPage,
  StructureEtudiantsPage,
  StructureExportPage,
  StructureGouvernancePage,
  StructureImmobilierPage,
  StructureInsertionProfessionnellePage,
  StructureOffreDeFormationPage,
  StructurePresentationPage,
  StructurePrixEtRecompensesPage,
  StructureProjetsPage,
  StructureRHPage,
};
