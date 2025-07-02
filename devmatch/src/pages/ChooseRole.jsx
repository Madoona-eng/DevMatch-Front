import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ChooseRole() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, userId } = location.state || {};

  const [role, setRole] = useState(null);
  const [cvUrl, setCvUrl] = useState('');

  const handleChoose = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleContinue = async () => {
    const user = JSON.parse(localStorage.getItem('devmatch_user')) || {};
    const currentToken = localStorage.getItem('token') || token;

    if (role === 'programmer') {
      if (!cvUrl) {
        toast.error('Please enter your CV URL.');
        return;
      }
      try {
        new URL(cvUrl); // Validate URL format
      } catch (error) {
        toast.error('Invalid CV URL.');
        return;
      }
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({
          userId: user._id || user.id || userId,
          role,
          ...(role === 'programmer' && { cv_url: cvUrl })
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        if (data.user) {
          localStorage.setItem('devmatch_user', JSON.stringify(data.user));
        }

        if (role === 'programmer') {
          navigate('/completefreelancerprofile');
        } else {
          navigate('/complete-profile');
        }
      } else {
        toast.error(data.message || 'Failed to update role');
      }
    } catch (err) {
      toast.error('Error updating role. Please try again.');
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

        <button className={`btn ${role === 'programmer' ? 'btn-primary' : 'btn-outline-primary'} w-100 py-3 mb-3`} onClick={() => handleChoose('programmer')}>
          <i className="bi bi-laptop me-2"></i> I am a Programmer
        </button>
        <button className={`btn ${role === 'recruiter' ? 'btn-primary' : 'btn-outline-primary'} w-100 py-3`} onClick={() => handleChoose('recruiter')}>
          <i className="bi bi-person-badge me-2"></i> I am a Recruiter
        </button>

        {role === 'programmer' && (
          <div className="mt-3">
            <label htmlFor="cvUrl">Enter your CV URL (Google Drive, etc.)</label>
            <input
              type="url"
              className="form-control mt-1"
              id="cvUrl"
              placeholder="https://your-cv-link.com"
              value={cvUrl}
              onChange={(e) => setCvUrl(e.target.value)}
              required
            />
          </div>
        )}

        {role && (
          <button className="btn btn-success mt-4 w-100" onClick={handleContinue}>
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
