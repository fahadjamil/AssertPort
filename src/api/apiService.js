import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://credit-port-backend.vercel.app/v1/admin/', // Replace with your actual base URL
  timeout: 10000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;