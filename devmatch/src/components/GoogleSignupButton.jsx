import React from 'react';

export default function GoogleSignupButton({ label = "Sign up with Google" }) {
  const handleGoogleSignup = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <button
      className="btn btn-danger w-100 mb-3"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={handleGoogleSignup}
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google logo"
        style={{ width: 22, height: 22, marginRight: 8 }}
      />
      {label}
    </button>
  );
}
