import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import PrivateChatsLayout from "./layout/PrivateChatsLayout";

// Pages - Private Chat
import ProfilePagechat from "./pages/ProfilePagechat";
import SettingsPagechat from "./pages/SettingsPagechat";
import HomePagechat from "./pages/HomePagechat";
import SignUpPagechat from "./pages/SignUpPagechat";
import LoginPagechat from "./pages/LoginPagechat";

// Pages - Public
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Login from "./pages/Login";
import JobsPage from "./pages/JobsPage";
import JobDetails from "./pages/JobDetails";
import Freelancers from "./pages/Freelancers";
import CompleteFreelancerProfile from "./pages/ProfileCompletionForm";
import FreelancerProfile from "./pages/FreelancerProfile";
import PostJob from "./pages/PostJob";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import CompleteProfile from "./pages/CompleteProfile";
import JobApplications from "./pages/JobApplications";
import ApplicationDetails from "./pages/ApplicationDetails";
import JobApplication from "./pages/JobApplication";
import PaymentPage from "./pages/PaymentPage";

// Stores & Contexts
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from "./store/useThemeStore";
import { useAuth } from './pages/AuthContext';
import { AuthProvider } from "./pages/AuthContext";
import { NotificationProvider } from "./pages/NotificationContext";

function AppContent() {
  const { theme } = useThemeStore();
  const { user } = useAuth();
  const { connectSocket } = useAuthStore();

  useEffect(() => {
    if (user) {
      connectSocket();
    }
  }, [user]);

  return (
    <NotificationProvider>
      <div className="app-container" data-theme={theme}>
        <Routes>
          {/* Private Chat Routes */}
          <Route path="/privatechats" element={<PrivateChatsLayout />}>
            <Route index element={<Navigate to="home" />} />
            <Route path="home" element={<HomePagechat />} />
            <Route path="signup" element={<SignUpPagechat />} />
            <Route path="login" element={<LoginPagechat />} />
            <Route path="settings" element={<SettingsPagechat />} />
            <Route path="profile" element={<ProfilePagechat />} />
          </Route>

          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/jobs/:id/apply" element={<JobApplication />} />
          <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/recruiter-dashboard/jobs/:jobId/applications" element={<JobApplications />} />
          <Route path="/recruiter-dashboard/applications/:id" element={<ApplicationDetails />} />
          <Route path="/Freelancers" element={<Freelancers />} />
          <Route path="/CompleteFreelancerProfile" element={<CompleteFreelancerProfile />} />
          <Route path="/FreelancerProfile/:id" element={<FreelancerProfile />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </NotificationProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
