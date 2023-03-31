import PropTypes from 'prop-types';
import { Badge, BadgeGroup, Button, Col, Link, Row, Tag, Text } from '@dataesr/react-dsfr';
import { useNavigate } from 'react-router-dom';
import { Download } from '../download';
import TagList from '../tag-list';
import useAuth from '../../hooks/useAuth';
import useEditMode from '../../hooks/useEditMode';

export default function DocumentCard({ document, onEdit, n }) {
  const { editMode } = useEditMode();
  const { viewer } = useAuth();
  const navigate = useNavigate();
  const { id, canAccess, relatedObjects, startDate, description, title, documentType, documentUrl, files } = document;

  const renderGroupBadge = (access = []) => {
    if (!access?.length > 0) return null;
    const { groups } = viewer;
    const accessGroups = groups.filter((elem) => (access.includes(elem.id)));
    if (accessGroups.length > 0) {
      return accessGroups.map((group) => <Badge key={group.id} type="success" iconPosition="right" icon="ri-lock-unlock-line" text={group.acronym || group.name} />);
    }
    return null;
  };

  return (
    <Col n={n} key={id}>
      <div className="fr-card fr-card--xs fr-card--shadow" style={{ zIndex: 'calc(var(--ground) + 499 !important' }}>
        <div className="fr-card__body">
          <div className="fr-card__content">
            <div className="fr-card__start">
              <Row className="flex--space-between">
                <BadgeGroup>
                  {renderGroupBadge(canAccess)}
                </BadgeGroup>
                {(editMode && onEdit) && <Button onClick={() => onEdit(document)} className="edit-button" icon="ri-edit-line" title="Editer le document" tertiary borderless rounded />}
              </Row>
            </div>
            <p className="fr-card__title">{title}</p>
            <Row className="fr-card__desc">
              <BadgeGroup className="fr-mt-1v">
                <Badge text={documentType?.usualName} />
                <Badge type="info" text={startDate?.slice(0, 4)} />
              </BadgeGroup>
            </Row>
            {description && <div className="fr-card__desc">{description}</div>}
            <div className="fr-card__end">
              {(relatedObjects.length > 1) && <Text spacing="mb-1w" bold>Autres objets associés :</Text>}
              {documentUrl && (
                <Row>
                  <Col className="fr-pb-1w">
                    <Link target="_blank" href={documentUrl} rel="noreferrer">
                      Lien vers le document
                    </Link>
                  </Col>
                </Row>
              )}
              {relatedObjects && (
                <TagList maxTags={2}>
                  {relatedObjects
                    .map((related) => <Tag iconPosition="right" icon="ri-arrow-right-line" onClick={() => navigate(related.href)} key={related.id}>{related.displayName}</Tag>)}
                </TagList>
              )}
              <Row>
                {files.map((file) => (<Download key={file.url} file={file} />
                ))}
              </Row>
            </div>
          </div>
        </div>
      </div>
    </Col>
  );
}

DocumentCard.propTypes = {
  document: PropTypes.shape.isRequired,
  onEdit: PropTypes.func,
  n: PropTypes.string,
};

DocumentCard.defaultProps = {
  onEdit: null,
  n: '12 md-6',
};
