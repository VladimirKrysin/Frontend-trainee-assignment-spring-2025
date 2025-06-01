import axios from 'axios';
import type { Issue } from './types';

interface FetchBodyWrapper<T> {
  data: {
    data: T;
  };
}

const BASE_URL = 'http://127.0.0.1:8080/api/v1';
const api = axios.create({ baseURL: BASE_URL });

const getTasks = (): Promise<FetchBodyWrapper<Issue[]>> => {
  return api.get('/tasks');
};

export { getTasks, BASE_URL, api };
