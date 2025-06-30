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
    const userId = user?._id || user?.id;

    if (user?.role === "programmer" && userId) {
      const newSocket = io("http://localhost:5000", {
        transports: ["websocket"],
        query: {
          userId: userId.toString(), // ✅ Send user ID to backend
        },
      });

      newSocket.on("connect", () => {
        console.debug("[Notification] Socket connected:", newSocket.id);
        newSocket.emit("join", userId.toString()); // ✅ Join your room
      });

      newSocket.on("connect_error", (err) => {
        console.error("[Notification] Socket connection error:", err);
      });

      newSocket.on("disconnect", (reason) => {
        console.warn("[Notification] Socket disconnected:", reason);
      });

      newSocket.on("reconnect", (attempt) => {
        console.info("[Notification] Socket reconnected, attempt:", attempt);
        newSocket.emit("join", userId.toString()); // ✅ re-join on reconnect
      });

      newSocket.on(`application-update-${userId}`, (data) => {
        console.debug("[Notification] Notification received:", data);
        // alert removed
        setNotifications((prev) => [data, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
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
