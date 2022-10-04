import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import api from '../utils/api';
import { ENUMS_LABELS_MAPPER } from '../utils/constants';

const EnumContext = createContext();

const DEFAULT_SELECT = { label: 'Séléctionnez un type', value: '' };
const getOptions = (enums, enumKey) => enums[enumKey]?.enum
  .map((item) => ({ label: ENUMS_LABELS_MAPPER[item] || item, value: item }));

export function EnumContextProvider({ children }) {
  const [enums, setEnums] = useState(null);

  useEffect(() => {
    const getEnums = () => api.get('/docs/enums')
      .then((response) => {
        const { data } = response;
        setEnums({
          weblinks: {
            structures: [DEFAULT_SELECT, ...getOptions(data, 'StructureWeblinkTypesEnum')],
            persons: [DEFAULT_SELECT, ...getOptions(data, 'PersonWeblinkTypesEnum')],
          },
          socialMedias: [DEFAULT_SELECT, ...getOptions(data, 'SocialmediaTypesEnum')],
          identifiers: {
            persons: [DEFAULT_SELECT, ...getOptions(data, 'PersonIdentifierTypesEnum')],
            structures: [DEFAULT_SELECT, ...getOptions(data, 'StructureIdentifierTypesEnum')],
          },
        });
      })
      .catch(() => { setEnums({}); });
    getEnums();
  }, []);

  return (
    <EnumContext.Provider value={enums}>
      {children}
    </EnumContext.Provider>
  );
}

EnumContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

// Hook
// ==============================
const useEnums = () => {
  const enums = useContext(EnumContext);
  return enums;
};
export default useEnums;
