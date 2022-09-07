/* eslint-disable react/no-array-index-key */
import React, { forwardRef, useRef, useState } from 'react';

import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import classnames from 'classnames';
import { Badge, Icon, Text } from '@dataesr/react-dsfr';
import styles from './styles.module.scss';

/**
 *
 * TODO:
 * hide Autocomplete options on input focus out
 * handle onKeyDown with arrows to select options
 */
const SearchBar = forwardRef((props, ref) => {
  const {
    size,
    label,
    buttonLabel,
    placeholder,
    onSearch,
    options,
    onSelect,
    value,
    className,
    ...remainingProps
  } = props;
  const inputId = useRef(uuidv4());
  const _className = classnames('fr-search-bar', {
    'fr-search-bar--lg': (size === 'lg'),
  }, className);
  const _classNameButton = classnames('fr-btn', { 'fr-btn--lg': (size === 'lg') });
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(null);
  const [showOptions, setShowOptions] = useState((options.length >= 0));

  const handleSubmit = (e) => { e.preventDefault(); onSearch(value); };
  const handleOnKeyDown = (e) => {
    // User pressed the enter key
    if (e.keyCode === 13) {
      if (onSearch) {
        onSearch(value);
      } else if (activeSuggestionIndex && onSelect) {
        onSelect(options[activeSuggestionIndex]);
      }
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

  return (
    <form
      onBlur={() => setShowOptions(false)}
      onFocus={() => setShowOptions(true)}
      onSubmit={handleSubmit}
      role="search"
      className={classnames(styles.form, _className)}
    >
      <div className={styles.searchbar}>
        <div className={_className}>
          {label && <label className="fr-label" htmlFor={inputId.current}>{label}</label>}
          <input
            ref={ref}
            className="fr-input"
            placeholder={placeholder}
            type="search"
            id={inputId.current}
            value={value}
            onKeyDown={handleOnKeyDown}
            {...remainingProps}
          />
          {onSearch && (
            <button
              type="submit"
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
                    {option.type && <Badge isSmall text={option.type} />}
                    <Text className={styles.content}>{option.name}</Text>
                    <Icon name="ri-arrow-right-line" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </form>
  );
});
SearchBar.defaultProps = {
  size: 'md',
  placeholder: '',
  value: '',
  className: '',
  label: '',
  options: [],
  onSearch: null,
};
SearchBar.propTypes = {
  label: PropTypes.string,
  buttonLabel: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onSearch: PropTypes.func,
  size: PropTypes.oneOf(['md', 'lg']),
  value: PropTypes.string,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
  options: PropTypes.arrayOf(PropTypes.string),
  onSelect: PropTypes.func.isRequired,
};

export default SearchBar;
