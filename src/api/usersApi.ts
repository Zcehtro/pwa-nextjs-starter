import axios from 'axios';

const usersApi = axios.create({
  baseURL: 'http://localhost:4000',
  // baseURL: 'https://my-fake-json-server.herokuapp.com',
});

export default usersApi;
