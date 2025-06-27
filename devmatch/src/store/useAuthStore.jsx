// import { create } from "zustand";
// import { axiosInstance } from "../lib/axios.jsx";
// import toast from "react-hot-toast";
// import { io } from "socket.io-client";

// const BASE_URL = process.env.NODE_ENV === "development" ? "http://localhost:5000" : "http://localhost:5000";

// export const useAuthStore = create((set, get) => ({

//   isSigningUp: false,
//   isLoggingIn: false,
//   isUpdatingProfile: false,
 
//   onlineUsers: [],
//   authUser: JSON.parse(localStorage.getItem("devmatch_user")) || null,
//   socket: null,
//   isCheckingAuth: true,


//   signup: async (data) => {
//     set({ isSigningUp: true });
//     try {
//       const res = await axiosInstance.post("/auth/signup", data);
//       const { user, token } = res.data;
//       // set({ authUser: user });
//       localStorage.setItem("token", token);
//       toast.success("Account created successfully");
//       get().connectSocket();
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Signup failed");
//     } finally {
//       set({ isSigningUp: false });
//     }
//   },

//   login: async (data) => {
//     set({ isLoggingIn: true });
//     try {
//       const res = await axiosInstance.post("/auth/login", data);
//       const { user, token } = res.data;
//       set({ authUser: user });
//       localStorage.setItem("authUser", user);
//       localStorage.setItem("token", token);
//       toast.success("Logged in successfully");
//       get().connectSocket();
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Login failed");
//     } finally {
//       set({ isLoggingIn: false });
//     }
//   },

//   logout: async () => {
//     try {
//       await axiosInstance.post("/api/auth/logout");
//       localStorage.removeItem("token");
//       set({ authUser: null });
//       toast.success("Logged out successfully");
//       get().disconnectSocket();
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Logout failed");
//     }
//   },

//   updateProfile: async (data) => {
//     set({ isUpdatingProfile: true });
//     try {
//       const res = await axiosInstance.put("/api/auth/update-profile", data);
//       set({ authUser: res.data.user });
//       toast.success("Profile updated successfully");
//     } catch (error) {
//       console.log("error in update profile:", error);
//       toast.error(error.response?.data?.message || "Update failed");
//     } finally {
//       set({ isUpdatingProfile: false });
//     }
//   },

//   connectSocket: () => {
//     const { authUser } = get();
//     if (!authUser || get().socket?.connected) return;

//     const socket = io(BASE_URL, {
//       query: {
//         userId: authUser.id,
//       },
//     });
//     socket.connect();

//     set({ socket: socket });

//     socket.on("getOnlineUsers", (userIds) => {
//       set({ onlineUsers: userIds });
//     });
//   },

//   disconnectSocket: () => {
//     if (get().socket?.connected) get().socket.disconnect();
//   },
// }));





 // signup: async (data) => {
  //   set({ isSigningUp: true });
  //   try {
  //     const res = await axiosInstance.post("/auth/signup", data);
  //     const { user, token } = res.data;
  //     localStorage.setItem("devmatch_user", JSON.stringify(user)); // ✅ fixed key
  //     localStorage.setItem("token", token);
  //     set({ authUser: user });
  //     toast.success("Account created successfully");
  //     get().connectSocket(); // connect after signup
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Signup failed");
  //   } finally {
  //     set({ isSigningUp: false });
  //   }
  // },

  // login: async (data) => {
  //   set({ isLoggingIn: true });
  //   try {
  //     const res = await axiosInstance.post("/auth/login", data);
  //     const { user, token } = res.data;
  //     localStorage.setItem("devmatch_user", JSON.stringify(user)); // ✅ fixed key
  //     localStorage.setItem("token", token);
  //     set({ authUser: user });
  //     toast.success("Logged in successfully");
  //     get().connectSocket(); // connect after login
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Login failed");
  //   } finally {
  //     set({ isLoggingIn: false });
  //   }
  // },

  // logout: async () => {
  //   try {
  //     await axiosInstance.post("/auth/logout");
  //     localStorage.removeItem("token");
  //     localStorage.removeItem("devmatch_user"); // ✅ fixed key
  //     set({ authUser: null, onlineUsers: [] });
  //     toast.success("Logged out successfully");
  //     get().disconnectSocket();
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Logout failed");
  //   }
  // },

  // connectSocket: () => {
  //   const { authUser, socket } = get();
  //   if (!authUser || socket?.connected) return;

  //   const newSocket = io(BASE_URL, {
  //     query: {
  //       userId: authUser.id, // ✅ use .id based on your storage structure
  //     },
  //     transports: ['websocket'],
  //   });

  //   newSocket.connect();
  //   set({ socket: newSocket });

  //   newSocket.on("getOnlineUsers", (userIds) => {
  //     set({ onlineUsers: userIds });
  //   });

  //   newSocket.on("disconnect", () => {
  //     set({ onlineUsers: [] });
  //   });
  // },

  // disconnectSocket: () => {
  //   const { socket } = get();
  //   if (socket?.connected) socket.disconnect();
  //   set({ socket: null });
  // },
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.jsx";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import {useChatStore} from './useChatStore.jsx'
const BASE_URL = process.env.NODE_ENV === "development"
  ? "http://localhost:5000"
  : "http://localhost:5000";

export const useAuthStore = create((set, get) => ({
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  onlineUsers: [],
  authUser: JSON.parse(localStorage.getItem("devmatch_user")) || null,
  socket: null,
  isCheckingAuth: true,

 
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      const updatedUser =authUser;
      localStorage.setItem("devmatch_user", JSON.stringify(updatedUser)); // ✅ fixed key
      set({ authUser: updatedUser });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
 connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket?.connected) return;

    const newSocket = io(BASE_URL, {
      query: {
        userId: authUser.id,
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    newSocket.connect();
    set({ socket: newSocket });

    newSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    newSocket.on("newMessage", (message) => {
      const { selectedUser } = useChatStore.getState();
      if (selectedUser && 
          (message.senderId === selectedUser._id || 
           message.receiverId === selectedUser._id)) {
        useChatStore.getState().setMessages([
          ...useChatStore.getState().messages,
          message
        ]);
      }
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) socket.disconnect();
    set({ socket: null });
  },

<<<<<<< HEAD
  fetchUserFromToken: async () => {
    // استخدم بيانات localStorage فقط
    const userStr = localStorage.getItem("devmatch_user");
    if (!userStr) {
      set({ authUser: null, isCheckingAuth: false });
      return;
    }
    set({ isCheckingAuth: true });
    try {
      const user = JSON.parse(userStr);
      set({ authUser: user });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
=======

>>>>>>> managechat
}));
