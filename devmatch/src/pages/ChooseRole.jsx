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
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow" style={{ minWidth: 320 }}>
        <h4 className="mb-4 text-center">Choose your role</h4>
        <button className="btn btn-primary w-100 mb-3" onClick={() => handleChoose('programmer')}>
          I am a Programmer
        </button>
        <button className="btn btn-outline-primary w-100" onClick={() => handleChoose('recruiter')}>
          I am a Recruiter
        </button>
      </div>
    </div>
  );
}
