import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { showErrorToast } from '../lib/toast';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import { useAuth } from './AuthContext';
import { useChatStore } from '../store/useChatStore';
import { MessageSquare } from 'lucide-react';
import Footer from '../components/Footer'; // Make sure the Footer path is correct
import Navbar from '../components/Navbar'; 
export default function ApplicationDetails() {
  const params = useParams();
  const applicationId = params.applicationId || params.id;
  const navigate = useNavigate();
  const { user } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setSelectedUser } = useChatStore();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    axiosInstance.get(`/applications/${applicationId}`)
      .then(res => {
        const appData = res.data?.application || res.data;
        if (appData && appData._id) {
          setApplication(appData);
        } else {
          setError('Application not found or invalid response structure.');
        }
      })
      .catch(err => {
        let msg = 'Failed to load application details';
        if (err.response?.status === 404) {
          msg = 'Application not found.';
        } else if (err.response?.status === 401) {
          msg = 'Unauthorized. Please log in as a recruiter.';
          setTimeout(() => navigate('/login'), 2000);
        } else if (err.response?.data?.message) {
          msg = err.response.data.message;
        }
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [user, navigate, applicationId]);

  const updateApplicationStatus = async (status) => {
    try {
      if (status === 'accepted') {
        await axiosInstance.put(`/applications/accept/${applicationId}`);
      } else if (status === 'rejected') {
        await axiosInstance.put(`/applications/reject/${applicationId}`);
      }
      setApplication(prev => ({ ...prev, status }));
      toast.success('Congratulations! You have been accepted for the job.');
    } catch (err) {
      let msg = 'Failed to update application status';
      if (err.response?.data?.message) msg = err.response.data.message;
      setError(msg);
    }
  };

  const handleStartChat = () => {
    if (application?.applicant_id) {
      setSelectedUser({
        _id: application.applicant_id._id,
        name: application.applicant_id.name,
        email: application.applicant_id.email,
        image: application.applicant_id.image
      });
      navigate('/privatechats/home');
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
    showErrorToast(error);
    return (
      <div className="container py-5 text-center">
        <ToastContainer />
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  if (!application) {
    showErrorToast('Application not found or invalid application ID.');
    return (
      <div className="container py-5 text-center">
        <ToastContainer />
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  const { applicant_id, job_id, cover_letter, status } = application;

  return (
    <>
    <Navbar />
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-file-earmark-person me-2"></i>
          Application Details
        </h2>
        <button className="btn btn-outline-primary" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left me-1"></i>
          Back to Applications
        </button>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white">
          <h5 className="mb-0">Job Information</h5>
        </div>
        <div className="card-body">
          <h5>{job_id?.title}</h5>
          <p className="text-muted">{job_id?.description}</p>
          <div className="d-flex gap-3">
            <small className="text-muted">
              <i className="bi bi-calendar me-1"></i>
              Posted: {job_id?.created_at ? new Date(job_id.created_at).toLocaleDateString() : 'N/A'}
            </small>
            <small className={`badge ${job_id?.status === 'open' ? 'bg-success' : 'bg-secondary'}`}>
              {job_id?.status}
            </small>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white">
              <h5 className="mb-0">Candidate Information</h5>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3 overflow-hidden"
                  style={{ width: '60px', height: '60px' }}>
                  {applicant_id?.image ? (
                    <img 
                      src={
                        applicant_id.image.startsWith('data:image')
                          ? applicant_id.image
                          : `data:image/png;base64,${applicant_id.image}`
                      }
                      alt="Applicant"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <i className="bi bi-person text-muted" style={{ fontSize: '1.5rem' }}></i>
                  )}
                </div>
                <div>
                  <h5 className="mb-1">{applicant_id?.name}</h5>
                  <p className="text-muted mb-0">{applicant_id?.email}</p>
                </div>
              </div>
              <div className="mb-3">
                <h6 className="text-muted mb-1">CV</h6>
                {applicant_id?.cv_url ? (
                  <a href={applicant_id.cv_url} target="_blank" rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm">
                    <i className="bi bi-download me-1"></i>
                    Download CV
                  </a>
                ) : (
                  <p className="text-muted">No CV uploaded</p>
                )}
              </div>
              <div className="d-flex justify-content-end">
                <button 
                  onClick={handleStartChat}
                  className="btn btn-outline-primary d-flex align-items-center gap-1"
                  title="Message this candidate"
                >
                  <MessageSquare size={16} />
                  <span>Message</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Application Status</h5>
                <span className={`badge ${
                  status === 'pending' ? 'bg-warning text-dark' :
                  status === 'accepted' ? 'bg-success' :
                  'bg-danger'
                }`}>
                  {status}
                </span>
              </div>
            </div>
            <div className="card-body">
              <div className="d-flex gap-2 mb-3">
                <button
                  className="btn btn-outline-success"
                  onClick={() => updateApplicationStatus('accepted')}
                  disabled={status === 'accepted'}
                >
                  <i className="bi bi-check me-1"></i>
                  Accept
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => updateApplicationStatus('rejected')}
                  disabled={status === 'rejected'}
                >
                  <i className="bi bi-x me-1"></i>
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white">
          <h5 className="mb-0">Cover Letter</h5>
        </div>
        <div className="card-body">
          {cover_letter ? (
            <div className="bg-light p-3 rounded">
              <p style={{ whiteSpace: 'pre-wrap' }}>{cover_letter}</p>
            </div>
          ) : (
            <p className="text-muted">No cover letter provided</p>
          )}
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}