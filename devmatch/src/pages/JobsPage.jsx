import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import Navbar from '../components/Navbar';
import { useAuthStore } from '../store/useAuthStore';

export default function JobsPage() {
  const { authUser } = useAuthStore();
  const isRecruiter = authUser?.role === 'recruiter';

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      let url = '/jobs';
      const query = [];
      if (params.title && params.title.trim()) query.push(`title=${encodeURIComponent(params.title.trim())}`);
      if (params.location && params.location.trim()) query.push(`location=${encodeURIComponent(params.location.trim())}`);
      if (query.length > 0) url += `?${query.join('&')}`;
      const res = await axiosInstance.get(url);
      setJobs(res.data);
    } catch (err) {
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!title.trim() && !location.trim()) {
      fetchJobs();
    } else {
      fetchJobs({ title, location });
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="text-primary mb-3">Available Job Opportunities</h1>
          <p className="lead text-muted">Find your perfect career match</p>
        </div>
        <form className="row g-2 mb-4 justify-content-center" onSubmit={handleSearch}>
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by job title..."
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Location (e.g. remote, city)"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100" type="submit">
              <i className="bi bi-search me-1"></i> Search
            </button>
          </div>
        </form>
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
              <div key={job._id || job.id} className="col-lg-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-primary">{job.title}</h5>
                    <p className="card-text text-muted mb-2">{job.specialization} | {job.governorate}</p>
                    <p className="card-text">{job.description?.substring(0, 120)}...</p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className={`badge ${job.status === 'open' ? 'bg-success' : 'bg-secondary'}`}>{job.status}</span>
                      <Link to={`/jobs/${job._id || job.id}`} className="btn btn-outline-primary btn-sm">
                        View Details
                      </Link>
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