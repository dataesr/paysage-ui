import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, Outlet, useLocation, useParams } from 'react-router-dom';
import {
  Badge, BadgeGroup, Breadcrumb, BreadcrumbItem, ButtonGroup, Checkbox,
  CheckboxGroup, Col, Container, Highlight, Icon, Modal, ModalContent, ModalFooter,
  ModalTitle, Radio, RadioGroup, Row, SideMenu, SideMenuItem, SideMenuLink, TextInput, Title,
} from '@dataesr/react-dsfr';
import useFetch from '../../../hooks/useFetch';
import useForm from '../../../hooks/useForm';
import useEditMode from '../../../hooks/useEditMode';
import Button from '../../../components/button';
import CopyBadgeButton from '../../../components/copy/copy-badge-button';
import StructurePresentationPage from './presentation';
import StructureActualitesPage from './actualites';
import StructureAgendaPage from './agenda';
import StructureAnalyseEtRessourcesStrategiquesPage from './analyses-et-ressources-strategiques';
import StructureBudgetPage from './budget';
import StructureCategoriesPage from './categories';
import StructureChiffresClesPage from './chiffres-cles';
import StructureElementsLiesPage from './elements-lies';
import StructureEtudiantsPage from './etudiants';
import StructureExportPage from './exporter';
import StructureGouvernancePage from './gouvernance';
import StructureImmobilierPage from './immobilier';
import StructureOffreDeFormationPage from './offre-de-formation';
import StructureParticipationsPage from './participations';
import StructurePrixEtRecompensesPage from './prix-et-recompenses';
import StructureProjetsPage from './projets';
import StructureRHPage from './ressources-humaines';
import StructureTextesOfficielsPage from './textes-officiels';
import { DropdownButton, DropdownButtonItem } from '../../../components/dropdown-button';
import api from '../../../utils/api';
import useToast from '../../../hooks/useToast';

