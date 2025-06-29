import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons'; // chat icon
import { useNotification } from '../pages/NotificationContext';
import { faBell } from '@fortawesome/free-solid-svg-icons'; // notification icon

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated, isRecruiter, isProgrammer } = useAuth();
  const { notifications, unreadCount, markAllAsRead } = useNotification();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = React.useState(false);

  const handleLogout = () => {
    logout();
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login', { replace: true });
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', function blockBack() {
      window.history.pushState(null, '', window.location.href);
    });
  };

  const handleBellClick = () => {
    setShowNotifications((prev) => !prev);
    if (!showNotifications) markAllAsRead();
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
         
<li className="nav-item"><a className="nav-link" href="/chat">Community</a></li>
<li className="nav-item">
  <a 
    className="nav-link d-flex align-items-center gap-2" 
    href="/privatechats"
    style={{
      padding: '8px 12px',
      fontWeight: '500'
    }}
  >
    <FontAwesomeIcon 
      icon={faComments} 
      style={{ 
        color: '#1a73e8',
        fontSize: '1.1rem',
        transition: 'all 0.2s ease'
      }} 
    />
    <span 
      style={{
        color: '#1a73e8',
        fontWeight: '600',
        letterSpacing: '0.5px'
      }}
    >
      Chatty
    </span>
  </a>
</li>

<li className="nav-item">
  <a className="nav-link" href="/Freelancers">Freelancers</a>
</li>
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
      {/* إشعار الجرس للمبرمج فقط */}
      {isAuthenticated && isProgrammer && (
        <div className="position-relative me-3">
          <button
            className="btn btn-link position-relative"
            style={{ fontSize: '1.5rem' }}
            onClick={handleBellClick}
          >
            <FontAwesomeIcon icon={faBell} />
            {unreadCount > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: '0.7rem' }}
              >
                {unreadCount}
              </span>
            )}
          </button>
          {/* قائمة الإشعارات */}
          {showNotifications && (
            <div
              className="card shadow border-0 position-absolute end-0 mt-2"
              style={{ minWidth: 300, zIndex: 1000 }}
            >
              <div className="card-body p-2" style={{ maxHeight: 350, overflowY: 'auto' }}>
                <h6 className="card-title mb-2">الإشعارات</h6>
                {notifications.length === 0 ? (
                  <div className="text-center text-muted">لا توجد إشعارات جديدة</div>
                ) : (
                  notifications.map((notif, idx) => (
                    <div key={idx} className="alert alert-info py-2 px-3 mb-2">
                      <div style={{ fontSize: '0.95rem' }}>
                        {notif.message || notif.text || 'لديك إشعار جديد'}
                      </div>
                      <div className="text-muted small mt-1">
                        {notif.time ? new Date(notif.time).toLocaleString() : ''}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}