import { useState,
  createContext,
  useContext,
  useMemo,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import api from '../utils/api';

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [viewer, setViewer] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchUser = async () => {
      const { data } = await api.get('/me').catch(() => setIsLoading(false));
      setViewer(data || {});
      setIsLoading(false);
    };
    if (!localStorage.getItem('__paysage_access__')) setIsLoading(false); else fetchUser();
  }, []);

  const requestSignInEmail = async ({ email, password }) => {
    const url = `${process.env.REACT_APP_API_URL}/signin`;
    const body = JSON.stringify({ email, password });
    const headers = { 'X-Paysage-OTP-Method': 'email', 'Content-Type': 'application/json' };
    const response = await fetch(url, { method: 'POST', body, headers })
      .catch(() => { console.log('Erreur inattendue'); });
    return response.json();
  };

  const requestPasswordChangeEmail = async ({ email }) => {
    const url = `${process.env.REACT_APP_API_URL}/recovery/password`;
    const body = JSON.stringify({ email });
    const headers = { 'X-Paysage-OTP-Method': 'email', 'Content-Type': 'application/json' };
    const response = await fetch(url, { method: 'POST', body, headers })
      .catch(() => { console.log('Erreur inattendue'); });
    return response.json();
  };

  const changePassword = async ({ email, password, otp }) => {
    console.log('changePassword');
    const url = `${process.env.REACT_APP_API_URL}/recovery/password`;
    const body = JSON.stringify({ email, password });
    const headers = { 'X-Paysage-OTP': otp, 'Content-Type': 'application/json' };
    const response = await fetch(url, { method: 'POST', body, headers })
      .catch(() => { console.log('Erreur inattendue'); });
    return response.json();
  };

  const signin = async ({ email, password, otp }) => {
    const url = `${process.env.REACT_APP_API_URL}/signin`;
    const body = JSON.stringify({ email, password });
    const headers = { 'X-Paysage-OTP': otp, 'Content-Type': 'application/json' };
    const response = await fetch(url, { method: 'POST', body, headers })
      .catch(() => { console.log('Erreur inattendue'); });
    if (response.ok) {
      const data = await response.json()
        .catch(() => { console.log('Erreur inattendue'); });
      const { accessToken, refreshToken } = data;
      localStorage.setItem('__paysage_access__', accessToken);
      localStorage.setItem('__paysage_refresh__', refreshToken);
      const { data: user } = await api.get('/me');
      setViewer(user || {});
    }
    return response;
  };

  const signup = async ({
    email, password, firstName, lastName,
  }) => {
    const url = `${process.env.REACT_APP_API_URL}/signup`;
    const body = JSON.stringify({
      email, password, firstName, lastName,
    });
    const response = await fetch(url, { method: 'POST', body, headers: { 'Content-Type': 'application/json' } })
      .catch(() => { console.log('Erreur inattendue'); });
    const data = await response.json().catch(() => { console.log('Erreur inattendue'); });
    response.data = data;
    return response;
  };

  const signout = () => {
    localStorage.removeItem('__paysage_access__');
    localStorage.removeItem('__paysage_refresh__');
    setViewer({});
  };

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
  }), [viewer, isLoading]);
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
