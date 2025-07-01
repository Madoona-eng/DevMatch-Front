import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import Navbar from '../components/Navbar';
import { useAuthStore } from '../store/useAuthStore';
import { Briefcase, MapPin, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

export default function JobsPage() {
  const { authUser } = useAuthStore();
  const isRecruiter = authUser?.role === 'recruiter';

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

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
      setCurrentPage(1); // reset to first page on search
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
    fetchJobs({ title, location });
  };

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

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
          <div className="alert alert-danger text-center">{error}</div>
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
          <>
            <div className="row g-4 mb-4">
              {currentJobs.map(job => (
                <div key={job._id || job.id} className="col-lg-6">
                  <div className="jobs-card h-100">
                    <div className="card-body">
                      <h5 className="jobs-card-title d-flex align-items-center gap-2">
                        <Briefcase size={20} className="text-primary" />
                        {job.title}
                      </h5>
                      <p className="card-text text-muted mb-2 d-flex align-items-center gap-2">
                        <FileText size={16} className="text-secondary" />
                        {job.specialization} &nbsp;|&nbsp;
                        <MapPin size={16} className="text-secondary" />
                        {job.governorate}
                      </p>
                      <p className="card-text">{job.description?.substring(0, 120)}...</p>
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <span className={`jobs-card-badge ${job.status === 'open' ? 'bg-success text-white' : 'bg-secondary text-white'}`}>{job.status}</span>
                        <Link to={`/jobs/${job._id || job.id}`} className="btn btn-outline-primary btn-sm">
                          <Briefcase size={16} className="me-1" /> View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="jobs-pagination">
                <button
                  className="jobs-pagination-btn"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`jobs-pagination-btn${currentPage === i + 1 ? ' active' : ''}`}
                    onClick={() => paginate(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="jobs-pagination-btn"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={18} />
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </>
  );
}
