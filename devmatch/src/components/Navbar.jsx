import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../pages/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated, isRecruiter } = useAuth();

  const handleLogout = () => {
    logout();
    alert('👋 You have been logged out successfully!');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-3">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <Link to="/" className="navbar-brand">
          <img
            src="https://raw.githubusercontent.com/abanoub1234/kkkk/refs/heads/main/new.png"
            alt="DevMatch Logo"
            style={{ height: '30px' }}
          />
        </Link>

        <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/jobs" className="nav-link">Jobs</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Portfolios</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/chat">Community</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Freelancers</a>
            </li>
            {/* Show Post Job only for recruiters */}
            {isAuthenticated && isRecruiter && (
              <li className="nav-item">
                <Link
  to="/post-job"
  className="nav-link fw-semibold"
  style={{ color: '#007bff' }}
>
  <i className="bi bi-plus-circle me-1"></i>
  Post Job
</Link>

              </li>
            )}
          </ul>
          {isAuthenticated && isRecruiter && (
  <Link to="/recruiter-dashboard" className="btn btn-outline-primary ms-3">
    <i className="bi bi-speedometer2 me-1"></i>
    Dashboard
  </Link>
)}
          <div>
            {isAuthenticated ? (
              <div className="d-flex align-items-center">
                <span className="text-muted me-3">
                  Welcome, <strong>{user.name}</strong>
                </span>
                <button 
                  onClick={handleLogout}
                  className="btn btn-outline-danger"
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <button className="btn btn-outline-primary mx-1">Login</button>
                </Link>
                <Link to="/register">
                  <button className="btn btn-primary">Sign Up</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}