import { useEffect, useState } from 'react';

export default function useFetch(method, url, body, headers) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const setDefaultHeaders = (requestHeaders = {}) => {
    const accessToken = localStorage.getItem('__paysage_access__');
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...requestHeaders,
    };
  };

  const catchInvalidToken = async () => {
    const refreshToken = localStorage.getItem('__paysage_refresh__');
    const options = {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    };
    const response = await fetch(`${process.env.REACT_APP_API_URL}/token`, options)
      .catch((e) => { console.log('REFRESH TOKEN ERROR', e); });
    if (!response.ok) return null;
    const tokens = await response.json();
    const { accessToken: access, refreshToken: refresh } = tokens;
    localStorage.setItem('__paysage_access__', access);
    localStorage.setItem('__paysage_refresh__', refresh);
    return access;
  };

  useEffect(() => {
    const requestUrl = `${process.env.REACT_APP_API_URL}${url}`;
    const options = {
      method: method.toUpperCase(),
      headers: setDefaultHeaders(headers),
    };
    if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) { options.body = JSON.stringify(body); }
    const fetchData = async () => {
      const response = await fetch(requestUrl, options).catch((e) => {
        console.log('FETCH ERROR', e);
      });
      if (response.ok) {
        const json = await response.json();
        setData(json);
        setIsLoading(false);
        setError(false);
        return;
      }
      if (response.status === 401) {
        const newAccessToken = await catchInvalidToken();
        if (newAccessToken) {
          options.headers.Authorization = `Bearer ${newAccessToken}`;
          const retry = await fetch(requestUrl, options).catch((e) => {
            console.log('RETRY ERROR', e);
          });
          if (retry.ok) {
            const json = await retry.json();
            setData(json);
            setIsLoading(false);
            setError(false);
            return;
          }
        }
      }
      setIsLoading(false);
      setError(true);
    };
    setIsLoading(true);
    setError(false);
    setData(null);
    fetchData().catch((e) => {
      setIsLoading(false);
      setError(true);
      console.log(e);
    });
  }, [method, url, body, headers]);

  return { data, error, isLoading };
}
