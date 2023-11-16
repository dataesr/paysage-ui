import { Icon, Tag } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import TagList from '../tag-list';
import { capitalize } from '../../utils/strings';

export default function WikipediaLinks({ wikiInfo, allowedLanguages }) {
  const sortedLanguages = Object.keys(wikiInfo.itemName).sort((a, b) => {
    if (allowedLanguages.includes(a) && !allowedLanguages.includes(b)) {
      return -1;
    } if (!allowedLanguages.includes(a) && allowedLanguages.includes(b)) {
      return 1;
    }
    return allowedLanguages.indexOf(a) - allowedLanguages.indexOf(b);
  });

  return (
    <div className="fr-card fr-card--xs fr-card--horizontal fr-card--grey fr-card--no-border card-geographical-categories">
      <div className="fr-card__body">
        <div className="fr-card__content">
          <div className="fr-card__start">
            <p className="fr-card__detail fr-text--sm fr-mb-2">
              <Icon name="ri-global-line" size="1x" />
              Dans Wikipédia
            </p>
            <p>{capitalize(wikiInfo.description)}</p>
            <TagList>
              {sortedLanguages.map((lang) => {
                const langInfo = wikiInfo.itemName[lang];
                if (langInfo.value) {
                  const wikipediaUrl = `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(langInfo.value)}`;
                  return (
                    <Tag
                      iconPosition="right"
                      icon="ri-external-link-line"
                      onClick={() => {
                        window.open(wikipediaUrl, '_blank');
                      }}
                      key={lang}
                    >
                      {lang.toLocaleUpperCase()}
                    </Tag>
                  );
                }
                return null;
              })}
            </TagList>
          </div>
        </div>
      </div>
    </div>
  );
}

WikipediaLinks.propTypes = {
  wikiInfo: PropTypes.shape,
  allowedLanguages: PropTypes.array,
};

WikipediaLinks.defaultProps = {
  wikiInfo: '',
  allowedLanguages: [],
};
