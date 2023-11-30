import {
  Badge,
  BadgeGroup, Breadcrumb, BreadcrumbItem, ButtonGroup,
  Col, Container, Icon, Link, Modal, ModalContent, ModalTitle, Row,
  Text,
  Title,
} from '@dataesr/react-dsfr';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Logo from '../../assets/svg-logo/favicon-32x32.png';
import { Bloc, BlocContent, BlocTitle } from '../../components/bloc';
import Button from '../../components/button';
import RelatedObjectCard from '../../components/card/related-object-card';
import CopyBadgeButton from '../../components/copy/copy-badge-button';
import { DropdownButton, DropdownButtonItem } from '../../components/dropdown-button';
import Error from '../../components/errors';
import DeleteForm from '../../components/forms/delete';
import OfficialTextForm from '../../components/forms/official-text';
import { PageSpinner } from '../../components/spinner';
import useAuth from '../../hooks/useAuth';
import useEditMode from '../../hooks/useEditMode';
import useFetch from '../../hooks/useFetch';
import useNotice from '../../hooks/useNotice';
import usePageTitle from '../../hooks/usePageTitle';
import useUrl from '../../hooks/useUrl';
import api from '../../utils/api';
import { saveError, saveSuccess } from '../../utils/notice-contents';

export default function OfficialTextByIdPage() {
  const { url, id } = useUrl();
  const { viewer } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading, error, reload } = useFetch(url);
  const { notice } = useNotice();
  const { editMode, reset, toggle } = useEditMode();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  usePageTitle(`Texte officiels · ${data?.title}`);

  useEffect(() => { reset(); }, [reset]);

  const onSave = async (body) => api.patch(url, body)
    .then(() => { reload(); setIsFormModalOpen(false); notice(saveSuccess); })
    .catch(() => { setIsFormModalOpen(false); notice(saveError); });

  const renderCards = () => {
    if (!data || !data?.relatedObjects?.length) return null;
    return (
      <Row gutters>
        {data.relatedObjects.map((element) => (
          <Col n="12 md-6 lg-4"><RelatedObjectCard key={element.id} relatedObject={element} /></Col>
        ))}
      </Row>
    );
  };

  const onDeleteHandler = async (redirectionId) => {
    const redirectionUrl = redirectionId ? `/textes-officiels/${redirectionId}` : '/';
    const deleteObject = async () => api.delete(url)
      .then(() => {
        notice(saveSuccess);
        navigate(redirectionUrl);
        setIsDeleteModalOpen(false);
      })
      .catch(() => notice(saveError));
    if (redirectionId) {
      return api.put(`/official-texts/${redirectionId}/alternative-ids/${id}`)
        .then(async () => deleteObject())
        .catch(() => notice(saveError));
    }
    return deleteObject();
  };

  if (isLoading) return <PageSpinner />;
  if (error) return <Error status={error} />;
  return (
    <Container spacing="pb-6w">
      <Row>
        <Col n="12">
          <Row className="flex--space-between flex--wrap stick">
            <Breadcrumb>
              <BreadcrumbItem asLink={<RouterLink to="/" />}>
                Accueil
              </BreadcrumbItem>
              <BreadcrumbItem
                asLink={<RouterLink to="/rechercher/textes-officiels?query=&page=1" />}
              >
                Textes officiels
              </BreadcrumbItem>
              <BreadcrumbItem>{data.title}</BreadcrumbItem>
            </Breadcrumb>
            <ButtonGroup align="right" isInlineFrom="xs" className="fr-mt-1w flex--grow">
              {editMode && (
                <DropdownButton align="right" title="options">
                  <DropdownButtonItem onClick={() => setIsFormModalOpen(true)}>
                    Modifier les informations
                    <Icon iconPosition="right" size="xl" name="ri-edit-line" color="var(--border-action-high-blue-france)" />
                    <Modal size="lg" isOpen={isFormModalOpen} hide={() => setIsFormModalOpen(false)}>
                      <ModalTitle>
                        Modifier les informations
                      </ModalTitle>
                      <ModalContent>
                        <OfficialTextForm id={data.id} data={data} onSave={onSave} />
                      </ModalContent>
                    </Modal>
                  </DropdownButtonItem>
                  {(viewer.role === 'admin') && (
                    <DropdownButtonItem onClick={() => setIsDeleteModalOpen(true)}>
                      Supprimer le texte officiel
                      <Icon iconPosition="right" size="xl" name="ri-delete-bin-line" color="var(--background-action-high-error)" />
                      <Modal isOpen={isDeleteModalOpen} hide={() => setIsDeleteModalOpen(false)}>
                        <ModalTitle>
                          Supprimer le texte officiel
                        </ModalTitle>
                        <ModalContent>
                          <DeleteForm onDelete={onDeleteHandler} type="official-texts" currentObjectId={id} />
                        </ModalContent>
                      </Modal>
                    </DropdownButtonItem>
                  )}
                </DropdownButton>
              )}
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
          <Row>
            <Title className="fr-mb-1w" as="h1">
              {data.title}
              <BadgeGroup className="fr-pt-1w">
                <Badge text={data.nature} type="info" />
                <Badge text={data.type} colorFamily="purple-glycine" />
                <CopyBadgeButton
                  colorFamily="yellow-tournesol"
                  text={data.id}
                  lowercase
                />
              </BadgeGroup>
            </Title>
            {data.textExtract && (
              <Text size="sm">
                <i>
                  {' « '}
                  {data.textExtract}
                  {' » '}
                </i>
              </Text>
            )}
          </Row>
          <Row gutters>
            <Col n="12 md-4 sm-6 lg-3" className="fr-mb-2w">
              <div className="fr-card fr-card--sm fr-card--grey fr-card--no-border">
                <div className={`fr-card__body ${!editMode && 'fr-enlarge-link'}`}>
                  <div className="fr-card__content">
                    <div className="flex-col flex--center">
                      <img src={Logo} alt="" />
                      {data.pageUrl && <Link target="_blank" href={data.pageUrl}>Accéder au texte</Link>}
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Bloc data={{ totalCount: data?.relatedObjects?.length }} error={error} isLoading={isLoading}>
            <BlocTitle as="h2" look="h6">Objets liés au texte officiel</BlocTitle>
            <BlocContent>
              {renderCards()}
            </BlocContent>
          </Bloc>
        </Col>
      </Row>
    </Container>
  );
}
