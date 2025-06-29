import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function AuthSuccess() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Debug: Log query params
    console.log('[AuthSuccess] location.search:', location.search);
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const email = params.get('email');
    console.log('[AuthSuccess] token:', token, 'email:', email);

    // جلب بيانات المستخدم من backend بعد Google login
    if (token && email) {
      fetch(`http://localhost:5000/api/auth/me?token=${token}`)
        .then(res => {
          console.log('[AuthSuccess] /api/auth/me status:', res.status);
          if (!res.ok) throw new Error('Unauthorized');
          return res.json();
        })
        .then(user => {
          console.log('[AuthSuccess] user:', user);
          // Normalize user object: ensure id is present
          if (user && user._id && !user.id) user.id = user._id;
          if (user && user.email === email) {
            localStorage.setItem('devmatch_user', JSON.stringify(user));
            localStorage.setItem('token', token);
            login(user);
            // إذا كان الدور pending أو غير موجود، انتقل لاختيار الدور
            if (user.isProfileComplete) {
              // If profile is complete, go to home
              console.log('[AuthSuccess] User profile complete, redirecting to /');
              navigate('/');
            } else if (!user.role || user.role === 'pending') {
              console.log('[AuthSuccess] User role pending, redirecting to /choose-role');
              navigate('/choose-role', { state: { token, userId: user._id || user.id } });
            } else if (user.role === 'programmer') {
              console.log('[AuthSuccess] User is programmer, redirecting to /CompleteFreelancerProfile');
              navigate('/CompleteFreelancerProfile');
            } else if (user.role === 'recruiter') {
              console.log('[AuthSuccess] User is recruiter, redirecting to /complete-profile');
              navigate('/complete-profile');
            } else {
              console.log('[AuthSuccess] User has other role, redirecting to /');
              navigate('/');
            }
          } else {
            console.log('[AuthSuccess] User email mismatch or not found, redirecting to /login');
            navigate('/login');
          }
        })
        .catch((err) => {
          console.error('[AuthSuccess] Error fetching user:', err);
          navigate('/login');
        });
    } else {
      console.log('[AuthSuccess] Missing token or email, redirecting to /login');
      navigate('/login');
    }
  }, [location, login, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <h4>Processing authentication...</h4>
      </div>
    </div>
  );
}
