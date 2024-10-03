import PropTypes from 'prop-types';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import Notice from '../components/notice';

const NoticeContext = createContext();

export function NoticeContextProvider({ children }) {
  const [currentNotice, setCurrentNotice] = useState(null);
  const remove = useCallback(() => { setCurrentNotice(null); }, []);
  const notice = useCallback((noticeObject) => { setCurrentNotice(noticeObject); }, []);
  const value = useMemo(() => ({ notice, remove }), [notice, remove]);

  return (
    <NoticeContext.Provider value={value}>
      { currentNotice && createPortal(
        (<div>{currentNotice && (<Notice remove={remove} {...currentNotice} />)}</div>),
        document.getElementById('notice-container'),
      )}
      {children}
    </NoticeContext.Provider>
  );
}

NoticeContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

// Hook
// ==============================
const useNotice = () => useContext(NoticeContext);
export default useNotice;
