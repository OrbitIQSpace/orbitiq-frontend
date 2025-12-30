import axios from 'axios';

axios.defaults.baseURL = 'https://orbitiq-backend-v72n.onrender.com';

if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'http://localhost:3000';
}
export default axios;