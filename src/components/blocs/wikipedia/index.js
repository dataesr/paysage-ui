import { useCallback, useEffect, useState } from 'react';

import { Bloc, BlocContent, BlocTitle } from '../../bloc';
import ExpendableListCards from '../../card/expendable-list-cards';
import WikipediaCard from '../../card/wikipedia-card';
import api from '../../../utils/api';
import useUrl from '../../../hooks/useUrl';

export default function Wikipedia() {
  const [data, setData] = useState([]);
  const { url, apiObject } = useUrl('identifiers');

  const getWikipediaLang = (key) => key.slice(0, key.length - 4).toUpperCase();
  const getWikipediaLink = useCallback((key, element) => `https://${key.slice(0, key.length - 4).toUpperCase()}.wikipedia.org/wiki/${element[key].title.replace(' ', '_')}`, []);

  useEffect(() => {
    const getData = async () => {
      const wikidatas = await api
        .get(url)
        .then((response) => response?.data?.data.filter((identifier) => identifier.type === 'Wikidata'))
        .catch((e) => {
          console.log(e);
        });
      const sitelinks = await Promise.all(wikidatas.map(async (wikidata) => {
        const wikiUrl = `https://www.wikidata.org/w/api.php?format=json&origin=*&action=wbgetentities&props=sitelinks&ids=${wikidata.value}`;
        const response = await fetch(wikiUrl);
        if (response.ok) {
          const json = await response.json();
          return json.entities[wikidata.value].sitelinks;
        }
        return {};
      }));
      const links = sitelinks.map((element) => Object.keys(element).map((key) => ({
        lang: getWikipediaLang(key),
        link: getWikipediaLink(key, element),
      }))).flat().filter((element) => element.lang !== ('COMMONS'));
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
  }, [apiObject, getWikipediaLink, url]);

  const renderCards = () => {
    const list = data.map((element) => (
      <WikipediaCard
        lang={element.lang}
        link={element.link}
      />
    ));
    return <ExpendableListCards apiObject={apiObject} list={list} nCol="12 md-3" max={4} order={['FR', 'EN', 'DE']} sortOn="props.lang" />;
  };

  return (
    <Bloc isLoading={!data} error={false} data={data}>
      <BlocTitle as="h3" look="h6">Wikipédia</BlocTitle>
      <BlocContent>{renderCards()}</BlocContent>
    </Bloc>
  );
}
