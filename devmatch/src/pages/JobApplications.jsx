// src/pages/JobApplications.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';

export default function JobApplications() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [freelancers, setFreelancers] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'recruiter') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch the specific job
        const jobRes = await axios.get(`http://localhost:8000/jobs/${jobId}`);
        const job = jobRes.data;
        setJob(job);

        // Fetch applications for this job
        const applicationsRes = await axios.get(`http://localhost:8000/applications?job_id=${jobId}`);
        const applications = applicationsRes.data;

        // Fetch all freelancers
        const freelancersRes = await axios.get('http://localhost:8000/users');
        const freelancers = freelancersRes.data.filter(u => u.role === 'programmer');

        // Filter applications to include only those with existing candidates
        const validApplications = applications.filter(application => 
          freelancers.some(f => f.id === application.applicant_id)
        );

        setApplications(validApplications);
        setFreelancers(freelancers);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load applications. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate, jobId]);

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      await axios.patch(
        `http://localhost:8000/applications/${applicationId}`,
        { status }
      );
      
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status } : app
      ));
    } catch (err) {
      console.error('Error updating application:', err);
      setError('Failed to update application status');
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
          Applications for: {job?.title || 'Job not found'}
        </h2>
        <button className="btn btn-outline-primary" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left me-1"></i>
          Back to Jobs
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-people text-muted" style={{ fontSize: '3rem' }}></i>
          <h5 className="mt-3">No applications for this job yet</h5>
          <p className="text-muted">Applications will appear here when candidates apply</p>
        </div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Applied On</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(application => {
                    const freelancer = freelancers.find(f => f.id === application.applicant_id);
                    return (
                      <tr key={application.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-2" 
                                 style={{ width: '36px', height: '36px' }}>
                              <i className="bi bi-person text-muted"></i>
                            </div>
                            <div>
                              <div className="fw-semibold">{freelancer ? freelancer.name : 'Candidate Deleted'}</div>
                              {freelancer && freelancer.cv_url ? (
                                <a href={freelancer.cv_url} target="_blank" rel="noopener noreferrer" className="text-primary small">View CV</a>
                              ) : (
                                <small className="text-muted">No CV</small>
                              )}
                            </div>
                          </div>
                        </td>
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
                              onClick={() => updateApplicationStatus(application.id, 'accepted')}
                              disabled={application.status === 'accepted'}
                            >
                              <i className="bi bi-check"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => updateApplicationStatus(application.id, 'rejected')}
                              disabled={application.status === 'rejected'}
                            >
                              <i className="bi bi-x"></i>
                            </button>
                            <Link 
                              to={`/recruiter-dashboard/applications/${application.id}`}
                              className="btn btn-sm btn-outline-primary"
                            >
                              <i className="bi bi-eye"></i>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}