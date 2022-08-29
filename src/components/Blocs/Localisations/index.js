import PropTypes from 'prop-types';
import { Button, Col, Row, Tile, TileBody, Title } from '@dataesr/react-dsfr';
import Map from '../../Map';
import PaysageSection from '../../Sections/section';
import EmptySection from '../../Sections/empty';

export default function LocalisationsComponent({ id, apiObject, data }) {
  console.log('data', data);
  return (
    <PaysageSection dataPaysageMenu="Localisation" id="localisations">
      <Row>
        <Col>
          <Title as="h3" look="h6">
            Localisation
          </Title>
        </Col>
        <Col className="text-right">
          <Button
            // onClick={onClickAddHandler}
            size="sm"
            secondary
            icon="ri-add-circle-line"
          >
            Ajouter une adresse
          </Button>
        </Col>
      </Row>
      {Object.keys(data).length === 0 ? (
        <EmptySection apiObject={apiObject} />
      ) : null}
      {data?.geometry?.coordinates ? (
        <Row>
          <Col>
            <Map
              lat={data?.geometry?.coordinates[1]}
              lng={data?.geometry?.coordinates[0]}
              markers={[
                {
                  address: data.address,
                  latLng: [
                    data?.geometry?.coordinates[1],
                    data?.geometry?.coordinates[0],
                  ],
                },
              ]}
            />
          </Col>
        </Row>
      ) : null}
      {data?.address ? (
        <Row>
          <Col>
            <Tile>
              <TileBody>
                <Row>
                  <Col>
                    {data.address}
                    {/* <br /> */}
                    {`${data.locality} - ${data.postalCode}`}
                  </Col>
                  <Col>
                    <Button className="fr-mr-1w" secondary>
                      Modifier l'adresse actuelle
                    </Button>
                    <Button>Voir l'historique</Button>
                  </Col>
                </Row>
              </TileBody>
            </Tile>
          </Col>
        </Row>
      ) : null}
    </PaysageSection>
  );
}

LocalisationsComponent.propTypes = {
  apiObject: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
};
