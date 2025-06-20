import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

export default function JobApplicationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const [form, setForm] = useState({
    coverLetter: '',
    cvUrl: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [jobStatus, setJobStatus] = useState('open');

  // Utility: Remove all applications for a job/applicant pair except the most recent
  function deduplicateApplicationsKeepLatest(applications, jobId, applicantId) {
    // Remove all but the latest application for this job/applicant
    let latest = null;
    applications.forEach(app => {
      if ((String(app.job_id) === String(jobId) || String(app.jobId) === String(jobId)) &&
          (String(app.applicant_id) === String(applicantId) || String(app.applicantId) === String(applicantId))) {
        if (!latest || new Date(app.applied_at || app.appliedAt) > new Date(latest.applied_at || latest.appliedAt)) {
          latest = app;
        }
      }
    });
    // Remove all for this job/applicant, then add back only the latest
    const filtered = applications.filter(app =>
      !((String(app.job_id) === String(jobId) || String(app.jobId) === String(jobId)) &&
        (String(app.applicant_id) === String(applicantId) || String(app.applicantId) === String(applicantId))));
    if (latest) filtered.push(latest);
    return filtered;
  }

  useEffect(() => {
    if (!authUser) return;
    let applications = [];
    try {
      applications = JSON.parse(localStorage.getItem('applications')) || [];
      if (!Array.isArray(applications)) applications = [];
    } catch {
      applications = [];
    }
    const applicantId = String(authUser._id || authUser.id);
    // Remove all but the latest application for this job/applicant
    applications = deduplicateApplicationsKeepLatest(applications, id, applicantId);
    localStorage.setItem('applications', JSON.stringify(applications));
    const alreadyApplied = applications.some(app =>
      (String(app.job_id) === String(id) || String(app.jobId) === String(id)) &&
      (String(app.applicant_id) === applicantId || String(app.applicantId) === applicantId)
    );
    if (alreadyApplied) {
      setHasApplied(true);
      return;
    }
    // Fallback: check db.json applications array if available in window (for mock json-server)
    try {
      const db = window.__DB__ || null;
      if (db && db.applications && authUser) {
        const alreadyApplied = db.applications.some(app => app.job_id === id && app.applicant_id === (authUser._id || authUser.id));
        if (alreadyApplied) {
          setHasApplied(true);
          return;
        }
      }
    } catch (e) { /* ignore */ }
    const checkIfApplied = async () => {
      if (!authUser) return;
      try {
        const res = await axios.get(`http://localhost:8000/applications?job_id=${id}&applicant_id=${authUser._id || authUser.id}`);
        if (res.data && res.data.length > 0) {
          setHasApplied(true);
          // Also update localStorage for future fallback
          const appliedJobs = JSON.parse(localStorage.getItem(`appliedJobs_${authUser?.email || authUser?.id}`) || '[]');
          if (!appliedJobs.includes(id)) {
            appliedJobs.push(id);
            localStorage.setItem(`appliedJobs_${authUser?.email || authUser?.id}`, JSON.stringify(appliedJobs));
          }
        } else {
          setHasApplied(false);
        }
      } catch (err) {
        // If backend is down, rely on localStorage only
      }
    };
    checkIfApplied();
  }, [id, authUser]);

  // Get job status from db.json (if available in window)
  useEffect(() => {
    if (!authUser) return;
    // Try to get job status from db.json (mock)
    try {
      const db = window.__DB__ || null;
      if (db && db.jobs) {
        const job = db.jobs.find(j => String(j.id) === String(id) || String(j.job_id) === String(id));
        if (job && job.status) setJobStatus(job.status);
      }
    } catch (e) { /* ignore */ }
  }, [id, authUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.coverLetter.trim()) newErrors.coverLetter = 'Cover letter is required';
    if (!form.cvUrl.trim()) {
      newErrors.cvUrl = 'CV URL is required';
    } else if (!/^https?:\/\//.test(form.cvUrl)) {
      newErrors.cvUrl = 'Invalid URL format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    if (!authUser) {
      alert('You must be logged in to apply.');
      setIsSubmitting(false);
      return;
    }
    let applications = [];
    try {
      applications = JSON.parse(localStorage.getItem('applications')) || [];
      if (!Array.isArray(applications)) applications = [];
    } catch {
      applications = [];
    }
    const applicantId = String(authUser._id || authUser.id);
    // Remove all but the latest application for this job/applicant
    applications = deduplicateApplicationsKeepLatest(applications, id, applicantId);
    const alreadyApplied = applications.some(app =>
      (String(app.job_id) === String(id) || String(app.jobId) === String(id)) &&
      (String(app.applicant_id) === applicantId || String(app.applicantId) === applicantId)
    );
    if (alreadyApplied) {
      setHasApplied(true);
      alert('You already applied to this job!');
      setIsSubmitting(false);
      localStorage.setItem('applications', JSON.stringify(applications));
      return;
    }
    try {
      // Double-check before submitting
      const res = await axios.get(`http://localhost:8000/applications?job_id=${id}&applicant_id=${authUser._id || authUser.id}`);
      if (res.data && res.data.length > 0) {
        setHasApplied(true);
        alert('You already applied to this job!');
        setIsSubmitting(false);
        return;
      }
      await axios.post(`http://localhost:8000/applications`, {
        job_id: id,
        applicant_id: authUser._id || authUser.id,
        cover_letter: form.coverLetter,
        cv_url: form.cvUrl,
        applied_at: new Date().toISOString(),
      });
      // Save to localStorage for frontend fallback
      if (authUser) {
        const appliedJobs = JSON.parse(localStorage.getItem(`appliedJobs_${authUser?.email || authUser?.id}`) || '[]');
        if (!appliedJobs.includes(id)) {
          appliedJobs.push(id);
          localStorage.setItem(`appliedJobs_${authUser?.email || authUser?.id}`, JSON.stringify(appliedJobs));
        }
      }
      // Save application in localStorage for offline/mock mode
      applications.push({
        job_id: String(id),
        applicant_id: applicantId,
        cover_letter: form.coverLetter,
        cv_url: form.cvUrl,
        status: 'pending',
        applied_at: new Date().toISOString(),
      });
      localStorage.setItem('applications', JSON.stringify(applications));
      setHasApplied(true);
      alert('Application submitted successfully!');
      navigate(`/jobs/${id}`);
    } catch (error) {
      // If backend is down, fallback to localStorage
      if (!appliedJobs.includes(id)) {
        appliedJobs.push(id);
        localStorage.setItem(key, JSON.stringify(appliedJobs));
      }
      setHasApplied(true);
      alert('Application submitted successfully (offline mode)!');
      navigate(`/jobs/${id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasApplied) {
    return (
      <div className="container py-5 text-center">
        <h2 className="mb-4 text-success">You have already applied to this job.</h2>
        <button className="btn btn-primary" onClick={() => navigate(`/jobs/${id}`)}>Back to Job</button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Apply for Job</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="coverLetter" className="form-label">Cover Letter</label>
          <textarea
            id="coverLetter"
            name="coverLetter"
            className={`form-control ${errors.coverLetter ? 'is-invalid' : ''}`}
            value={form.coverLetter}
            onChange={handleChange}
            rows={5}
            placeholder="Write your cover letter here"
            disabled={isSubmitting || jobStatus !== 'open' || (authUser && authUser.role === 'recruiter')}
          />
          {errors.coverLetter && <div className="invalid-feedback">{errors.coverLetter}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="cvUrl" className="form-label">CV URL</label>
          <input
            type="url"
            id="cvUrl"
            name="cvUrl"
            className={`form-control ${errors.cvUrl ? 'is-invalid' : ''}`}
            value={form.cvUrl}
            onChange={handleChange}
            placeholder="https://your-cv-link.com"
            disabled={isSubmitting || jobStatus !== 'open' || (authUser && authUser.role === 'recruiter')}
          />
          {errors.cvUrl && <div className="invalid-feedback">{errors.cvUrl}</div>}
        </div>
        <div className="d-flex justify-content-between">
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
            Back
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting || jobStatus !== 'open' || (authUser && authUser.role === 'recruiter')}>
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
}
