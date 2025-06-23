import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import Navbar from '../components/Navbar';
import { useAuthStore } from '../store/useAuthStore';

export default function JobApply() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [cvUrl, setCvUrl] = useState('');
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axiosInstance.get(`/jobs/${id}`)
      .then(res => {
        setJob(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load job details');
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccess(false);
    try {
      await axiosInstance.post('/applications/', {
        job_id: id,
        cover_letter: coverLetter,
        cv_url: cvUrl
      });
      setSuccess(true);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit application');
    }
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

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container py-5 text-center">
          <div className="alert alert-danger">{error}</div>
          <Link to="/jobs" className="btn btn-primary mt-3">
            Back to Jobs
          </Link>
        </div>
      </>
    );
  }

  if (success) {
    return (
      <>
        <Navbar />
        <div className="container py-5 text-center">
          <div className="alert alert-success">Application submitted successfully!</div>
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
                <h1 className="h4 mb-0">Apply for: {job.title}</h1>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Cover Letter</label>
                    <textarea
                      className="form-control"
                      value={coverLetter}
                      onChange={e => setCoverLetter(e.target.value)}
                      rows="5"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">CV URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={cvUrl}
                      onChange={e => setCvUrl(e.target.value)}
                      placeholder="https://your-cv-link.com"
                      required
                    />
                  </div>
                  {submitError && <div className="alert alert-danger">{submitError}</div>}
                  <div className="d-flex justify-content-between">
                    <Link to={`/jobs/${id}`} className="btn btn-outline-primary">
                      <i className="bi bi-arrow-left me-2"></i>Back to Job
                    </Link>
                    <button type="submit" className="btn btn-primary px-4">
                      <i className="bi bi-send me-2"></i>Submit Application
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
