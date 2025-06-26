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

  getUsers: async () => {
    set({ isUsersLoading: true });
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to view users.");
      set({ isUsersLoading: false });
      return;
    }
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      handleAuthError(error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

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

  sendMessage: async ({ userId, text, image }) => {
    const { selectedUser, messages } = get();
    const token = localStorage.getItem("token");
    const targetUserId = userId || (selectedUser && selectedUser._id);
    const authUser = useAuthStore.getState().authUser;
    
    if (!token) {
      toast.error("You must be logged in to send messages.");
      return;
    }
    if (!targetUserId) {
      toast.error("No user selected to send message");
      return;
    }

    try {
      // Create temporary message
      const tempId = Date.now().toString();
      const tempMessage = {
        _id: tempId,
        senderId: authUser.id,
        receiverId: targetUserId,
        text,
        image,
        createdAt: new Date().toISOString(),
        temp: true
      };
      
      // Optimistic update
      set({ messages: [...messages, tempMessage] });

      // Send to server
      const res = await axiosInstance.post(`/messages/send/${targetUserId}`, { text, image });
      const serverMessage = res.data;

      // Replace temp message with server message
      set(state => ({
        messages: state.messages.map(msg => 
          msg._id === tempId ? serverMessage : msg
        )
      }));

      // Emit via socket
      const { socket } = useAuthStore.getState();
      if (socket) {
        socket.emit("sendMessage", serverMessage);
      }

    } catch (error) {
      handleAuthError(error);
      // Remove temp message on error
      set(state => ({
        messages: state.messages.filter(msg => msg._id !== tempId)
      }));
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      const { selectedUser, messages } = get();
      
      if (selectedUser && 
          (newMessage.senderId === selectedUser._id || 
           newMessage.receiverId === selectedUser._id)) {
        set({ messages: [...messages, newMessage] });
      }
      
      set(state => ({
        users: state.users.map(user => 
          user._id === newMessage.senderId || user._id === newMessage.receiverId
            ? { ...user, lastMessage: newMessage }
            : user
        )
      }));
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




















// import { create } from "zustand";
// import toast from "react-hot-toast";
// import { axiosInstance } from "../lib/axios";
// import { useAuthStore } from "./useAuthStore";

// export const useChatStore = create((set, get) => ({
//   messages: [],
//   users: [],
//   selectedUser: null,
//   isUsersLoading: false,
//   isMessagesLoading: false,

//   getUsers: async () => {
//     set({ isUsersLoading: true });
//     try {
//       const res = await axiosInstance.get("/messages/users");
//       set({ users: res.data });
//     } catch (error) {
//       toast.error(error.response.data.message);
//     } finally {
//       set({ isUsersLoading: false });
//     }
//   },

//   getMessages: async (userId) => {
//     set({ isMessagesLoading: true });
//     try {
//       const res = await axiosInstance.get(`/messages/${userId}`);
//       set({ messages: res.data });
//     } catch (error) {
//       toast.error(error.response.data.message);
//     } finally {
//       set({ isMessagesLoading: false });
//     }
//   },
//   sendMessage: async (messageData) => {
//     const { selectedUser, messages } = get();
//     try {
//       const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
//       set({ messages: [...messages, res.data] });
//     } catch (error) {
//       toast.error(error.response.data.message);
//     }
//   },

//   subscribeToMessages: () => {
//     const { selectedUser } = get();
//     if (!selectedUser) return;

//     const socket = useAuthStore.getState().socket;

//     socket.on("newMessage", (newMessage) => {
//       const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
//       if (!isMessageSentFromSelectedUser) return;

//       set({
//         messages: [...get().messages, newMessage],
//       });
//     });
//   },

//   unsubscribeFromMessages: () => {
//     const socket = useAuthStore.getState().socket;
//     socket.off("newMessage");
//   },

//   setSelectedUser: (selectedUser) => set({ selectedUser }),
// }));
