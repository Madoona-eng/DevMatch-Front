import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

function handleAuthError(error) {
  if (error.response?.status === 401) {
    localStorage.removeItem("token");
    const logout = useAuthStore.getState().logout;
    if (typeof logout === "function") logout();
    toast.error("Session expired. Please log in again.");
  } else {
    toast.error(error.response?.data?.message || "An error occurred");
  }
}

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // Fetch all users you can chat with (from /messages/users)
  getUsers: async () => {
    set({ isUsersLoading: true });
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to view users.");
      set({ isUsersLoading: false });
      return;
    }
    try {
      // Correct endpoint for chat-eligible users
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      handleAuthError(error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Fetch all messages with a specific user
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to view messages.");
      set({ isMessagesLoading: false });
      return;
    }
    if (!userId) {
      toast.error("No user selected for chat");
      set({ isMessagesLoading: false });
      return;
    }
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      handleAuthError(error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Send a message to a user (userId is required)
  sendMessage: async ({ userId, text, image }) => {
    const { selectedUser, messages } = get();
    const token = localStorage.getItem("token");
    const targetUserId = userId || (selectedUser && selectedUser._id);
    if (!token) {
      toast.error("You must be logged in to send messages.");
      return;
    }
    if (!targetUserId) {
      toast.error("No user selected to send message");
      return;
    }
    try {
      const res = await axiosInstance.post(`/messages/send/${targetUserId}`, { text, image });
      set({ messages: [...messages, res.data] });
    } catch (error) {
      handleAuthError(error);
    }
  },

  // Subscribe to new messages via socket (if using sockets)
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.on("newMessage", (newMessage) => {
      if (
        newMessage.senderId === selectedUser._id || newMessage.receiverId === selectedUser._id
      ) {
        set({ messages: [...get().messages, newMessage] });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
  clearMessages: () => set({ messages: [] }),
  clearUsers: () => set({ users: [] }),
}));