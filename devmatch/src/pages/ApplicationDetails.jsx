// src/pages/ApplicationDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';

export default function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [application, setApplication] = useState(null);
  const [job, setJob] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'recruiter') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const applicationRes = await axios.get(`http://localhost:8000/applications/${id}`);
        setApplication(applicationRes.data);

        const [jobRes, candidateRes] = await Promise.all([
          axios.get(`http://localhost:8000/jobs/${applicationRes.data.job_id}`),
          axios.get(`http://localhost:8000/users/${applicationRes.data.applicant_id}`)
        ]);

        setJob(jobRes.data);
        setCandidate(candidateRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load application details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user, navigate]);

  const updateApplicationStatus = async (status) => {
    try {
      await axios.patch(
        `http://localhost:8000/applications/${id}`,
        { status }
      );
      
      setApplication(prev => ({ ...prev, status }));
      alert('Application status updated successfully!');
    } catch (err) {
      console.error('Error updating application:', err);
      setError('Failed to update application status');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-file-earmark-person me-2"></i>
          Application Details
        </h2>
        <button className="btn btn-outline-primary" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left me-1"></i>
          Back to Applications
        </button>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white">
          <h5 className="mb-0">Job Information</h5>
        </div>
        <div className="card-body">
          <h5>{job?.title}</h5>
          <p className="text-muted">{job?.description}</p>
          <div className="d-flex gap-3">
            <small className="text-muted">
              <i className="bi bi-calendar me-1"></i>
              Posted: {new Date(job?.created_at).toLocaleDateString()}
            </small>
            <small className={`badge ${
              job?.status === 'open' ? 'bg-success' : 'bg-secondary'
            }`}>
              {job?.status}
            </small>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white">
              <h5 className="mb-0">Candidate Information</h5>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-person text-muted" style={{ fontSize: '1.5rem' }}></i>
                </div>
                <div>
                  <h5 className="mb-1">{candidate?.name}</h5>
                  <p className="text-muted mb-0">{candidate?.email}</p>
                </div>
              </div>
              
              <div className="mb-3">
                <h6 className="text-muted mb-1">CV</h6>
                {application?.cv_url ? (
                  <a 
                    href={application.cv_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm"
                  >
                    <i className="bi bi-download me-1"></i>
                    Download CV
                  </a>
                ) : (
                  <p className="text-muted">No CV uploaded</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Application Status</h5>
                <span className={`badge ${
                  application?.status === 'pending' ? 'bg-warning text-dark' :
                  application?.status === 'accepted' ? 'bg-success' :
                  'bg-danger'
                }`}>
                  {application?.status}
                </span>
              </div>
            </div>
            <div className="card-body">
              <div className="d-flex gap-2 mb-3">
                <button 
                  className="btn btn-outline-success"
                  onClick={() => updateApplicationStatus('accepted')}
                  disabled={application?.status === 'accepted'}
                >
                  <i className="bi bi-check me-1"></i>
                  Accept
                </button>
                <button 
                  className="btn btn-outline-danger"
                  onClick={() => updateApplicationStatus('rejected')}
                  disabled={application?.status === 'rejected'}
                >
                  <i className="bi bi-x me-1"></i>
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white">
          <h5 className="mb-0">Cover Letter</h5>
        </div>
        <div className="card-body">
          {application?.cover_letter ? (
            <div className="bg-light p-3 rounded">
              <p style={{ whiteSpace: 'pre-wrap' }}>{application.cover_letter}</p>
            </div>
          ) : (
            <p className="text-muted">No cover letter provided</p>
          )}
        </div>
      </div>
    </div>
  );
}