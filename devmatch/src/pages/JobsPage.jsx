import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar'; // Adjust the path if needed
import { useAuthStore } from '../store/useAuthStore';

export default function JobsPage() {
  const { authUser } = useAuthStore();
  const isRecruiter = authUser?.role === 'recruiter';

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/jobs')
      .then(res => {
        setJobs(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load jobs');
        setLoading(false);
      });
  }, []);

  return (
    <>
    <Navbar /> 
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="text-primary mb-3">Available Job Opportunities</h1>
        <p className="lead text-muted">Find your perfect career match</p>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">
          {error}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-5">
          <div className="card border-0 shadow-sm py-5">
            <h4 className="text-muted mb-3">No jobs available</h4>
            <p className="text-muted mb-4">Check back later for new opportunities</p>
            <button className="btn btn-outline-primary" onClick={() => window.location.reload()}>
              Refresh
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {jobs.map(job => (
            <div key={job.id} className="col-lg-6">
              <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h3 className="h5 card-title text-primary">{job.title}</h3>
                    <span className={`badge ${job.status === 'open' ? 'bg-success' : 'bg-secondary'} rounded-pill`}>
                      {job.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="mb-4">
                    <p className="card-text text-muted">
                      {job.description.length > 120 
                        ? `${job.description.substring(0, 120)}...` 
                        : job.description}
                    </p>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      <i className="bi bi-clock me-1"></i>
                      {new Date(job.created_at).toLocaleDateString()}
                    </small>
                    <div>
                      <Link 
                        to={`/jobs/${job.id}`} 
                        className="btn btn-sm btn-primary px-3 me-2"
                      >
                        <i className="bi bi-eye me-1"></i> View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
}