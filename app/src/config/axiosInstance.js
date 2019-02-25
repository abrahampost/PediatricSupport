import axios from 'axios';

const instance = axios.create({
  // ionic serve sets the node_env to development.
  // Remote has a node_env of dev or prod, so will use'/' instead
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:8080/api' : '/api',
  headers: {
    Authorization: {
      toString() {
        return `${localStorage.getItem('token')}`;
      },
    },
  },
  timeout: 1000,
});

instance.interceptors.response.use(
  res => Promise.resolve(res),
  err => Promise.reject(err.response),
);

export default instance;
