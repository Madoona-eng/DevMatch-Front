import { io } from "socket.io-client";
import { createContext, useContext, useEffect, useState } from "react";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("devmatch_user"));
    console.debug("[Notification] Loaded user from localStorage:", user);
    // Support both _id and id
    const userId = user?._id || user?.id;
    if (user?.role === "programmer" && userId) {
      console.debug("[Notification] Using userId for socket:", userId);
      const newSocket = io("http://localhost:5000", {
        transports: ["websocket"],
        withCredentials: true,
      });
      newSocket.on("connect_error", (err) => {
        console.error("[Notification] Socket connection error:", err);
      });
      newSocket.on("connect", () => {
        console.debug("[Notification] Socket connected, joining room:", userId);
        newSocket.emit("join", userId.toString());
      });
      newSocket.on("disconnect", (reason) => {
        console.warn("[Notification] Socket disconnected:", reason);
      });
      newSocket.on("reconnect", (attempt) => {
        console.info("[Notification] Socket reconnected, attempt:", attempt);
      });
      newSocket.on("reconnect_attempt", (attempt) => {
        console.info("[Notification] Socket reconnect attempt:", attempt);
      });
      newSocket.on(`application-update-${userId}`, (data) => {
        console.debug("[Notification] Notification received:", data);
        setNotifications((prev) => [data, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });
      setSocket(newSocket);
      console.debug("[Notification] Socket instance set in state.");
      return () => {
        console.debug("[Notification] Cleaning up socket connection.");
        newSocket.disconnect();
      };
    } else {
      console.warn("[Notification] No valid programmer user found in localStorage.");
    }
  }, []);

  // دالة لتصفير العداد عند فتح قائمة الإشعارات
  const markAllAsRead = () => setUnreadCount(0);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
