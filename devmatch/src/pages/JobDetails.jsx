import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/jobs/${id}`)
      .then(res => {
        setJob(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load job details');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">{error}</div>
        <Link to="/jobs" className="btn btn-primary mt-3">
          Back to Jobs
        </Link>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container py-5 text-center">
        <h4 className="text-muted">Job not found</h4>
        <Link to="/jobs" className="btn btn-primary mt-3">
          Back to Jobs
        </Link>
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
                <h1 className="h4 mb-0">{job.title}</h1>
                <span className={`badge ${job.status === 'open' ? 'bg-success' : 'bg-secondary'} rounded-pill`}>
                  {job.status.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="card-body">
              <div className="mb-4">
                <h5 className="text-primary mb-3">Job Description</h5>
                <div className="bg-light p-4 rounded">
                  <p className="mb-0">{job.description}</p>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <h5 className="text-primary">Posted Date</h5>
                  <p className="text-muted">
                    <i className="bi bi-calendar me-2"></i>
                    {new Date(job.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="col-md-6">
                  <h5 className="text-primary">Posted Time</h5>
                  <p className="text-muted">
                    <i className="bi bi-clock me-2"></i>
                    {new Date(job.created_at).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <div className="d-flex justify-content-between border-top pt-4">
                <Link to="/jobs" className="btn btn-outline-primary">
                  <i className="bi bi-arrow-left me-2"></i>Back to Jobs
                </Link>
                <button className="btn btn-primary px-4">
                  <i className="bi bi-send me-2"></i>Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}