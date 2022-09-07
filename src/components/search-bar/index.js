import React, { forwardRef, useRef } from 'react';

import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import classNames from 'classnames';
import { Badge, Icon, Text } from '@dataesr/react-dsfr';
import styles from './styles.module.scss';
/**
 *
 * @visibleName SearchBar
 */
const SearchBar = forwardRef((props, ref) => {
  const {
    size,
    label,
    buttonLabel,
    placeholder,
    onSearch,
    autocompleteOptions,
    onAutocompleteSelection,
    value,
    className,
    ...remainingProps
  } = props;
  const inputId = useRef(uuidv4());
  const onInputKeyDown = (e) => (e.keyCode === 13) && onSearch(value);
  const _className = classNames('fr-search-bar', {
    'fr-search-bar--lg': (size === 'lg'),
  }, className);
  const _classNameButton = classNames('fr-btn', { 'fr-btn--lg': (size === 'lg') });
  const handleSubmit = (e, currentText) => { e.preventDefault(); onSearch(currentText); };

  return (
    <div className={styles.searchbar}>
      <form
        onSubmit={handleSubmit}
        role="search"
        className={_className}
        {...remainingProps}
      >
        {label && <label className="fr-label" htmlFor={inputId.current}>{label}</label>}
        <input
          ref={ref}
          className="fr-input"
          placeholder={placeholder}
          type="search"
          id={inputId.current}
          value={value}
          onKeyDown={onInputKeyDown}
        />
        <button
          type="submit"
          className={_classNameButton}
          title={buttonLabel}
        >
          {buttonLabel}
        </button>
      </form>
      {autocompleteOptions.length ? (
        <div className={styles.autocomplete}>
          <ul className={styles.list}>
            {autocompleteOptions.map((option) => (
              <li className={styles.item}>
                <button className={styles.btn} type="button" onClick={() => { onAutocompleteSelection(option); }}>
                  <Badge isSmall text={option.type} />
                  <Text className={styles.content}>
                    {`${option.resource.name} (${option.resource.acronym})`}
                  </Text>
                  <Icon name="ri-arrow-go-forward-line" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
});
SearchBar.defaultProps = {
  size: 'md',
  placeholder: '',
  value: '',
  className: '',
  label: '',
  autocompleteOptions: [],
};
SearchBar.propTypes = {
  label: PropTypes.string,
  buttonLabel: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  /**
   * A function that handles search action. Input value is passed as prop.
   */
  onSearch: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['md', 'lg']),
  value: PropTypes.string,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
  autocompleteOptions: PropTypes.arrayOf(PropTypes.string),
  onAutocompleteSelection: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
};

export default SearchBar;
