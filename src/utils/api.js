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

async function customFetch({ method, url, body, headers, options: reqOptions }) {
  const requestUrl = `${process.env.REACT_APP_API_URL}${url}`;
  const options = {
    method: method.toUpperCase(),
    headers: setDefaultHeaders(headers),
    body,
    ...reqOptions,
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
  throw new Error(response?.status || 500);
}

export default {
  get: (url, headers, options) => customFetch({ method: 'GET', url, headers, options }),
  post: (url, body, headers, options) => customFetch({ method: 'POST', url, body, headers, options }),
  put: (url, body, headers, options) => customFetch({ method: 'PUT', url, body, headers, options }),
  patch: (url, body, headers, options) => customFetch({ method: 'PATCH', url, body, headers, options }),
  delete: (url, headers, options) => customFetch({ method: 'DELETE', url, headers, options }),
};
