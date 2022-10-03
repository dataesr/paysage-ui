const setDefaultHeaders = (requestHeaders = {}) => {
  const accessToken = localStorage.getItem('__paysage_access__');
  const { 'Content-Type': contentType, Accept, ...rest } = requestHeaders;
  const defaultHeaders = {
    Authorization: `Bearer ${accessToken}`,
  };
  if (!contentType) defaultHeaders['Content-Type'] = 'application/json';
  if (!Accept) defaultHeaders.Accept = 'application/json';
  return {
    ...defaultHeaders,
    ...rest,
  };
};

const catchInvalidToken = async () => {
  const refreshToken = localStorage.getItem('__paysage_refresh__');
  const options = {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  };
  const response = await fetch(`${process.env.REACT_APP_API_URL}/token`, options);
  if (!response.ok) return null;
  const tokens = await response.json();
  const { accessToken: access, refreshToken: refresh } = tokens;
  localStorage.setItem('__paysage_access__', access);
  localStorage.setItem('__paysage_refresh__', refresh);
  return access;
};

async function customFetch({ method, url, body, headers }) {
  const requestUrl = `${process.env.REACT_APP_API_URL}${url}`;
  const options = {
    method: method.toUpperCase(),
    headers: setDefaultHeaders(headers),
    body,
  };
  if (body && options.headers['Content-Type'] === 'application/json') {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(requestUrl, options);
  if (response.status === 204) return response;
  if (response.ok) {
    if (response.headers.get('content-type').startsWith('application/json')) {
      const json = await response.json();
      response.data = json;
    }
    return response;
  }

  if (response.status === 401) {
    const newAccessToken = await catchInvalidToken();
    if (newAccessToken) {
      options.headers.Authorization = `Bearer ${newAccessToken}`;
      const retry = await fetch(requestUrl, options);
      if (retry.ok) {
        const rjson = await retry.json();
        retry.data = rjson;
        return retry;
      }
    }
  }
  throw new Error();
}

export default {
  get: (url, headers) => customFetch({ method: 'GET', url, headers }),
  post: (url, body, headers) => customFetch({ method: 'POST', url, body, headers }),
  put: (url, body, headers) => customFetch({ method: 'PUT', url, body, headers }),
  patch: (url, body, headers) => customFetch({ method: 'PATCH', url, body, headers }),
  delete: (url, headers) => customFetch({ method: 'DELETE', url, headers }),
};
