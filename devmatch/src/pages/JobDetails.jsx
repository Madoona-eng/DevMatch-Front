import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import Navbar from '../components/Navbar';
import { useAuthStore } from '../store/useAuthStore';
import { useAuth } from './AuthContext';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  // Try to get user from AuthContext, fallback to devmatch_user in localStorage
  let devmatchUser = null;
  try {
    const context = useAuth ? useAuth() : null;
    devmatchUser = context?.user || null;
  } catch {
    // If useAuth is not available, fallback to localStorage
    const saved = localStorage.getItem('devmatch_user');
    if (saved) {
      try {
        devmatchUser = JSON.parse(saved);
      } catch {}
    }
  }

  // Prefer Zustand authUser, fallback to devmatchUser from AuthContext/localStorage
  const currentUser = authUser || devmatchUser;
  const isRecruiter = currentUser?.role === 'recruiter';
  const isProgrammer = currentUser?.role === 'programmer';

  const [job, setJob] = useState(null);
  const [recruiterName, setRecruiterName] = useState('');
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!id || typeof id !== 'string' || id.length !== 24) {
          navigate('/jobs');
          return;
        }

        // استخدام endpoint الجديد
        const res = await axiosInstance.get(`/jobs/with-check/${id}`);
        setJob(res.data.job);
        setHasApplied(res.data.hasApplied);
        setRecruiterName(res.data.recruiterName || 'Unknown');
      } catch (err) {
        console.error('Error loading job:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  const handleApplyClick = () => {
    navigate(`/jobs/${id}/apply`);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Navbar />
        <div className="container py-5 text-center">
          <h4 className="text-muted">Job not found</h4>
          <Link to="/jobs" className="btn btn-primary mt-3">
            Back to Jobs
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-lg recruiter-dashboard-modern">
              <div className="card-header bg-primary text-white py-4 rounded-top recruiter-dashboard-header">
                <div className="d-flex justify-content-between align-items-center">
                  <h1 className="h3 mb-0 fw-bold letter-spacing-1">{job.title}</h1>
                  <span className={`badge ${job.status === 'open' ? 'bg-success' : 'bg-secondary'} rounded-pill px-3 py-2 fs-6`}>
                    {job.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="card-body bg-white recruiter-dashboard-body rounded-bottom">
                <div className="mb-4">
                  <h5 className="text-primary mb-3 fw-semibold">Job Description</h5>
                  <div className="bg-light p-4 rounded border border-1 recruiter-dashboard-desc">
                    <p className="mb-0 fs-5 text-dark">{job.description}</p>
                  </div>
                </div>

                {/* Additional Job Details */}
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded border recruiter-dashboard-desc h-100">
                      <span className="fw-semibold text-primary">Specialization:</span>
                      <div className="fs-6 text-dark">{job.specialization}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded border recruiter-dashboard-desc h-100">
                      <span className="fw-semibold text-primary">Governorate:</span>
                      <div className="fs-6 text-dark">{job.governorate}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded border recruiter-dashboard-desc h-100">
                      <span className="fw-semibold text-primary">Recruiter:</span>
                      <div className="fs-6 text-dark">
                        {recruiterName}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded border recruiter-dashboard-desc h-100">
                      <span className="fw-semibold text-primary">Created At:</span>
                      <div className="fs-6 text-dark">{new Date(job.created_at).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded border recruiter-dashboard-desc h-100">
                      <span className="fw-semibold text-primary">Work Mode:</span>
                      <div className="fs-6 text-dark">{job.work_mode === 'onsite' ? 'Onsite' : job.work_mode === 'remotely' ? 'Remotely' : '-'}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded border recruiter-dashboard-desc h-100">
                      <span className="fw-semibold text-primary">Job Type:</span>
                      <div className="fs-6 text-dark">
                        {job.job_type === 'full-time' ? 'Full-time' : job.job_type === 'part-time' ? 'Part-time' : job.job_type === 'by task' ? 'By Task' : '-'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between border-top pt-4 align-items-center recruiter-dashboard-footer">
                  <Link to="/jobs" className="btn btn-outline-primary rounded-pill px-4 py-2 fw-semibold">
                    <i className="bi bi-arrow-left me-2"></i>Back to Jobs
                  </Link>

                  <div className="d-flex align-items-center gap-3">
                    {/* Show Apply Now button only if user is programmer, job is open, and has not applied */}
                    {isProgrammer && job.status === 'open' && !hasApplied && (
                      <button
                        className="btn btn-primary px-4 py-2 rounded-pill fw-semibold shadow-sm"
                        onClick={handleApplyClick}
                      >
                        <i className="bi bi-send me-2"></i>Apply Now
                      </button>
                    )}
                    {/* Show message if programmer already applied */}
                    {isProgrammer && hasApplied && (
                      <span className="text-success fw-bold fs-5">You Already Applied</span>
                    )}
                    {/* Show message if job is closed and user is programmer and not applied */}
                    {isProgrammer && job.status !== 'open' && !hasApplied && (
                      <span className="text-muted fs-6">Job is closed</span>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern recruiter dashboard styles */}
      <style>
      {`
      .recruiter-dashboard-modern {
        border-radius: 1.5rem;
        background: #fff;
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.10);
      }
      .recruiter-dashboard-header {
        border-radius: 1.5rem 1.5rem 0 0;
        background: linear-gradient(90deg, #0d6efd 60%, #3b82f6 100%);
      }
      .recruiter-dashboard-body {
        border-radius: 0 0 1.5rem 1.5rem;
      }
      .recruiter-dashboard-desc {
        background: #f8fafc;
        border-color: #e3e6ed !important;
      }
      .recruiter-dashboard-footer {
        border-top: 2px solid #e3e6ed !important;
        margin-top: 2rem;
      }
      .letter-spacing-1 {
        letter-spacing: 1px;
      }
      `}
      </style>
    </>
  );
}
