import { useReducer } from 'react';

const sorters = {
  string: (field) => (a, b) => a[field]?.localeCompare(b[field]),
  date: (field) => (a, b) => new Date(a[field]) - new Date(b[field]),
  number: (field) => (a, b) => a[field] - b[field],
};

export default function useSort({ field, type, ascending = true }) {
  const reducer = (state, action) => {
    if (state.field === action.field) {
      return { ...state, ascending: !state.ascending };
    }
    const fieldType = action.type || 'string';
    return { field: action.field, ascending: true, sorter: sorters[fieldType](action.field) };
  };

  const [sort, setSort] = useReducer(reducer, { field, sorter: sorters[type](field), ascending });

  return [sort, setSort];
}
