import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';

const Context = createContext();

export function EditModeContextProvider({ children }) {
  const [editMode, setEditMode] = useState(null);

  const reset = useCallback(() => {
    setEditMode(JSON.parse(localStorage.getItem('prefers-edit-mode')) || false);
  }, []);

  const toggle = useCallback(() => {
    setEditMode(!editMode);
  }, [editMode]);

  useEffect(() => {
    reset();
  }, [reset]);

  const value = useMemo(
    () => ({ editMode, reset, toggle, setEditMode }),
    [editMode, reset, toggle, setEditMode],
  );

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
