import { Badge, Icon, Text } from '@dataesr/react-dsfr';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { forwardRef, useId, useLayoutEffect, useRef, useState } from 'react';

import styles from './styles.module.scss';
import { Spinner } from '../spinner';
import { capitalize } from '../../utils/strings';
import { getName } from '../../utils/structures';
import { toString } from '../../utils/dates';

const objectTypes = {
  categories: 'ri-price-tag-3-line',
  'official-texts': 'ri-git-repository-line',
  'geographical-categories': 'ri-global-line',
  persons: 'ri-user-3-line',
  prizes: 'ri-award-line',
  projects: 'ri-booklet-fill',
  structures: 'ri-building-line',
  terms: 'ri-hashtag',
};

const SearchBar = forwardRef((props, ref) => {
  const {
    buttonLabel,
    className,
    hideLabel,
    hint,
    isSearching,
    label,
    onDeleteScope,
    onSearch,
    onSelect,
    options,
    optionsIcon,
    placeholder,
    required,
    scope,
    size,
    value,
    ...remainingProps
  } = props;
  const inputId = useId();
  const hintId = useId();
  const scopeRef = useRef();
  const _className = classNames('fr-search-bar', {
    'fr-search-bar--lg': (size === 'lg'),
  }, className);
  const _classNameButton = classNames('fr-btn', { 'fr-btn--lg': (size === 'lg') });
  const _classNameLabel = classNames(styles.label, { 'fr-label': hideLabel, 'fr-mb-2v': !hideLabel });
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
      // User pressed the backspace key
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
  const scopeclassNames = classNames(
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
      className={classNames(styles.form, _className)}
    >
      <div className={styles.searchbar}>
        <label className={_classNameLabel} htmlFor={inputId.current}>
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
            <button onClick={handleDeleteScope} type="button" ref={scopeRef} className={scopeclassNames}>
              {scope}
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
          {(isSearching && showOptions) && (
            <div className={`${styles.list} ${styles.loader}`}>
              <Spinner size={40} />
            </div>
          )}
          {(!isSearching && options.length && showOptions && value) ? (
            <ul className={styles.list} onMouseLeave={() => setActiveSuggestionIndex(null)}>
              {options.map((option, i) => (
                <li
                  key={option.id}
                  className={classNames(`${styles.item}`, { [styles.hovered]: (i === activeSuggestionIndex) })}
                  onMouseEnter={() => setActiveSuggestionIndex(i)}
                >
                  <button
                    tabIndex={-1}
                    className={styles.btn}
                    // style={{ backgroundColor: `${(option.structureStatus === 'inactive') ? 'var(--background-contrast-warning)' : 'inherit' }` }}
                    style={{ color: `${(option.structureStatus === 'inactive') ? 'var(--text-mention-grey' : 'inherit' }` }}
                    type="button"
                    onMouseDown={() => { onSelect(option); }}
                  >
                    {option.type && <Icon size="xl" color={`var(--${option.type}-color)`} name={objectTypes[option.type]} />}
                    <Text className={styles.content}>
                      {getName(option)}
                      <br />
                      {option.category && option?.structureStatus === 'active' && (
                        <i>
                          {` ${option.category}`}
                          {option.city && ` à ${capitalize(option.city)}`}
                          {option.creationDate && ` depuis ${option.creationDate.slice(0, 4)}`}
                        </i>
                      )}
                      {option.category && option?.structureStatus === 'inactive' && (
                        <i>
                          {` ${option.category}`}
                          {option.city && ` à ${capitalize(option.city)}`}
                          {option.closureDate && ` jusqu'à ${option.closureDate.slice(0, 4)}`}
                        </i>
                      )}
                      {option.activity && (
                        <i>
                          {capitalize(option.activity)}
                        </i>
                      )}
                      {option.publicationDate ? <strong>{` publié ${toString(option.publicationDate)}`}</strong> : null}
                    </Text>
                    {(option.structureStatus === 'inactive') && (
                      <Badge type="warning" isSmall text="Inactive" />
                    )}
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
  buttonLabel: 'Rechercher',
  className: '',
  hideLabel: false,
  hint: '',
  isSearching: false,
  label: '',
  onDeleteScope: null,
  onSearch: null,
  options: [],
  optionsIcon: null,
  placeholder: '',
  required: false,
  scope: null,
  size: 'md',
  value: '',
  onSelect: null,
};

SearchBar.propTypes = {
  buttonLabel: PropTypes.string,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
  hideLabel: PropTypes.bool,
  hint: PropTypes.string,
  isSearching: PropTypes.bool,
  label: PropTypes.string,
  onDeleteScope: PropTypes.func,
  onSearch: PropTypes.func,
  onSelect: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape),
  optionsIcon: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  scope: PropTypes.string,
  size: PropTypes.oneOf(['md', 'lg']),
  value: PropTypes.string,
};

export default SearchBar;
