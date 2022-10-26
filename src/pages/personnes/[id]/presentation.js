import { useEffect, useState } from 'react';
import { Row, Title, Col, Icon, TagGroup, Tag } from '@dataesr/react-dsfr';
import Identifiers from '../../../components/blocs/identifiers';
import SocialMedias from '../../../components/blocs/social-medias';
import Weblinks from '../../../components/blocs/weblinks';
import Spinner from '../../../components/spinner';
import useFetch from '../../../hooks/useFetch';
import useHashScroll from '../../../hooks/useHashScroll';
import useUrl from '../../../hooks/useUrl';
import PersonCurrentMandates from '../../../components/blocs/current-mandates';

const WIKI_LANG_ORDER = ['frwiki', 'enwiki', 'dewiki', 'itwiki', 'eswiki'];
const getWikipediaUrl = (lang, title) => `https://${lang.slice(0, lang.length - 4)}.wikipedia.org/wiki/${title.replace(' ', '_')}`;
const filterWikipediaSiteLinks = (sitelinks) => [...new Set([...WIKI_LANG_ORDER, ...Object.keys(sitelinks)])]
  .filter((lang) => lang !== 'commonswiki')
  .filter((lang) => Object.keys(sitelinks).includes(lang))
  .map((lang) => ({ lang: lang.slice(0, lang.length - 4).toUpperCase(), link: getWikipediaUrl(lang, sitelinks[lang]?.title) }));

export default function PersonPresentationPage() {
  useHashScroll();
  const { url } = useUrl();
  const { data, isLoading, error } = useFetch(url);
  const { data: wikidata } = useFetch(`${url}/identifiers?filters[type]=Wikidata`);
  const [activity, setActivity] = useState(null);
  const [wikis, setWikis] = useState(null);

  useEffect(() => {
    const getActivity = async (wikiId) => fetch(`https://www.wikidata.org/w/api.php?format=json&origin=*&action=wbgetentities&ids=${wikiId}`)
      .then((response) => response.json())
      .then((json) => {
        setActivity(json?.entities?.[wikiId]?.descriptions?.fr?.value);
        const sitelinks = filterWikipediaSiteLinks(json?.entities?.[wikiId]?.sitelinks);
        setWikis(sitelinks);
      })
      .catch(() => null);

    if (wikidata?.data?.length) {
      getActivity(wikidata.data[0]?.value);
    }
  }, [wikidata]);

  if (isLoading) return <Row className="fr-my-2w flex--space-around"><Spinner /></Row>;
  if (error) return <Row className="fr-my-2w flex--space-around">Erreur...</Row>;
  return (
    <>
      <Row>
        <Col n="12">
          <Title as="h3" look="h4">En un coup d'oeil</Title>
        </Col>
      </Row>
      <Row gutters spacing="mb-5w">
        {(activity || wikis?.length > 0) && (
          <Col n="12">
            <div className="fr-card fr-card--xs fr-card--horizontal fr-card--grey fr-card--no-border card-persons">
              <div className="fr-card__body">
                <div className="fr-card__content">
                  {activity && (
                    <p className="fr-card__title">
                      <span className="fr-text fr-text--regular fr-text--md fr-pr-1w">{activity}</span>
                    </p>
                  )}
                  <div className="fr-card__start">
                    <p className="fr-card__detail fr-text--sm fr-mb-0">
                      <Icon name="ri-global-line" size="1x" />
                      Dans wikipedia
                    </p>
                  </div>
                </div>
                {(wikis?.length > 0) && (
                  <div className="fr-card__end fr-mt-0">
                    <p className="fr-card__detail fr-mb-1w">
                      Articles wikipédia:
                    </p>
                    <TagGroup size="sm">
                      {wikis.map((wiki) => <Tag iconPosition="right" icon="ri-external-link-line" onClick={() => window.open(wiki.link, '_blank')} key={wiki.lang}>{wiki.lang}</Tag>)}
                    </TagGroup>
                  </div>
                )}
              </div>
            </div>
          </Col>
        )}
        <Col n="12">
          <div className="fr-card fr-card--xs fr-card--horizontal fr-card--grey fr-card--no-border card-persons">
            <div className="fr-card__body">
              <div className="fr-card__content">
                <p className="fr-card__title">
                  <span className="fr-text fr-text--regular fr-text--md fr-pr-1w">{data?.otherNames?.length > 0 ? data.otherNames.join(', ') : 'Aucune autre dénomination connue'}</span>
                </p>
                <div className="fr-card__start">
                  <p className="fr-card__detail fr-text--sm fr-mb-0">
                    <Icon name="ri-contacts-line" size="1x" />
                    Autres dénominations connues
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <PersonCurrentMandates />
      <Title as="h3" look="h4">Présence sur le web</Title>
      <Row gutters>
        <Col n="12 md-6">
          <Weblinks />
        </Col>
        <Col n="12 md-6">
          <SocialMedias />
        </Col>
      </Row>
      <Identifiers />
    </>
  );
}
