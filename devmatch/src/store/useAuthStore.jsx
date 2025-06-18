import { create } from "zustand";
import { axiosInstance } from "../lib/axios.jsx";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = process.env.NODE_ENV === "development" ? "http://localhost:5001" : "http://localhost:5001";


export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      // Simulate backend check using localStorage or mock db.json
      let mockAuthData = null;
      try {
        mockAuthData = JSON.parse(localStorage.getItem("authUser"));
      } catch {
        mockAuthData = null;
      }
      // If no role, default to programmer
      if (mockAuthData && typeof mockAuthData === 'object') {
        if (!mockAuthData.role) mockAuthData.role = 'programmer';
        set({ authUser: mockAuthData });
        localStorage.setItem("authUser", JSON.stringify(mockAuthData));
        console.log("Authenticated using mock data.");
      } else {
        // fallback: auto-initialize mock user if missing
        mockAuthData = {
          id: 1,
          name: "Mock User",
          email: "mockuser@example.com",
          role: "programmer"
        };
        localStorage.setItem("authUser", JSON.stringify(mockAuthData));
        set({ authUser: mockAuthData });
        console.log("Mock authentication data auto-initialized and authenticated.");
      }
    } catch (error) {
      console.error("Error in checkAuth (mock):", error.message);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },

  initializeMockAuth: () => {
    const mockAuthData = {
      id: 1,
      name: "Mock User",
      email: "mockuser@example.com",
    };

    if (!localStorage.getItem("authUser")) {
      localStorage.setItem("authUser", JSON.stringify(mockAuthData));
      console.log("Mock authentication data initialized.");
    }
  },
}));
