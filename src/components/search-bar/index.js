/* eslint-disable react/no-array-index-key */
import { forwardRef, useLayoutEffect, useRef, useState } from 'react';

import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import classnames from 'classnames';
import { Badge, Icon, Text } from '@dataesr/react-dsfr';
import styles from './styles.module.scss';

const objectTypes = {
  structures: 'ri-building-line',
  personnes: 'ri-user-3-line',
  prix: 'ri-award-line',
  'textes-officiels': 'ri-git-repository-line',
  projets: 'ri-booklet-fill',
  categories: 'ri-price-tag-3-line',
  terms: 'ri-hashtag',
};

const SearchBar = forwardRef((props, ref) => {
  const {
    size,
    label,
    buttonLabel,
    placeholder,
    onSearch,
    scope,
    options,
    optionsIcon,
    onSelect,
    onDeleteScope,
    value,
    required,
    hint,
    className,
    ...remainingProps
  } = props;
  const inputId = useRef(uuidv4());
  const hintId = useRef(uuidv4());
  const scopeRef = useRef();
  const _className = classnames('fr-search-bar', 'fr-mt-2v', {
    'fr-search-bar--lg': (size === 'lg'),
  }, className);
  const _classNameButton = classnames('fr-btn', { 'fr-btn--lg': (size === 'lg') });
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [inputPadding, setInputPadding] = useState(0);
  const [isScopeSelected, setIsScopeSelected] = useState(false);

  const handleDeleteScope = () => {
    if (!value && onDeleteScope) {
      if (isScopeSelected) {
        onDeleteScope();
        setIsScopeSelected(false);
      } else {
        setIsScopeSelected(true);
      }
    }
  };

  const handleOnKeyDown = (e) => {
    // User pressed the enter key
    if (e.keyCode === 13) {
      e.preventDefault();
      if (onSearch) {
        onSearch(value);
      } else if ((activeSuggestionIndex !== null) && onSelect) {
        onSelect(options[activeSuggestionIndex]);
      }
    } else if (e.keyCode === 8) {
      handleDeleteScope();
    } else if (e.keyCode === 38) {
      // User pressed the up arrow
      e.preventDefault();
      setActiveSuggestionIndex((activeSuggestionIndex !== null && activeSuggestionIndex !== 0) ? activeSuggestionIndex - 1 : null);
    } else if (e.keyCode === 40) {
      // User pressed the down arrow
      if (activeSuggestionIndex !== null && activeSuggestionIndex < (options.length - 1)) {
        setActiveSuggestionIndex(activeSuggestionIndex + 1);
      } else if (activeSuggestionIndex === null) {
        setActiveSuggestionIndex(0);
      } else if (activeSuggestionIndex !== null && activeSuggestionIndex === (options.length - 1)) {
        setActiveSuggestionIndex(null);
      }
    }
  };

  useLayoutEffect(() => {
    if (scopeRef && scopeRef.current) {
      setInputPadding(scopeRef.current.offsetWidth);
    } else { setInputPadding(0); }
  }, [scope]);

  const colorFamily = 'new';
  const scopeClassNames = classnames(
    'fr-badge',
    styles.badge,
    {
      [`fr-badge--${colorFamily}`]: colorFamily,
      [styles.badgeselected]: isScopeSelected,
    },
  );

  return (
    <div
      onBlur={() => setShowOptions(false)}
      onFocus={() => setShowOptions(true)}
      role="search"
      className={classnames(styles.form, _className)}
    >
      <div className={styles.searchbar}>
        <label className={styles.label} htmlFor={inputId.current}>
          {label}
          {required && <span className="error"> *</span>}
          {hint && (
            <p className="fr-hint-text" id={hintId.current}>
              {hint}
            </p>
          )}
        </label>
        <div className={_className}>
          {scope && (
            <button onClick={handleDeleteScope} type="button" ref={scopeRef} className={scopeClassNames}>
              {scope}
              {isScopeSelected && <span className="ri-1x icon-right ds-fr--v-sub ri-close-line ds-fr-badge-icon" />}
            </button>
          )}
          <input
            ref={ref}
            className="fr-input"
            placeholder={placeholder}
            type="search"
            id={inputId.current}
            value={value}
            onKeyDown={handleOnKeyDown}
            onFocus={() => setIsScopeSelected(false)}
            style={{ paddingLeft: `calc(${inputPadding}px + 1rem)` }}
            {...remainingProps}
          />
          {onSearch && (
            <button
              type="submit"
              onClick={() => onSearch(value)}
              className={_classNameButton}
              title={buttonLabel}
            >
              {buttonLabel}
            </button>
          )}
        </div>
        <div className={styles.autocomplete}>
          {(options.length && showOptions) ? (
            <ul className={styles.list} onMouseLeave={() => setActiveSuggestionIndex(null)}>
              {options.map((option, i) => (
                <li
                  key={i}
                  id={`${inputId.current}-option-${i}`}
                  className={classnames(`${styles.item}`, { [styles.hovered]: (i === activeSuggestionIndex) })}
                  onMouseEnter={() => setActiveSuggestionIndex(i)}
                >
                  <button
                    tabIndex={-1}
                    className={styles.btn}
                    type="button"
                    onMouseDown={() => { onSelect(option); }}
                  >
                    {option.type && <Icon size="xl" color={`var(--${option.type}-color)`} name={objectTypes[option.type]} />}
                    <Text className={styles.content}>
                      {option.name}
                      {option.acronym ? ` (${option.acronym})` : null}
                      {option.locality ? ` à ${ option.locality.charAt(0).toUpperCase() + option.locality.slice(1) }` : null}
                      {option.creationDate ? ` depuis ${option.creationDate.slice(0, 4)}` : null}
                    </Text>
                    {optionsIcon && <Badge type="info" isSmall hasIcon icon={optionsIcon} text="voir la page" />}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
});
SearchBar.defaultProps = {
  size: 'md',
  placeholder: '',
  value: '',
  hint: '',
  required: false,
  scope: null,
  className: '',
  label: '',
  options: [],
  onSearch: null,
  optionsIcon: null,
  onDeleteScope: null,
};
SearchBar.propTypes = {
  label: PropTypes.string,
  buttonLabel: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onSearch: PropTypes.func,
  size: PropTypes.oneOf(['md', 'lg']),
  value: PropTypes.string,
  hint: PropTypes.string,
  required: PropTypes.bool,
  scope: PropTypes.string,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
  options: PropTypes.arrayOf(PropTypes.shape),
  onSelect: PropTypes.func.isRequired,
  onDeleteScope: PropTypes.func,
  optionsIcon: PropTypes.string,
};

export default SearchBar;
