import { useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import PrivateChatsLayout from "../src/layout/PrivateChatsLayout";
// Pages
import ProfilePagechat from "./pages/ProfilePagechat";
import SettingsPagechat from "./pages/SettingsPagechat";
import LoginPagechat from "./pages/LoginPagechat";
import SignUpPagechat from "./pages/SignUpPagechat";
import HomePagechat from "./pages/HomePagechat";

import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Login from "./pages/Login";
import JobsPage from "./pages/JobsPage";
import JobDetails from "./pages/JobDetails";

// Components & Stores
import Navbarchart from "./components/Navbarchat";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";


function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="app-container">
        <Routes  >
        
       
 <Route
        path="/privatechats"
        element={<PrivateChatsLayout />} 
      >
  <Route index element={authUser ? <Navigate to="home" /> : <Navigate to="login" />} />
  <Route path="home" element={authUser ? <HomePagechat /> : <Navigate to="login" />} />
  <Route path="signup" element={!authUser ? <SignUpPagechat /> : <Navigate to="home" />} />
  <Route path="login" element={!authUser ? <LoginPagechat /> : <Navigate to="home" />} />
  <Route path="settings" element={<SettingsPagechat />} />
  <Route path="profile" element={authUser ? <ProfilePagechat /> : <Navigate to="login" />} />
</Route>

        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetails />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
