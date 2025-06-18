import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader } from "lucide-react";
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

// Components & Stores
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { AuthProvider } from "./pages/AuthContext";

function App() {
  const { authUser, checkAuth, isCheckingAuth, initializeMockAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    initializeMockAuth(); // Ensure mock auth data exists
    checkAuth();
  }, [checkAuth, initializeMockAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <AuthProvider>
      <div className="app-container">
        <Routes>
          {/* Private Chat Routes */}
          <Route path="/privatechats" element={<PrivateChatsLayout />}>
            <Route index element={authUser ? <Navigate to="home" /> : <Navigate to="login" />} />
            <Route path="home" element={authUser ? <HomePagechat /> : <Navigate to="login" />} />
            <Route path="signup" element={!authUser ? <SignUpPagechat /> : <Navigate to="home" />} />
            <Route path="login" element={!authUser ? <LoginPagechat /> : <Navigate to="home" />} />
            <Route path="settings" element={<SettingsPagechat />} />
            <Route path="profile" element={authUser ? <ProfilePagechat /> : <Navigate to="login" />} />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
