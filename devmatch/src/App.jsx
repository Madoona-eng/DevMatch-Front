import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import PostJob from './pages/PostJob';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CompleteProfile from './pages/CompleteProfile';
import JobApplications from './pages/JobApplications';
import ApplicationDetails from './pages/ApplicationDetails';
import Login from './pages/Login';
import JobsPage from './pages/JobsPage';
import JobApplication from './pages/JobApplication';
import JobDetails from './pages/JobDetails';
import { AuthProvider } from './pages/AuthContext';
// import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <div className="main-content">
          <Routes>
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/" element={<HomePage />} />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
