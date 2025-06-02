// src/App.js
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import Login from './pages/Login';
import JobsPage from './pages/JobsPage';
import JobDetails from './pages/JobDetails';
import Freelancers from './pages/Freelancers';
import CompleteFreelancerProfile from './pages/ProfileCompletionForm';
import FreelancerProfile from './pages/FreelancerProfile';

// import './App.css';

function App() {
  return (
    <div className="app-container">

      <div className="main-content">
        <Routes>
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/Freelancers" element={<Freelancers />} />
          <Route path="/CompleteFreelancerProfile" element={<CompleteFreelancerProfile />} />
          <Route path="/FreelancerProfile/:id" element={<FreelancerProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
