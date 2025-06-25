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


axiosInstance.interceptors.response.use(
  response => {
    console.log('API Response:', response.config.url, response.data);
    return response;
  },
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const fetchMessages = () => 
  axiosInstance.get(`/messagesbroadcast/getallmassagesbroadcast`);

export const createMessage = (text) => 
  axiosInstance.post('/messagesbroadcast/creatmassagebroadcast', { text });

export const updateMessage = (id, text) => 
  axiosInstance.put(`/messagesbroadcast/updatemassagebroadcast/${id}`, { text });

export const deleteMessage = (id) => 
  axiosInstance.delete(`/messagesbroadcast/deletemassagebroadcast/${id}`);

export const createComment = (messageId, text) => 
  axiosInstance.post(`/comments/${messageId}`, { text });

export const updateComment = (commentId, text) => 
  axiosInstance.put(`/comments/${commentId}`, { text });

export const deleteComment = (commentId) => 
  axiosInstance.delete(`/comments/${commentId}`);

export const fetchUsers = (page = 1, limit = 10) => 
  axiosInstance.get(`/users?page=${page}&limit=${limit}`);