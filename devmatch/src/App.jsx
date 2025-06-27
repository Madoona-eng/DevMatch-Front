import { Routes, Route, Navigate } from "react-router-dom";
import React, { useEffect } from "react";

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
import AuthSuccess from "./pages/AuthSuccess";
import ChooseRole from "./pages/ChooseRole";
import VerifyEmailPage from "./pages/VerifyEmailPage";

// Components & Stores
import { AuthProvider } from "./pages/AuthContext";
import { useThemeStore } from "./store/useThemeStore";
import { useAuthStore } from "./store/useAuthStore";
import { NotificationProvider } from "./pages/NotificationContext";

function App() {
  const { theme } = useThemeStore();
  const fetchUserFromToken = useAuthStore((state) => state.fetchUserFromToken);

  useEffect(() => {
    fetchUserFromToken();
  }, [fetchUserFromToken]);

  return (
    <AuthProvider>
      <NotificationProvider>
        <div className="app-container">
          <Routes>
            {/* Private Chat Routes */}
            <Route path="/privatechats" element={<PrivateChatsLayout />}>
              <Route index element={<Navigate to="home" />} />
              <Route path="home" element={<HomePagechat /> } />
              <Route path="signup" element={<SignUpPagechat />} />
              <Route path="login" element={ <LoginPagechat />} />
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
            <Route path="/auth-success" element={<AuthSuccess />} />
            <Route path="/choose-role" element={<ChooseRole />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
