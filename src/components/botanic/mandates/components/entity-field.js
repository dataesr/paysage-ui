import { useState } from 'react';
import PropTypes from 'prop-types';
import SearchBar from '../../../search-bar';
import Button from '../../../button';
import api from '../../../../utils/api';

export default function EntityField({ type, label, required, selected, onSelect, onUnselect, onRequestCreate }) {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const [searching, setSearching] = useState(false);

  const isPerson = type === 'persons';

  const search = async (q) => {
    setQuery(q);
    if (!q || q.length < 2) { setOptions([]); return; }
    setSearching(true);
    try {
      const { data } = await api.get(`/autocomplete?types=${type}&query=${encodeURIComponent(q)}`);
      setOptions(data?.data || []);
    } catch { setOptions([]); }
    setSearching(false);
  };

  if (selected) {
    return (
      <SearchBar
        buttonLabel="Rechercher"
        label={label}
        required={required}
        value=""
        scope={selected.name}
        onDeleteScope={onUnselect}
        onChange={() => {}}
        options={[]}
        onSelect={() => {}}
        isSearching={false}
      />
    );
  }

  return (
    <div>
      <SearchBar
        buttonLabel="Rechercher"
        label={label}
        required={required}
        placeholder={isPerson ? 'Rechercher une personne…' : 'Rechercher une structure…'}
        value={query}
        options={options}
        onChange={(e) => search(e.target.value)}
        onSelect={(item) => { onSelect(item); setQuery(''); setOptions([]); }}
        isSearching={searching}
      />
      {!searching && (
        <Button
          className="fr-mt-1w"
          size="sm"
          tertiary
          icon="ri-add-circle-line"
          iconPosition="left"
          onClick={() => onRequestCreate(query.trim())}
        >
          {isPerson ? 'Créer une personne absente de Paysage' : 'Créer une structure absente de Paysage'}
        </Button>
      )}
    </div>
  );
}

EntityField.propTypes = {
  type: PropTypes.oneOf(['persons', 'structures']).isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  selected: PropTypes.shape({ id: PropTypes.string, name: PropTypes.string }),
  onSelect: PropTypes.func.isRequired,
  onUnselect: PropTypes.func.isRequired,
  onRequestCreate: PropTypes.func.isRequired,
};
EntityField.defaultProps = { required: false, selected: null };
