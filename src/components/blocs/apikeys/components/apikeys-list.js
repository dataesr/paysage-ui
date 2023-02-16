import { Col, Container, Row, Text } from '@dataesr/react-dsfr';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Button from '../../../button';
import CopyButton from '../../../copy/copy-button';
import { Spinner } from '../../../spinner';
import useSort from '../hooks/useSort';
import '../styles/data-list.scss';

export default function ApiKeysList({ data, deleteItem, highlight }) {
  const [sort, setSort] = useSort({ field: 'createdAt', type: 'date', ascending: false });
  const [actionnedItem, setActionnedItem] = useState();
  const sortedData = sort.ascending ? data.sort(sort.sorter) : data.sort(sort.sorter).reverse();
  return (
    <Container fluid>
      <Row alignItems="middle">
        <Col n="12" className="tbl-line fr-py-1v fr-px-1w">
          <Row alignItems="middle">
            <Col n="3">
              <Row
                className={classNames('tbl-title__sort', { 'tbl-title__hover': (sort.field !== 'user') })}
                alignItems="middle"
              >
                <Text className="fr-mb-0" bold>Utilisateur</Text>
                <Button
                  tertiary
                  borderless
                  rounded
                  icon={`ri-arrow-${(sort.field === 'user' && !sort.ascending) ? 'up' : 'down'}-fill`}
                  onClick={() => setSort({ field: 'user', type: 'string' })}
                />
              </Row>
            </Col>
            <Col n="2">
              <Row
                className={classNames('tbl-title__sort', { 'tbl-title__hover': (sort.field !== 'name') })}
                alignItems="middle"
                justifyContent="right"
              >
                <Button
                  tertiary
                  borderless
                  rounded
                  icon={`ri-arrow-${(sort.field === 'name' && !sort.ascending) ? 'up' : 'down'}-fill`}
                  onClick={() => setSort({ field: 'name', type: 'string' })}
                />
                <Text className="fr-mb-0" bold>Nom de la clé</Text>
              </Row>
            </Col>
            <Col n="3">
              <Row
                className={classNames('tbl-title__sort')}
                justifyContent="right"
                alignItems="middle"
              >
                <Text className="fr-mb-0" bold>Clé API</Text>
              </Row>
            </Col>
            <Col n="3">
              <Row
                className={classNames('tbl-title__sort', { 'tbl-title__hover': (sort.field !== 'createdAt') })}
                justifyContent="right"
                alignItems="middle"
              >
                <Button
                  tertiary
                  borderless
                  rounded
                  icon={`ri-arrow-${(sort.field === 'createdAt' && !sort.ascending) ? 'up' : 'down'}-fill`}
                  onClick={() => setSort({ field: 'createdAt', type: 'date' })}
                />
                <Text className="fr-mb-0" bold>Créé le</Text>
              </Row>
            </Col>
            <Col n="1" />
          </Row>
        </Col>
        {sortedData.map((item) => (
          <Col n="12" key={item.id} className={classNames('tbl-line tbl-line__item fr-py-1w fr-px-1w', { 'tbl-highlight': (highlight === item.id) })}>
            <Row alignItems="middle">
              <Col n="3">
                <Text className="fr-mb-0">
                  {item.user}
                </Text>
              </Col>
              <Col n="2"><Row justifyContent="right"><Text className="fr-mb-0">{item.name}</Text></Row></Col>
              <Col n="3">
                <Row justifyContent="right">
                  <Text className="fr-mb-0">
                    {`${item.apiKey.split('-')[0]}-*****`}
                  </Text>
                  <CopyButton copyText={item.apiKey} />
                </Row>
              </Col>
              <Col n="3">
                <Row justifyContent="right">
                  <Text className="fr-mb-0">
                    {new Date(item.createdAt).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}
                  </Text>
                </Row>
              </Col>
              <Col n="1">
                <Row justifyContent="right">
                  {(actionnedItem !== item.id) && (
                    <Button
                      onClick={() => { setActionnedItem(item.id); deleteItem(item.id); }}
                      tertiary
                      rounded
                      borderless
                      color="error"
                      title="Supprimer"
                      icon="ri-delete-bin-line"
                    />
                  )}
                  {(actionnedItem === item.id) && <Spinner size={32} />}
                </Row>
              </Col>
            </Row>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

ApiKeysList.propTypes = {
  data: PropTypes.array.isRequired,
  deleteItem: PropTypes.func.isRequired,
  highlight: PropTypes.string,
};
ApiKeysList.defaultProps = {
  highlight: null,
};
