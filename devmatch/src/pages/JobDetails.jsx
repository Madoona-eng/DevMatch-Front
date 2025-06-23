import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import Navbar from '../components/Navbar';
import { useAuthStore } from '../store/useAuthStore';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const isRecruiter = authUser?.role === 'recruiter';
  const isProgrammer = authUser?.role === 'programmer';

  const [job, setJob] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!id || typeof id !== 'string' || id.length !== 24) {
          navigate('/jobs');
          return;
        }

        const jobRes = await axiosInstance.get(`/jobs/${id}`);
        setJob(jobRes.data);

        if (isProgrammer) {
          try {
            const applyRes = await axiosInstance.get(`/applications/check/${id}`);
            setHasApplied(applyRes.data?.hasApplied || false);
          } catch (err) {
            console.error('Application check error:', err);
            setHasApplied(false);
          }
        }
      } catch (err) {
        console.error('Error loading job:', err);
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, isProgrammer, navigate]);

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

                <div className="d-flex justify-content-between border-top pt-4 align-items-center">
                  <Link to="/jobs" className="btn btn-outline-primary">
                    <i className="bi bi-arrow-left me-2"></i>Back to Jobs
                  </Link>

                  <div className="d-flex align-items-center">
                    {isProgrammer && (
                      hasApplied ? (
                        <span className="text-success fw-bold">You Already Applied</span>
                      ) : (
                        <button
                          className="btn btn-primary px-4"
                          onClick={handleApplyClick}
                          disabled={job.status !== 'open'}
                        >
                          <i className="bi bi-send me-2"></i>Apply Now
                        </button>
                      )
                    )}

                    {isRecruiter && (
                      <button
                        className="btn btn-primary px-4"
                        disabled
                      >
                        <i className="bi bi-send me-2"></i>Apply Now
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
