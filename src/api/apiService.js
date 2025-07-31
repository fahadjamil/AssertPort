import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_CREDIT_PORT_BASE_URL, // Replace with your actual base URL
  timeout: 10000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;