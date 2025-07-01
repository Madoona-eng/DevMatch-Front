import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { showErrorToast, showSuccessToast } from '../lib/toast';
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
  const [fieldErrors, setFieldErrors] = useState({});
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

  useEffect(() => {
    if (success) {
      showSuccessToast('Application submitted successfully!');
    }
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccess(false);
    const errors = {};

    if (!coverLetter.trim()) {
      errors.coverLetter = 'Cover letter is required.';
    }

    if (!cvUrl.trim()) {
      errors.cvUrl = 'CV URL is required.';
    } else {
      try {
        new URL(cvUrl); // Validate URL manually
      } catch {
        errors.cvUrl = 'Please enter a valid URL.';
      }
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await axiosInstance.post('/applications/', {
        job_id: id,
        cover_letter: coverLetter,
        cv_url: cvUrl
      });
      setSuccess(true);
      setCoverLetter('');
      setCvUrl('');
      setFieldErrors({});
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
    showErrorToast(error);
    return (
      <>
        <Navbar />
        <div className="container py-5 text-center">
          <ToastContainer />
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
        <ToastContainer />
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow">
              <div className="card-header bg-primary text-white py-3">
                <h1 className="h4 mb-0">Apply for: {job.title}</h1>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label className="form-label">Cover Letter <span className="text-danger">*</span></label>
                    <textarea
                      className={`form-control${fieldErrors.coverLetter ? ' is-invalid' : ''}`}
                      value={coverLetter}
                      onChange={e => setCoverLetter(e.target.value)}
                      onBlur={() => {
                        if (!coverLetter.trim()) {
                          setFieldErrors(prev => ({ ...prev, coverLetter: 'Cover letter is required.' }));
                        } else {
                          setFieldErrors(prev => { const { coverLetter, ...rest } = prev; return rest; });
                        }
                      }}
                      rows="5"
                    />
                    {fieldErrors.coverLetter && (
                      <div className="text-danger small mt-1">{fieldErrors.coverLetter}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">CV URL <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className={`form-control${fieldErrors.cvUrl ? ' is-invalid' : ''}`}
                      value={cvUrl}
                      onChange={e => setCvUrl(e.target.value)}
                      onBlur={() => {
                        if (!cvUrl.trim()) {
                          setFieldErrors(prev => ({ ...prev, cvUrl: 'CV URL is required.' }));
                        } else {
                          setFieldErrors(prev => { const { cvUrl, ...rest } = prev; return rest; });
                        }
                      }}
                      placeholder="https://your-cv-link.com"
                    />
                    {fieldErrors.cvUrl && (
                      <div className="text-danger small mt-1">{fieldErrors.cvUrl}</div>
                    )}
                  </div>

                  {submitError && (
                    <div className="text-danger mb-3">{submitError}</div>
                  )}

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

