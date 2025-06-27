import { io } from "socket.io-client";
import { createContext, useContext, useEffect, useState } from "react";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

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
        alert(data.message);
        setNotifications((prev) => [data, ...prev]);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
