import { useEffect, useState } from 'react';
import { Icon, Tag, Col, Alert } from '@dataesr/react-dsfr';
import TagList from '../../tag-list';
import useFetch from '../../../hooks/useFetch';
import useUrl from '../../../hooks/useUrl';
import { capitalize } from '../../../utils/strings';

const WIKI_LANG_ORDER = ['frwiki', 'enwiki', 'dewiki', 'itwiki', 'eswiki'];
const WIKI_URL = 'https://www.wikidata.org/w/api.php?format=json&origin=*&action=wbgetentities&ids=';
const getWikipediaUrl = (lang, title) => `https://${lang.slice(0, lang.length - 4)}.wikipedia.org/wiki/${title.replace(' ', '_')}`;
const filterWikipediaSiteLinks = (sitelinks) => [...new Set([...WIKI_LANG_ORDER, ...Object.keys(sitelinks)])]
  .filter((lang) => lang !== 'commonswiki')
  .filter((lang) => Object.keys(sitelinks).includes(lang))
  .map((lang) => ({ lang: lang?.slice(0, lang.length - 4).toUpperCase(), link: getWikipediaUrl(lang, sitelinks[lang]?.title) }));

export default function Wiki() {
  const { url, apiObject } = useUrl();
  const { data: wikidata } = useFetch(`${url}/identifiers?filters[type]=Wikidata&filters`);
  const [activity, setActivity] = useState(null);
  const [wikis, setWikis] = useState(null);

  useEffect(() => {
    const getActivity = async (wikidatas) => {
      const allWikis = wikidatas
        .filter((w) => w.active)
        .map((wiki) => fetch(`${WIKI_URL}${wiki.value}`)
          .then((res) => res.json())
          .then((doc) => doc.entities[Object.keys(doc.entities)[0]]));
      const datas = await Promise.all(allWikis);
      setActivity(datas.filter((el) => el)[0]?.descriptions?.fr?.value);
      const { sitelinks } = datas.filter((el) => el)[0];
      setWikis(filterWikipediaSiteLinks(sitelinks));
    };
    if (wikidata?.data?.length) {
      getActivity(wikidata.data);
    }
  }, [wikidata]);
  if (activity || wikis?.length > 0) {
    return (
      <Col n="12">
        <div className={`fr-card fr-card--xs fr-card--horizontal fr-card--grey fr-card--no-border card-${apiObject}`}>
          <div className="fr-card__body">
            <div className="fr-card__content">
              {activity && (
                <p className="fr-card__title">
                  <span className="fr-text fr-text--regular fr-text--md fr-pr-1w">
                    {capitalize(activity)}
                  </span>
                </p>
              )}
              <div className="fr-card__start">
                <p className="fr-card__detail fr-text--sm fr-mb-2">
                  <Icon name="ri-global-line" size="1x" />
                  Dans Wikipédia
                </p>
                {wikidata?.data?.length > 1 ? (
                  <Alert
                    description="Attention, plusieurs Wikidatas sont renseignés. Merci de privilégier le plus complet."
                    small
                    type="error"
                  />
                ) : null}
              </div>
            </div>
            {(wikis?.length > 0) && (
              <div className="fr-card__end fr-mt-0 fr-mb-2w">
                <p className="fr-card__detail fr-mb-1w">
                  {`Articles Wikipédia : ${(wikis?.length) && `${wikis?.length}`}`}
                </p>
                <TagList>
                  {wikis.map((wiki) => (
                    <Tag
                      iconPosition="right"
                      icon="ri-external-link-line"
                      onClick={() => window.open(wiki.link, '_blank')}
                      key={wiki.lang}
                    >
                      {wiki.lang}
                    </Tag>
                  ))}
                </TagList>
              </div>
            )}
          </div>
        </div>
      </Col>
    );
  }
  return null;
}
