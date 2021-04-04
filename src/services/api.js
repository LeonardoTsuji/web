import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("tokens");

    if (token) config.headers["Authorization"] = `Bearer ${token}`;

    return config;
  },
  function (error) {
    // const access_token = localStorage.getItem("tokens");
    localStorage.clear();
    // if (error.response.status === 401 && access_token) {
    // }
    return Promise.reject(error);
  }
);

export default api;
