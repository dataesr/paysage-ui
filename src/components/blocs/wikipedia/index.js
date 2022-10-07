import { useCallback, useEffect, useState } from 'react';

import { Bloc, BlocContent, BlocTitle } from '../../bloc';
import ExpendableListCards from '../../card/expendable-list-cards';
import WikipediaCard from '../../card/wikipedia-card';
import api from '../../../utils/api';
import useUrl from '../../../hooks/useUrl';

export default function Wikipedia() {
  const [data, setData] = useState([]);
  const { url } = useUrl('identifiers?filters[type]=Wikidata');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const getWikipediaLang = (key) => key.slice(0, key.length - 4).toUpperCase();
  const getWikipediaLink = useCallback((key, element) => `https://${key.slice(0, key.length - 4).toUpperCase()}.wikipedia.org/wiki/${element[key].title.replace(' ', '_')}`, []);

  useEffect(() => {
    const getData = async () => {
      const wikidatas = await api.get(url)
        .then((response) => response?.data?.data)
        .catch(() => setError(true));
      const sitelinks = await Promise.all(wikidatas.map(async (wikidata) => {
        const wikiUrl = `https://www.wikidata.org/w/api.php?format=json&origin=*&action=wbgetentities&props=sitelinks&ids=${wikidata.value}`;
        const response = await fetch(wikiUrl).catch(() => setError(true));
        const json = await response.json();
        return json?.entities?.[wikidata.value]?.sitelinks;
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
    setIsLoading(true);
    getData();
    setIsLoading(false);
  }, [getWikipediaLink, url]);

  const renderCards = () => {
    const list = data.map((element) => (
      <WikipediaCard
        lang={element.lang}
        link={element.link}
      />
    ));
    return <ExpendableListCards list={list} nCol="12 md-3" max={4} order={['FR', 'EN', 'DE']} sortOn="props.lang" />;
  };

  return (
    <Bloc isLoading={isLoading} error={error} data={data} noBadge>
      <BlocTitle as="h4" look="h6">Wikipédia</BlocTitle>
      <BlocContent>{renderCards()}</BlocContent>
    </Bloc>
  );
}
