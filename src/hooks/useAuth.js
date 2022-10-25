import {
  useState,
  createContext,
  useContext,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import api from '../utils/api';

const AuthContext = createContext();
const unexpectedError = 'Erreur inattendue';

async function refreshToken() {
  const refresh = localStorage.getItem('__paysage_refresh__');
  if (!refresh) return false;
  const url = `${process.env.REACT_APP_API_URL}/token`;
  const body = JSON.stringify({ refreshToken: refresh });
  const headers = { 'Content-Type': 'application/json' };
  const data = await fetch(url, { method: 'POST', body, headers })
    .then((response) => response.json())
    .catch(() => false);
  if (!data || data.error) return false;
  localStorage.setItem('__paysage_access__', data.accessToken);
  localStorage.setItem('__paysage_refresh__', data.refreshToken);
  return true;
}

export function AuthContextProvider({ children }) {
  const [viewer, setViewer] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchViewer = useCallback(async () => {
    await api.get('/me')
      .then((response) => { if (response.ok) setViewer(response.data); });
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (localStorage.getItem('__paysage_refresh__')) {
      refreshToken()
        .then((result) => { if (result) fetchViewer(); else setIsLoading(false); })
        .catch(() => setIsLoading(false));
    } else { setIsLoading(false); }
    const refresher = setInterval(async () => refreshToken(), (1000 * 60 * 9));
    return () => clearInterval(refresher);
  }, [fetchViewer]);

  const requestSignInEmail = useCallback(async ({ email, password }) => {
    const url = `${process.env.REACT_APP_API_URL}/signin`;
    const body = JSON.stringify({ email, password });
    const headers = { 'X-Paysage-OTP-Method': 'email', 'Content-Type': 'application/json' };
    return fetch(url, { method: 'POST', body, headers })
      .then((response) => response.json())
      .then((data) => data)
      .catch(() => ({ error: unexpectedError }));
  }, []);

  const requestPasswordChangeEmail = useCallback(async ({ email }) => {
    const url = `${process.env.REACT_APP_API_URL}/recovery/password`;
    const body = JSON.stringify({ email });
    const headers = { 'X-Paysage-OTP-Method': 'email', 'Content-Type': 'application/json' };
    return fetch(url, { method: 'POST', body, headers })
      .then((response) => response.json())
      .then((data) => data)
      .catch(() => ({ error: unexpectedError }));
  }, []);

  const changePassword = useCallback(async ({ email, password, otp }) => {
    const url = `${process.env.REACT_APP_API_URL}/recovery/password`;
    const body = JSON.stringify({ email, password });
    const headers = { 'X-Paysage-OTP': otp, 'Content-Type': 'application/json' };
    return fetch(url, { method: 'POST', body, headers })
      .then((response) => response.json())
      .then((data) => data)
      .catch(() => ({ error: unexpectedError }));
  }, []);

  const signin = useCallback(async ({ email, password, otp }) => {
    const url = `${process.env.REACT_APP_API_URL}/signin`;
    const body = JSON.stringify({ email, password });
    const headers = { 'X-Paysage-OTP': otp, 'Content-Type': 'application/json' };
    const response = await fetch(url, { method: 'POST', body, headers })
      .catch(() => ({ error: unexpectedError }));
    if (response.ok) {
      const data = await response.json()
        .catch(() => ({ error: unexpectedError }));
      localStorage.setItem('__paysage_access__', data.accessToken);
      localStorage.setItem('__paysage_refresh__', data.refreshToken);
      const { data: user } = await api.get('/me');
      setViewer(user || {});
    }
    return response;
  }, []);

  const signup = useCallback(async ({
    email, password, firstName, lastName,
  }) => {
    const url = `${process.env.REACT_APP_API_URL}/signup`;
    const body = JSON.stringify({
      email, password, firstName, lastName,
    });
    const response = await fetch(url, { method: 'POST', body, headers: { 'Content-Type': 'application/json' } })
      .catch(() => ({ error: unexpectedError }));
    const data = await response.json().catch(() => ({ error: unexpectedError }));
    response.data = data;
    return response;
  }, []);

  const signout = useCallback(() => {
    localStorage.removeItem('__paysage_access__');
    localStorage.removeItem('__paysage_refresh__');
    setViewer({});
  }, []);

  const value = useMemo(() => ({
    isLoading,
    viewer,
    setViewer,
    signup,
    signin,
    signout,
    changePassword,
    requestSignInEmail,
    requestPasswordChangeEmail,
  }), [viewer, isLoading, signout, signin, signup, changePassword, requestPasswordChangeEmail, requestSignInEmail]);
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useAuth = () => useContext(AuthContext);
export default useAuth;
