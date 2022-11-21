import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Badge,
  BadgeGroup, Breadcrumb, BreadcrumbItem, ButtonGroup,
  Col, Container, Icon, Link, Modal, ModalContent, ModalTitle, Row, Title,
} from '@dataesr/react-dsfr';
import useEditMode from '../../hooks/useEditMode';
import Button from '../../components/button';
import CopyBadgeButton from '../../components/copy/copy-badge-button';
import { DropdownButton, DropdownButtonItem } from '../../components/dropdown-button';
import useUrl from '../../hooks/useUrl';
import Spinner from '../../components/spinner';
import api from '../../utils/api';
import useNotice from '../../hooks/useNotice';
import OfficiaTextForm from '../../components/forms/official-text';
import { saveError, saveSuccess } from '../../utils/notice-contents';
import useFetch from '../../hooks/useFetch';
import RelatedObjectCard from '../../components/card/related-object-card';
import { Bloc, BlocContent, BlocTitle } from '../../components/bloc';

export default function OfficialTextByIdPage() {
  const { url } = useUrl();
  const { data, isLoading, error, reload } = useFetch(url);
  const { notice } = useNotice();
  const { editMode, reset, toggle } = useEditMode();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  useEffect(() => { reset(); }, [reset]);
  useEffect(() => { document.title = `Texte officiels · ${data?.title}`; }, [data]);

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

  if (isLoading) return <Row className="fr-my-2w flex--space-around"><Spinner /></Row>;
  if (error) return <>Erreur...</>;
  if (!data) return null;
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
                        <OfficiaTextForm id={data.id} data={data} onSave={onSave} />
                      </ModalContent>
                    </Modal>
                  </DropdownButtonItem>
                </DropdownButton>
              )}
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
              {data.title}
              <BadgeGroup className="fr-pt-1w">
                <Badge text="texte officiel" type="info" />
                <CopyBadgeButton
                  colorFamily="yellow-tournesol"
                  text={data.id}
                  lowercase
                />
              </BadgeGroup>
            </Title>
          </Row>
          {data.pageUrl && <Link href={data.pageUrl}>Accéder au texte</Link>}
          <Bloc data={{ totalCount: data?.relatedObjects?.length }} error={error} isLoading={isLoading}>
            <BlocTitle as="h3" look="h6">Objets liés au texte officiel</BlocTitle>
            <BlocContent>
              {renderCards()}
            </BlocContent>
          </Bloc>
        </Col>
      </Row>
    </Container>
  );
}
