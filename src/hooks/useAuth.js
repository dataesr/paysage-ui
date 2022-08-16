import PropTypes from 'prop-types';
import {
  createContext,
  useContext,
  useMemo,
} from 'react';
import useFetch from './useFetch';

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const { data: user } = useFetch('GET', '/me');
  const viewer = useMemo(() => user || {}, [user]);

  const requestSignInEmail = async ({ email, password }) => {
    const url = `${process.env.REACT_APP_API_URL}/signin`;
    const body = JSON.stringify({ email, password });
    const headers = { 'X-Paysage-OTP-Method': 'email', 'Content-Type': 'application/json' };
    const response = await fetch(url, { method: 'POST', body, headers })
      .catch(() => { console.log('Erreur inatendue'); });
    return response.json();
  };

  const signin = async ({ email, password, otp }) => {
    const url = `${process.env.REACT_APP_API_URL}/signin`;
    const body = JSON.stringify({ email, password });
    const headers = { 'X-Paysage-OTP': otp, 'Content-Type': 'application/json' };
    const response = await fetch(url, { method: 'POST', body, headers })
      .catch(() => { console.log('Erreur inatendue'); });
    if (response.ok) {
      const data = await response.json()
        .catch(() => { console.log('Erreur inatendue'); });
      const { accessToken, refreshToken } = data;
      localStorage.setItem('__paysage_access__', accessToken);
      localStorage.setItem('__paysage_refresh__', refreshToken);
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
      .catch(() => { console.log('Erreur inatendue'); });
    return response;
  };

  const signout = () => {
    localStorage.removeItem('__paysage_access__');
    localStorage.removeItem('__paysage_refresh__');
  };

  const value = useMemo(() => ({
    viewer, signup, signin, signout, requestSignInEmail,
  }), [viewer]);
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
