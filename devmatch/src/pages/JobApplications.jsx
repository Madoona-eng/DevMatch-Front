// src/pages/JobApplications.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import { useAuth } from './AuthContext';

export default function JobApplications() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'recruiter') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        let applicationsRes;
        let job = null;
        
        if (jobId) {
          // Fetch job details
          const jobRes = await axiosInstance.get(`/jobs/${jobId}`);
          job = jobRes.data;
          // Fetch applications for this specific job
          applicationsRes = await axiosInstance.get(`/applications/recruiter/${jobId}`);
        } else {
          // Fetch all applications for recruiter
          applicationsRes = await axiosInstance.get('/applications/recruiter');
        }
        
        setJob(job);
        
        // Filter out any applications with missing data
        const validApplications = applicationsRes.data.filter(app => 
          app && app._id && app.applicant_id && app.job_id
        );
        
        setApplications(validApplications);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to load applications. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate, jobId]);

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      const endpoint = status === 'accepted' 
        ? `/applications/accept/${applicationId}`
        : `/applications/reject/${applicationId}`;
      
      await axiosInstance.put(endpoint);
      
      setApplications(prev => prev.map(app => 
        app._id === applicationId ? { ...app, status } : app
      ));
    } catch (err) {
      console.error('Error updating application:', err);
      setError(err.response?.data?.message || 'Failed to update application status');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-people me-2"></i>
          {jobId ? `Applications for: ${job?.title || 'Job not found'}` : 'All Job Applications'}
        </h2>
        <button className="btn btn-outline-primary" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left me-1"></i>
          Back
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-people text-muted" style={{ fontSize: '3rem' }}></i>
          <h5 className="mt-3">No applications found</h5>
          <p className="text-muted">Applications will appear here when candidates apply to your jobs</p>
        </div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Job Title</th>
                    <th>Applied On</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(application => (
                    <tr key={application._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-2" 
                               style={{ width: '36px', height: '36px' }}>
                            <i className="bi bi-person text-muted"></i>
                          </div>
                          <div>
                            <div className="fw-semibold">
                              {application.applicant_id?.name || 'Candidate not found'}
                            </div>
                            {application.applicant_id?.cv_url ? (
                              <a 
                                href={application.applicant_id.cv_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-primary small"
                              >
                                View CV
                              </a>
                            ) : (
                              <small className="text-muted">No CV</small>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{application.job_id?.title || 'Job not found'}</td>
                      <td>
                        {new Date(application.applied_at).toLocaleDateString()}
                      </td>
                      <td>
                        <span className={`badge ${
                          application.status === 'pending' ? 'bg-warning text-dark' :
                          application.status === 'accepted' ? 'bg-success' :
                          'bg-danger'
                        }`}>
                          {application.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => updateApplicationStatus(application._id, 'accepted')}
                            disabled={application.status === 'accepted' || !application._id}
                          >
                            <i className="bi bi-check"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => updateApplicationStatus(application._id, 'rejected')}
                            disabled={application.status === 'rejected' || !application._id}
                          >
                            <i className="bi bi-x"></i>
                          </button>
                          {application._id && typeof application._id === 'string' && application._id.length === 24 ? (
                            <Link
                              to={`/recruiter-dashboard/applications/${application._id}`}
                              className="btn btn-sm btn-outline-primary"
                            >
                              <i className="bi bi-eye"></i>
                            </Link>
                          ) : (
                            <span className="text-muted small">Invalid ID</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}