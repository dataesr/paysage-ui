import {
  Badge, BadgeGroup, Breadcrumb, BreadcrumbItem, ButtonGroup, Checkbox,
  CheckboxGroup, Col, Container, Icon, Modal, ModalContent, ModalFooter,
  ModalTitle, Radio, RadioGroup, Row, SideMenu, SideMenuItem, SideMenuLink, TextInput, Title,
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
import useToast from '../../../hooks/useToast';
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
import api from '../../../utils/api';
import useAuth from '../../../hooks/useAuth';

function StructureByIdPage() {
  const { viewer } = useAuth();
  const { toast } = useToast();
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
  const [status, setSatus] = useState('inactive');

  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [descriptionFr, setDescriptionFr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');

  useEffect(() => { reset(); }, [reset]);
  useEffect(() => { setSatus(data?.structureStatus); }, [data?.structureStatus]);
  useEffect(() => { setDescriptionFr(data?.descriptionFr); }, [data?.descriptionFr]);
  useEffect(() => { setDescriptionEn(data?.descriptionEn); }, [data?.descriptionEn]);
  useShortcuts(['Control', 'e'], useCallback(() => toggle(), [toggle]));

  const onSaveHandler = async (target) => {
    const body = {};
    if (target === 'status') {
      body.structureStatus = status;
    }
    if (target === 'description') {
      body.descriptionFr = descriptionFr;
      body.descriptionEn = descriptionEn;
    }
    const response = await api.patch(url, body)
      .catch(() => {
        toast({
          toastType: 'error',
          description: "Une erreur s'est produite",
        });
      });
    if (response.ok) {
      toast({
        toastType: 'success',
        description: 'Sauvegade ok',
      });
      reload();
      setIsStatusModalOpen(false);
      setIsDescriptionModalOpen(false);
    }
  };

  if (isLoading) return <Row className="fr-my-2w flex--space-around"><Spinner /></Row>;
  if (error) return <>Erreur...</>;
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
            <SideMenuLink asLink={<RouterLink to="gouvernance-et-referents" />}>
              <Icon name="ri-team-line" size="1x" />
              Gouvernance et référents
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="evenements" />}>
              <Icon name="ri-calendar-line" size="1x" />
              Evènements
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="documents" />}>
              <Icon name="ri-folders-line" size="1x" />
              Ressources
            </SideMenuLink>
            <SideMenuItem
              title={(
                <>
                  <Icon name="ri-bar-chart-grouped-line" size="1x" />
                  Chiffres clés
                </>
              )}
            >
              <SideMenuLink asLink={<RouterLink to="chiffres-cles/immobilier" />}>
                Immobilier
              </SideMenuLink>
              <SideMenuLink asLink={<RouterLink to="chiffres-cles/etudiants" />}>
                Etudiants
              </SideMenuLink>
              <SideMenuLink asLink={<RouterLink to="chiffres-cles/offre-de-formation" />}>
                Offres de formation
              </SideMenuLink>
              <SideMenuLink asLink={<RouterLink to="chiffres-cles/ressources-humaines" />}>
                Ressources humaines
              </SideMenuLink>
              <SideMenuLink asLink={<RouterLink to="chiffres-cles/budget" />}>
                Budget
              </SideMenuLink>
              <SideMenuLink asLink={<RouterLink to="chiffres-cles/insertion-professionnelle" />}>
                Insertion professionnelle
              </SideMenuLink>
            </SideMenuItem>
            <SideMenuLink asLink={<RouterLink to="categories" />}>
              <Icon name="ri-price-tag-3-line" size="1x" />
              Catégories et termes
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="textes-officiels" />}>
              <Icon name="ri-git-repository-line" size="1x" />
              Textes officiels
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="projets" />}>
              <Icon name="ri-booklet-line" size="1x" />
              Projets
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="prix-et-recompenses" />}>
              <Icon name="ri-award-line" size="1x" />
              Prix & récompenses
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="elements-lies" />}>
              <Icon name="ri-links-line" size="1x" />
              Eléments liés
            </SideMenuLink>
            <SideMenuLink asLink={<RouterLink to="participations" />}>
              <Icon name="ri-stackshare-line" size="1x" />
              Participations
            </SideMenuLink>
            {(viewer.role === 'admin') && (
              <SideMenuLink asLink={<RouterLink to="journal" />}>
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
              <BreadcrumbItem>{data?.currentName?.usualName}</BreadcrumbItem>
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
              {data.currentName.usualName}
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

            <Modal size="md" isOpen={isStatusModalOpen} hide={() => setIsStatusModalOpen(false)}>
              <ModalTitle>
                Modification du statut
              </ModalTitle>
              <ModalContent>
                <RadioGroup isInline>
                  <Radio
                    label="Actif"
                    value="active"
                    checked={status === 'active'}
                    onChange={(e) => setSatus(e.target.value)}
                  />
                  <Radio
                    label="Inactif"
                    value="inactive"
                    checked={status === 'inactive'}
                    onChange={(e) => setSatus(e.target.value)}
                  />
                  <Radio
                    label="A venir"
                    value="forthcoming"
                    checked={status === 'forthcoming'}
                    onChange={(e) => setSatus(e.target.value)}
                  />
                </RadioGroup>
              </ModalContent>
              <ModalFooter>
                <ButtonGroup>
                  <Button onClick={() => onSaveHandler('status')}>
                    Sauvegarder
                  </Button>
                </ButtonGroup>
              </ModalFooter>
            </Modal>

            <Modal size="md" isOpen={isDescriptionModalOpen} hide={() => setIsDescriptionModalOpen(false)}>
              <ModalTitle>
                Modification de la description
              </ModalTitle>
              <ModalContent>
                <TextInput textarea label="Description française" onChange={(e) => setDescriptionFr(e.target.value)} value={descriptionFr} />
                <TextInput textarea label="Description anglaise" onChange={(e) => setDescriptionEn(e.target.value)} value={descriptionEn} />
              </ModalContent>
              <ModalFooter>
                <ButtonGroup>
                  <Button onClick={() => onSaveHandler('description')}>
                    Sauvegarder
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
