import { useState } from 'react';
import { Col, Container, Modal, ModalContent, ModalTitle, Row, Text } from '@dataesr/react-dsfr';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Button from '../../../button';
import AddStructureForm from './add-structure-form';

import '../styles/data-list.scss';

function StructuresComponent({ type, structures, id, deleteStructure }) {
  const _structures = structures?.filter((s) => s.type === type);
  if (!_structures?.length) return null;
  return (
    <>
      {type === 'primary' && <div className="fr-hr-or fr-my-1w">Principal</div>}
      {type === 'secondary' && <div className="fr-hr-or fr-my-1w">Secondaire</div>}
      {type === 'historical' && <div className="fr-hr-or fr-my-1w">Historique</div>}
      <ul style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
        {
          _structures.map((s) => (
            <li style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <span className="fr-text--sm fr-mb-0">{s.structure?.displayName}</span>
              <Button
                onClick={() => { deleteStructure(id, s.id); }}
                tertiary
                rounded
                borderless
                size="sm"
                color="error"
                title="Retirer"
                icon="ri-delete-bin-line"
              />
            </li>
          ))
        }
      </ul>
    </>
  );
}

StructuresComponent.propTypes = {
  type: PropTypes.string.isRequired,
  deleteStructure: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  structures: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  })).isRequired,
};

export default function DomainsList({ data, deleteItem, highlight, deleteStructure, addStructure, restore }) {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const onOpenModalHandler = (id) => {
    setModalContent(
      <AddStructureForm
        id={id}
        onSave={addStructure}
      />,
    );
    setShowModal(true);
  };

  return (
    <Container fluid>
      <Row alignItems="middle">
        <Col n="12" className="tbl-line fr-py-1v fr-px-1w">
          <Row alignItems="middle">
            <Col n="4">
              <Text className="fr-mb-0" bold>Nom de domaine</Text>
            </Col>
            <Col n="8">
              <Text className="fr-mb-0" bold>Structures</Text>
            </Col>
          </Row>
          <Modal isOpen={showModal} size="lg" hide={() => setShowModal(false)}>
            <ModalTitle>Ajouter une structure au domaine</ModalTitle>
            <ModalContent>{modalContent}</ModalContent>
          </Modal>
        </Col>
        {data.map((item) => (
          <Col n="12" key={item.id} className={classNames('tbl-line tbl-line__item fr-py-1w fr-px-1w', { 'tbl-highlight': (highlight === item.id) })}>
            <Row alignItems="top" gutters>
              <Col n="4">
                <Text size="lg" bold className="fr-mb-0">
                  <span style={{ lineBreak: 'anywhere' }}>
                    {item.domainName}
                  </span>
                </Text>
                {item.archived ? (
                  <div style={{ display: 'flex', gap: '.25rem', flexDirection: 'column' }}>
                    <span className="fr-mt-1w fr-badge fr-badge--warning fr-badge--sm">
                      Archivé
                    </span>
                    <Button
                      onClick={() => { restore(item.id); }}
                      secondary
                      size="sm"
                      title="Restaurer"
                      icon="ri-add-line"
                      className="fr-mt-1w"
                    >
                      Archiver
                    </Button>
                    <Button
                      onClick={() => { deleteItem(item.id, false); }}
                      secondary
                      size="sm"
                      color="error"
                      title="Supprimer"
                      icon="ri-delete-bin-line"
                      className="fr-mt-1w"
                    >
                      Supprimer
                    </Button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '.25rem', flexDirection: 'column' }}>
                    <Button
                      onClick={() => { onOpenModalHandler(item.id); }}
                      secondary
                      size="sm"
                      color="success"
                      title="Ajouter"
                      icon="ri-add-line"
                      className="fr-mt-1w"
                    >
                      Ajouter une structure
                    </Button>
                    <Button
                      onClick={() => { deleteItem(item.id); }}
                      secondary
                      size="sm"
                      title="Archiver"
                      icon="ri-delete-bin-line"
                      className="fr-mt-1w"
                    >
                      Archiver
                    </Button>
                    <Button
                      onClick={() => { deleteItem(item.id, false); }}
                      secondary
                      size="sm"
                      color="error"
                      title="Supprimer"
                      icon="ri-delete-bin-line"
                      className="fr-mt-1w"
                    >
                      Supprimer
                    </Button>
                  </div>
                ) }
              </Col>
              <Col n="8">
                <StructuresComponent id={item.id} type="primary" deleteStructure={deleteStructure} structures={item.structures} />
                <StructuresComponent id={item.id} type="secondary" deleteStructure={deleteStructure} structures={item.structures} />
                <StructuresComponent id={item.id} type="historical" deleteStructure={deleteStructure} structures={item.structures} />
              </Col>
            </Row>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

DomainsList.propTypes = {
  data: PropTypes.array.isRequired,
  deleteItem: PropTypes.func.isRequired,
  restore: PropTypes.func.isRequired,
  deleteStructure: PropTypes.func.isRequired,
  addStructure: PropTypes.func.isRequired,
  highlight: PropTypes.string,
};
DomainsList.defaultProps = {
  highlight: null,
};
