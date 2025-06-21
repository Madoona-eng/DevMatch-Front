import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

  axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Removed the response interceptor that deletes token and redirects on 401

// Broadcast Messages
export const createBroadcastMessage = (text) => axiosInstance.post('/messagesbroadcast/creatmassagebroadcast', { text });
export const getBroadcastMessage = (id) => axiosInstance.get(`/messagesbroadcast/getmassagebroadcast/${id}`);
export const getAllBroadcastMessages = () => axiosInstance.get('/messagesbroadcast/getallmassagesbroadcast');

// Comments
export const createComment = (messageId, text) => axiosInstance.post(`/comments/${messageId}`, { text });