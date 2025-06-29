import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ChooseRole() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, userId } = location.state || {};

  const handleChoose = async (role) => {
    const user = JSON.parse(localStorage.getItem('devmatch_user')) || {};
    // Use the latest token from localStorage or state
    const currentToken = localStorage.getItem('token') || token;
    try {
      // Update role and expect new token in response
      const res = await fetch('http://localhost:5000/api/auth/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({ userId: user._id || user.id || userId, role }),
      });
      if (res.ok) {
        const data = await res.json();
        // Save new token and user if provided
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        if (data.user) {
          localStorage.setItem('devmatch_user', JSON.stringify(data.user));
        }
        // Use new token for all future requests
        if (role === 'programmer') {
          navigate('/CompleteFreelancerProfile');
        } else if (role === 'recruiter') {
          navigate('/complete-profile');
        }
      } else {
        alert('Failed to update role. Please try again.');
      }
    } catch (err) {
      alert('Error updating role. Please try again.');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)' }}>
      <div className="card shadow-lg border-0 p-5" style={{ borderRadius: 24, minWidth: 350, maxWidth: 400 }}>
        <div className="text-center mb-4">
          <img src="/logo192.png" alt="DevMatch Logo" style={{ width: 60, marginBottom: 12 }} />
          <h3 className="fw-bold mb-2" style={{ color: '#007bff' }}>Welcome to DevMatch!</h3>
          <p className="text-muted mb-0">Please choose your role to continue</p>
        </div>
        <button className="btn btn-primary w-100 py-3 mb-3 d-flex align-items-center justify-content-center fs-5" style={{ borderRadius: 12 }} onClick={() => handleChoose('programmer')}>
          <i className="bi bi-laptop me-2 fs-4"></i> I am a Programmer
        </button>
        <button className="btn btn-outline-primary w-100 py-3 d-flex align-items-center justify-content-center fs-5" style={{ borderRadius: 12 }} onClick={() => handleChoose('recruiter')}>
          <i className="bi bi-person-badge me-2 fs-4"></i> I am a Recruiter
        </button>
      </div>
    </div>
  );
}
