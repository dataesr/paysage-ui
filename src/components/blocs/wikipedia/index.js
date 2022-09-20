import {
  Col,
  Row,
  Title,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

import ExpendableListCards from '../../card/expendable-list-cards';
import WikipediaCard from '../../card/wikipedia-card';
import PaysageSection from '../../sections/section';
import api from '../../../utils/api';

export default function Wikipedia({ apiObject, id }) {
  const [data, setData] = useState([]);

  const getWikipediaLang = (key) => key.slice(0, key.length - 4).toUpperCase();
  const getWikipediaLink = useCallback((key, element) => `https://${key.slice(0, key.length - 4).toUpperCase()}.wikipedia.org/wiki/${element[key].title.replace(' ', '_')}`, []);

  useEffect(() => {
    const getData = async () => {
      const wikidatas = await api
        .get(`/${apiObject}/${id}/identifiers`)
        .then((response) => response?.data?.data.filter((identifier) => identifier.type === 'Wikidata'))
        .catch((e) => {
          console.log(e);
        });
      const sitelinks = await Promise.all(wikidatas.map(async (wikidata) => {
        const url = `https://www.wikidata.org/w/api.php?format=json&origin=*&action=wbgetentities&props=sitelinks&ids=${wikidata.value}`;
        const response = await fetch(url);
        if (response.ok) {
          const json = await response.json();
          return json.entities[wikidata.value].sitelinks;
        }
        return {};
      }));
      const links = sitelinks.map((element) => Object.keys(element).map((key) => ({
        lang: getWikipediaLang(key),
        link: getWikipediaLink(key, element),
      }))).flat();
      links.sort((a, b) => {
        if (a.lang < b.lang) {
          return -1;
        }
        if (a.lang > b.lang) {
          return 1;
        }
        return 0;
      });
      setData(links);
    };
    getData();
    return () => {};
  }, [apiObject, getWikipediaLink, id]);

  const renderCards = () => {
    const list = data.filter((element) => element.lang !== ('COMMONS')).map((element) => (
      <WikipediaCard
        lang={element.lang}
        link={element.link}
      />
    ));
    return <ExpendableListCards apiObject={apiObject} list={list} nCol="12 md-3" max="8" />;
  };

  if (!data) {
    return <PaysageSection dataPaysageMenu="Wikipédia" id="wikipedia" isEmpty />;
  }

  return (
    <PaysageSection dataPaysageMenu="Wikipédia" id="wikipedia">
      <Row>
        <Col>
          <Title as="h3" look="h6">
            Wikipédia
          </Title>
        </Col>
      </Row>
      <Row>
        {renderCards()}
      </Row>
    </PaysageSection>
  );
}

Wikipedia.propTypes = {
  apiObject: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
