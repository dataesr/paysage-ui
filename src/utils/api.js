const setDefaultHeaders = (requestHeaders = {}) => {
  const accessToken = localStorage.getItem('__paysage_access__');
  const { 'Content-Type': contentType, Accept, ...rest } = requestHeaders;
  const defaultHeaders = {
    Authorization: `Bearer ${accessToken}`,
  };
  if (!contentType) defaultHeaders['Content-Type'] = 'application/json';
  if (!Accept) defaultHeaders.Accept = 'application/json';
  return { ...defaultHeaders, ...rest };
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
  throw new Error();
}

export default {
  get: (url, headers) => customFetch({ method: 'GET', url, headers }),
  post: (url, body, headers) => customFetch({ method: 'POST', url, body, headers }),
  put: (url, body, headers) => customFetch({ method: 'PUT', url, body, headers }),
  patch: (url, body, headers) => customFetch({ method: 'PATCH', url, body, headers }),
  delete: (url, headers) => customFetch({ method: 'DELETE', url, headers }),
};
