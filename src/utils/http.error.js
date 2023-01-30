class HTTPError extends Error {
  constructor(message, response = {}) {
    super(message);
    this.statusCode = response?.status || 500;
    this.error = response?.error?.error;
    this.details = response?.error?.details;
  }
}

export default HTTPError;
