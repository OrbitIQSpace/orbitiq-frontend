import axios from 'axios';

axios.defaults.baseURL = 'https://orbitiq-backend-v72n.onrender.com';

if (import.meta.env.DEV) {
  axios.defaults.baseURL = 'http://localhost:3000';
}
export default axios;