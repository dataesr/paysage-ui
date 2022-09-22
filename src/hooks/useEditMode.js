import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

const Context = createContext();

export function EditModeContextProvider({ children }) {
  const [editMode, setEditMode] = useState(null);

  const reset = useCallback(() => {
    const prefered = localStorage.getItem('prefers-edit-mode') || false;
    if (prefered) setEditMode(prefered);
  }, []);

  const toggle = useCallback(() => {
    setEditMode(!editMode);
  }, [editMode]);

  useState(() => {
    reset();
  }, []);

  const value = useMemo(() => ({ editMode, reset, toggle }), [editMode, reset, toggle]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
}

EditModeContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

// Hook
// ==============================
const useEditMode = () => useContext(Context);
export default useEditMode;