function StructureByIdPage() {
  const { toast } = useToast();
  const { id } = useParams();
  const url = `/structures/${id}`;
  const { data, isLoading, error, reload } = useFetch(url);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { editMode, reset, toggle } = useEditMode();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { form, updateForm } = useForm({}, () => { });

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [status, setSatus] = useState('inactive');

  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [descriptionFr, setDescriptionFr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');

  useEffect(() => { reset(); }, [reset]);

  useEffect(() => { setSatus(data?.structureStatus); }, [data?.structureStatus]);
  useEffect(() => { setDescriptionFr(data?.descriptionFr); }, [data?.descriptionFr]);
  useEffect(() => { setDescriptionEn(data?.descriptionEn); }, [data?.descriptionEn]);

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

  const menu = {
    'chiffres-cles': 'Chiffres clés',
    actualites: 'Actualités',
    presentation: null,
    'prix-et-recompenses': 'Prix scientifiques et récompenses',
  };
  if (isLoading) return <>Chargement...</>;
  if (error) return <>Erreur...</>;
  const pathnameSplitted = pathname.split('/');
  const section = menu[pathnameSplitted[pathnameSplitted.length - 1]];
  return (
    <Container spacing="pb-6w">
      <Row>
        <Col n="12 md-3">
          <SideMenu buttonLabel="Navigation">
            <SideMenuLink asLink={<RouterLink to="presentation#" />}>
              En un coup d’œil
              <Icon className="ri-eye-2-line fr-ml-1w" />
            </SideMenuLink>

            <SideMenuLink asLink={<RouterLink to="gouvernance-et-referents" />}>
              Gouvernance et référents
            </SideMenuLink>

            <SideMenuLink asLink={<RouterLink to="ressource-humaines" />}>
              Ressources humaines
            </SideMenuLink>

            <SideMenuLink asLink={<RouterLink to="budget" />}>
              Budget
            </SideMenuLink>

            <SideMenuItem title="Analyse & ressources stratégiques">
              <SideMenuLink asLink={<RouterLink to="analyse-et-ressources-strategiques#notes-du-conseiller" />}>
                Notes du conseiller
              </SideMenuLink>

              <SideMenuLink asLink={<RouterLink to="analyse-et-ressources-strategiques#documents" />}>
                Documents associés
              </SideMenuLink>

              <SideMenuLink asLink={<RouterLink to="analyse-et-ressources-strategiques#evaluations-hceres" />}>
                Evaluation HCERES
              </SideMenuLink>
            </SideMenuItem>

            <SideMenuLink asLink={<RouterLink to="actualites" />}>
              Actualités
            </SideMenuLink>

            <SideMenuLink asLink={<RouterLink to="categories" />}>
              Catégories
            </SideMenuLink>

            <SideMenuLink asLink={<RouterLink to="immobilier" />}>
              Immobilier
            </SideMenuLink>

            <SideMenuLink asLink={<RouterLink to="etudiants" />}>
              Etudiants
            </SideMenuLink>

            <SideMenuLink asLink={<RouterLink to="offre-de-formation" />}>
              Offres de formation
            </SideMenuLink>

            <SideMenuLink asLink={<RouterLink to="projets" />}>
              Projets
            </SideMenuLink>

            <SideMenuLink asLink={<RouterLink to="chiffres-cles" />}>
              Chiffres clés
            </SideMenuLink>

            <SideMenuLink asLink={<RouterLink to="textes-officiels" />}>
              Textes officiels
            </SideMenuLink>

            <SideMenuLink asLink={<RouterLink to="prix-et-recompenses" />}>
              Prix & récompenses
            </SideMenuLink>

            <SideMenuLink asLink={<RouterLink to="agenda" />}>
              Agenda
            </SideMenuLink>

            <SideMenuItem title="Eléments liés">
              <SideMenuLink asLink={<RouterLink to="elements-lies#" />}>
                Structures internes
              </SideMenuLink>

              <SideMenuLink asLink={<RouterLink to="elements-lies" />}>
                Autres listes
              </SideMenuLink>
            </SideMenuItem>

            <SideMenuLink asLink={<RouterLink to="participations" />}>
              Participations
            </SideMenuLink>
          </SideMenu>
        </Col>
        <Col n="12 md-9">
          <Breadcrumb>
            <BreadcrumbItem asLink={<RouterLink to="/" />}>
              Accueil
            </BreadcrumbItem>
            <BreadcrumbItem
              asLink={<RouterLink to="/rechercher/structures" />}
            >
              Structures
            </BreadcrumbItem>
            {section && (
              <BreadcrumbItem asLink={<RouterLink to="" />}>
                {data?.currentName?.usualName}
              </BreadcrumbItem>
            )}
            {section && <BreadcrumbItem>{section}</BreadcrumbItem>}
            {!section && (
              <BreadcrumbItem>{data?.currentName?.usualName}</BreadcrumbItem>
            )}
          </Breadcrumb>
          <Row className="flex--space-between flex--wrap-reverse">
            <Title as="h2">
              {data.currentName.usualName}
              <BadgeGroup>
                <CopyBadgeButton
                  colorFamily="yellow-tournesol"
                  text={data.id}
                  lowercase
                />
                <Badge
                  colorFamily="green-emeraude"
                  text={data.structureStatus || 'active'}
                />
              </BadgeGroup>
            </Title>
            <ButtonGroup align="right" isInlineFrom="xs">
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
                  <Checkbox
                    onChange={(e) => updateForm({ categories: e.target.checked })}
                    label="Gouvernance et référents"
                  />
                  <Checkbox
                    onChange={(e) => updateForm({ rh: e.target.checked })}
                    label="Resources humaines"
                  />
                  <Checkbox
                    onChange={(e) => updateForm({ budget: e.target.checked })}
                    label="Budget"
                  />
                  <Checkbox
                    onChange={(e) => updateForm({ budget: e.target.checked })}
                    label="Offre de formation"
                  />
                  <Checkbox
                    onChange={(e) => updateForm({ budget: e.target.checked })}
                    label="Immobilier"
                  />
                  <Checkbox
                    onChange={(e) => updateForm({ budget: e.target.checked })}
                    label="Etudiants"
                  />
                  <Checkbox
                    onChange={(e) => updateForm({ budget: e.target.checked })}
                    label="Suivi DGSIP/DGRI"
                  />
                  <Checkbox
                    onChange={(e) => updateForm({ budget: e.target.checked })}
                    label="Agenda"
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
          {section && <Row><Title as="h3">{section}</Title></Row>}
          {descriptionFr && <Highlight>{descriptionFr}</Highlight>}
          {descriptionEn && <Highlight>{descriptionEn}</Highlight>}
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}

export {
  StructureByIdPage,
  StructureCategoriesPage,
  StructurePresentationPage,
  StructureGouvernancePage,
  StructureRHPage,
  StructureBudgetPage,
  StructureAnalyseEtRessourcesStrategiquesPage,
  StructureActualitesPage,
  StructureImmobilierPage,
  StructureEtudiantsPage,
  StructureExportPage,
  StructureOffreDeFormationPage,
  StructureProjetsPage,
  StructureChiffresClesPage,
  StructureTextesOfficielsPage,
  StructurePrixEtRecompensesPage,
  StructureAgendaPage,
  StructureElementsLiesPage,
  StructureParticipationsPage,
};
