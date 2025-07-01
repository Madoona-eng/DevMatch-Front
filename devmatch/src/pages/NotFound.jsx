import React from 'react';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #c7d2fe 100%)',
      padding: '2rem'
    }}>
      <img
        src="https://raw.githubusercontent.com/abanoub1234/kkkk/refs/heads/main/new.png"
        alt="DevMatch Logo"
        style={{ height: 60, marginBottom: 24 }}
      />
     
      <h2 style={{
        fontSize: '2rem',
        fontWeight: 700,
        color: '#1e293b',
        marginBottom: 16
      }}>
        This URL was not found
      </h2>
      <p style={{
        color: '#64748b',
        fontSize: '1.15rem',
        maxWidth: 400,
        textAlign: 'center',
        marginBottom: 32
      }}>
        Oops! The page you are looking for doesn't exist or has been moved.<br />
        Please check the URL or return to the homepage.
      </p>
      <a
        href="/"
        style={{
          display: 'inline-block',
          padding: '0.75rem 2rem',
          background: 'linear-gradient(90deg, #2563eb 0%, #6366f1 100%)',
          color: '#fff',
          borderRadius: '0.75rem',
          fontWeight: 600,
          fontSize: '1.1rem',
          textDecoration: 'none',
          boxShadow: '0 2px 8px 0 rgba(99,102,241,0.10)',
          transition: 'background 0.2s, box-shadow 0.2s'
        }}
      >
        Go to Home
      </a>
    </div>
  );
}