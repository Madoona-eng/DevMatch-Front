import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faBell } from '@fortawesome/free-solid-svg-icons';
import { useNotification } from '../pages/NotificationContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/AuthContext';

export default function Navbar({ rightElement, lang = 'en' }) {
  const { user, logout, isAuthenticated, isRecruiter, isProgrammer } = useAuth();
  const { notifications } = useNotification();
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

  const handleBellClick = () => setShowNotifications((prev) => !prev);

  const navTranslations = {
    en: {
      // brand: 'DevMatch',cd
      jobs: 'Jobs',
      portfolios: 'Portfolios',
      community: 'Community',
      freelancers: 'Freelancers',
      dashboard: 'Dashboard',
      welcome: 'Welcome',
      logout: 'Logout',
      login: 'Login',
      signup: 'Sign Up',
      notifications: 'Notifications',
      noNotifications: 'No new notifications',
    },
    ar: {
      // brand: 'ديف ماتش',
      jobs: 'الوظائف',
      portfolios: 'الأعمال',
      community: 'المجتمع',
      freelancers: 'المستقلون',
      dashboard: 'لوحة التحكم',
      welcome: 'مرحباً',
      logout: 'تسجيل الخروج',
      login: 'تسجيل الدخول',
      signup: 'إنشاء حساب',
      notifications: 'الإشعارات',
      noNotifications: 'لا توجد إشعارات جديدة',
    }
  };
  const t = navTranslations[lang] || navTranslations.en;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-3" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container-fluid d-flex flex-wrap align-items-center justify-content-between"
           style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>

        {/* الشعار والروابط */}
        <div className={`d-flex align-items-center ${lang === 'ar' ? 'order-2' : 'order-1'}`}>
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2 me-2">
            <img
              src="https://raw.githubusercontent.com/abanoub1234/kkkk/refs/heads/main/new.png"
              alt="DevMatch Logo"
              style={{ height: '30px' }}
            />
            {lang === 'en' && <span>{t.brand}</span>}
          </Link>

          <ul className="navbar-nav d-flex align-items-center gap-3 m-0 p-0">
            <li className="nav-item">
              <Link to="/jobs" className="nav-link">{t.jobs}</Link>
            </li>
            <li className="nav-item"><a className="nav-link" href="#">{t.portfolios}</a></li>
            <li className="nav-item"><a className="nav-link" href="/chat">{t.community}</a></li>
            <li className="nav-item">
              <a className="nav-link" href="/privatechats">
                <FontAwesomeIcon icon={faComments} style={{ color: 'blue', marginRight: '5px' }} />
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/Freelancers">{t.freelancers}</a>
            </li>
          </ul>
        </div>

        {/* عناصر التحكم + الإشعارات */}
        <div className={`d-flex align-items-center ${lang === 'ar' ? 'order-1' : 'order-2'}`} style={{ gap: '8px', padding: 0, margin: 0 }}>
          {isAuthenticated && isProgrammer && (
            <div className="position-relative">
              <button
                className="btn btn-link position-relative p-0 m-0"
                style={{ fontSize: '1.5rem' }}
                onClick={handleBellClick}
              >
                <FontAwesomeIcon icon={faBell} />
                {notifications.length > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: '0.7rem' }}
                  >
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div
                  className={`card shadow border-0 position-absolute mt-2 ${lang === 'ar' ? 'start-0' : 'end-0'}`}
                  style={{ minWidth: 300, zIndex: 1000 }}
                >
                  <div className="card-body p-2" style={{ maxHeight: 350, overflowY: 'auto' }}>
                    <h6 className="card-title mb-2">{t.notifications}</h6>
                    {notifications.length === 0 ? (
                      <div className="text-center text-muted">{t.noNotifications}</div>
                    ) : (
                      notifications.map((notif, idx) => (
                        <div key={idx} className="alert alert-info py-2 px-3 mb-2">
                          <div style={{ fontSize: '0.95rem' }}>
                            {notif.message || notif.text || t.notifications}
                          </div>
                          <div className="text-muted small mt-1">
                            {notif.time ? new Date(notif.time).toLocaleString(lang === 'ar' ? 'ar-EG' : undefined) : ''}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* زر اللغة */}
          <div>{rightElement}</div>

          {/* الداشبورد للمجندين */}
          {isAuthenticated && isRecruiter && (
            <Link to="/recruiter-dashboard" className="btn btn-outline-primary p-1">
              <i className="bi bi-speedometer2 me-1"></i>
              {t.dashboard}
            </Link>
          )}

          {/* تسجيل دخول / تسجيل خروج */}
          {isAuthenticated ? (
            <>
              <span className="text-muted">
                {t.welcome}, <strong>{user.name}</strong>
              </span>
              <button onClick={handleLogout} className="btn btn-outline-danger p-1">
                <i className="bi bi-box-arrow-right me-1"></i>
                {t.logout}
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="btn btn-outline-primary p-1">{t.login}</button>
              </Link>
              <Link to="/register">
                <button className="btn btn-primary p-1">{t.signup}</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
