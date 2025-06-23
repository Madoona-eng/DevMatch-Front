import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import { useAuth } from './AuthContext';

export default function JobApplication() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [application, setApplication] = useState({
    cover_letter: '',
    cv_url: ''
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const res = await axiosInstance.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error('Error fetching job:', err);
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplication(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to apply');
      return;
    }

    if (user.role === 'recruiter') {
      setError('Recruiters cannot apply for jobs');
      return;
    }

    if (!application.cv_url.trim()) {
      setError('Please enter your CV URL');
      return;
    }

    try {
      await axiosInstance.post('/applications/', {
        job_id: id,
        cover_letter: application.cover_letter,
        cv_url: application.cv_url
      });
      
      setSuccess(true);
      setTimeout(() => navigate('/jobs'), 2000);
    } catch (err) {
      console.error('Application error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to submit application. Please try again.'
      );
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error && !success) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">{error}</div>
        <Link to={`/jobs/${id}`} className="btn btn-primary mt-3">
          Back to Job Details
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow">
              <div className="card-header bg-success text-white py-3">
                <h1 className="h4 mb-0">Application Submitted</h1>
              </div>
              <div className="card-body text-center py-5">
                <i className="bi bi-check-circle-fill text-success display-4 mb-4"></i>
                <h3 className="mb-3">Thank You for Your Application!</h3>
                <p className="text-muted mb-4">
                  Your application for {job?.title} has been submitted successfully.
                  The recruiter will review your application and contact you if you're selected.
                </p>
                <Link to="/jobs" className="btn btn-primary px-4">
                  <i className="bi bi-briefcase me-2"></i>Browse More Jobs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow">
            <div className="card-header bg-primary text-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h1 className="h4 mb-0">Apply for {job?.title}</h1>
                <Link to={`/jobs/${id}`} className="btn btn-outline-light btn-sm">
                  <i className="bi bi-arrow-left me-1"></i>Back
                </Link>
              </div>
            </div>
            
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <h5 className="text-primary mb-3">Cover Letter</h5>
                  <div className="form-floating">
                    <textarea
                      className="form-control"
                      id="cover_letter"
                      name="cover_letter"
                      value={application.cover_letter}
                      onChange={handleChange}
                      placeholder="Write your cover letter here"
                      style={{ height: '200px' }}
                      required
                    />
                    <label htmlFor="cover_letter">Why are you a good fit for this position?</label>
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="text-primary mb-3">CV/Resume (URL)</h5>
                  <div className="mb-3">
                    <input
                      type="url"
                      className="form-control"
                      id="cv_url"
                      name="cv_url"
                      value={application.cv_url}
                      onChange={handleChange}
                      placeholder="https://your-cv-link.com"
                      required
                    />
                    <div className="form-text">
                      Please provide a public URL to your CV (Google Drive, Dropbox, etc.)
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between border-top pt-4">
                  <Link to={`/jobs/${id}`} className="btn btn-outline-primary">
                    <i className="bi bi-arrow-left me-2"></i>Cancel
                  </Link>
                  <button 
                    type="submit" 
                    className="btn btn-primary px-4"
                  >
                    <i className="bi bi-send me-2"></i>Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}