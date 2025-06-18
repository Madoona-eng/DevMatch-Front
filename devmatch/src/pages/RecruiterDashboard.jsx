// src/pages/RecruiterDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './RecruiterDashboard.css';
import Navbar from '../components/Navbar';

export default function RecruiterDashboard() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    company_name: '',
    company_description: '',
    company_website: '',
    company_size: '',
    linkedin: '',
    logo_url: '',
    location: '',
    founded_year: ''
  });
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user || user.role !== 'recruiter') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch company profile data
        if (activeTab === 'profile') {
          const userRes = await axios.get(`http://localhost:8000/users/${user.id}`);
          const userData = userRes.data;
          setForm({
            company_name: userData.company_name || '',
            company_description: userData.company_description || '',
            company_website: userData.company_website || '',
            company_size: userData.company_size || '',
            linkedin: userData.linkedin || '',
            logo_url: userData.logo_url || '',
            location: userData.location || '',
            founded_year: userData.founded_year || ''
          });
        }

        // Fetch recruiter's jobs
        const jobsRes = await axios.get(`http://localhost:8000/jobs?recruiter_id=${user.id}`);
        setJobs(jobsRes.data);

        // Fetch all freelancers
        const freelancersRes = await axios.get('http://localhost:8000/users');
        setFreelancers(freelancersRes.data.filter(u => u.role === 'programmer'));

        // Fetch applications for recruiter's jobs if on applications tab
        if (activeTab === 'applications') {
          const jobIds = jobsRes.data.map(job => job.id);
          if (jobIds.length > 0) {
            const applicationsRes = await axios.get(
              `http://localhost:8000/applications?${jobIds.map(id => `job_id=${id}`).join('&')}`
            );
            setApplications(applicationsRes.data);
          } else {
            setApplications([]);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate, activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    const yearRegex = /^\d{4}$/;

    if (!form.company_name.trim()) newErrors.company_name = 'Company name is required';
    if (!form.company_description.trim()) newErrors.company_description = 'Description is required';
    if (!form.company_website.trim()) {
      newErrors.company_website = 'Website is required';
    } else if (!urlRegex.test(form.company_website)) {
      newErrors.company_website = 'Please enter a valid URL';
    }
    if (!form.company_size) newErrors.company_size = 'Company size is required';
    if (form.linkedin && !urlRegex.test(form.linkedin)) {
      newErrors.linkedin = 'Please enter a valid LinkedIn URL';
    }
    if (!form.location.trim()) newErrors.location = 'Location is required';
    if (!form.founded_year) {
      newErrors.founded_year = 'Founded year is required';
    } else if (!yearRegex.test(form.founded_year)) {
      newErrors.founded_year = 'Please enter a valid year (YYYY)';
    } else if (parseInt(form.founded_year) > new Date().getFullYear()) {
      newErrors.founded_year = 'Year cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const response = await axios.patch(
        `http://localhost:8000/users/${user.id}`,
        form
      );

      const updatedUser = {
        ...user,
        ...form
      };
      
      login(updatedUser);
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setForm(prev => ({ ...prev, logo_url: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

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

  const handleViewJobApplications = (jobId) => {
    navigate(`/recruiter-dashboard/jobs/${jobId}/applications`);
  };

  if (loading && activeTab === 'profile' && !editing) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container-fluid px-0">
        {/* Header */}
        <div className="bg-primary text-white py-4">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="h4 mb-0">
                <i className="bi bi-briefcase me-2"></i>
                Recruiter Dashboard
              </h1>
              <span className="badge bg-light text-primary">
                Welcome, {user?.name}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container py-4">
          <div className="row">
            {/* Sidebar */}
            <div className="col-md-3 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="text-center mb-4">
                    {form.logo_url ? (
                      <img 
                        src={form.logo_url} 
                        alt="Company logo" 
                        className="rounded-circle mb-3" 
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="rounded-circle bg-light d-flex align-items-center justify-content-center mb-3" 
                           style={{ width: '100px', height: '100px' }}>
                        <i className="bi bi-building text-muted" style={{ fontSize: '2rem' }}></i>
                      </div>
                    )}
                    <h5 className="mb-1">{form.company_name || 'Your Company'}</h5>
                    <small className="text-muted">{form.location || 'Location'}</small>
                  </div>

                  <ul className="nav flex-column">
                    <li className="nav-item">
                      <button 
                        className={`nav-link d-flex align-items-center ${activeTab === 'profile' ? 'active text-primary' : 'text-dark'}`}
                        onClick={() => setActiveTab('profile')}
                      >
                        <i className="bi bi-person me-2"></i>
                        Company Profile
                      </button>
                    </li>
                    <li className="nav-item">
                      <button 
                        className={`nav-link d-flex align-items-center ${activeTab === 'applications' ? 'active text-primary' : 'text-dark'}`}
                        onClick={() => setActiveTab('applications')}
                      >
                        <i className="bi bi-people me-2"></i>
                        Job Applications
                      </button>
                    </li>
                    <li className="nav-item">
                      <button 
                        className={`nav-link d-flex align-items-center ${activeTab === 'jobs' ? 'active text-primary' : 'text-dark'}`}
                        onClick={() => setActiveTab('jobs')}
                      >
                        <i className="bi bi-file-earmark-text me-2"></i>
                        Posted Jobs
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Main Panel */}
            <div className="col-md-9">
              {error && (
                <div className="alert alert-danger d-flex align-items-center mb-4">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>{error}</div>
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white border-bottom py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">
                        <i className="bi bi-building me-2 text-primary"></i>
                        Company Profile
                      </h5>
                      {!editing ? (
                        <button 
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => setEditing(true)}
                        >
                          <i className="bi bi-pencil me-1"></i>
                          Edit Profile
                        </button>
                      ) : (
                        <button 
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => setEditing(false)}
                        >
                          <i className="bi bi-x me-1"></i>
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="card-body">
                    {editing ? (
                      <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label">Company Name</label>
                            <input
                              type="text"
                              className={`form-control ${errors.company_name ? 'is-invalid' : ''}`}
                              name="company_name"
                              value={form.company_name}
                              onChange={handleChange}
                            />
                            {errors.company_name && (
                              <div className="invalid-feedback">{errors.company_name}</div>
                            )}
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">Company Logo</label>
                            <input
                              type="file"
                              className="form-control"
                              onChange={handleFileChange}
                              accept="image/*"
                            />
                          </div>

                          <div className="col-12">
                            <label className="form-label">Description</label>
                            <textarea
                              className={`form-control ${errors.company_description ? 'is-invalid' : ''}`}
                              name="company_description"
                              value={form.company_description}
                              onChange={handleChange}
                              rows="3"
                            />
                            {errors.company_description && (
                              <div className="invalid-feedback">{errors.company_description}</div>
                            )}
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">Website</label>
                            <input
                              type="url"
                              className={`form-control ${errors.company_website ? 'is-invalid' : ''}`}
                              name="company_website"
                              value={form.company_website}
                              onChange={handleChange}
                              placeholder="https://example.com"
                            />
                            {errors.company_website && (
                              <div className="invalid-feedback">{errors.company_website}</div>
                            )}
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">LinkedIn</label>
                            <input
                              type="url"
                              className={`form-control ${errors.linkedin ? 'is-invalid' : ''}`}
                              name="linkedin"
                              value={form.linkedin}
                              onChange={handleChange}
                              placeholder="https://linkedin.com/company/your-company"
                            />
                            {errors.linkedin && (
                              <div className="invalid-feedback">{errors.linkedin}</div>
                            )}
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">Location</label>
                            <input
                              type="text"
                              className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                              name="location"
                              value={form.location}
                              onChange={handleChange}
                              placeholder="City, Country"
                            />
                            {errors.location && (
                              <div className="invalid-feedback">{errors.location}</div>
                            )}
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">Company Size</label>
                            <select
                              className={`form-control ${errors.company_size ? 'is-invalid' : ''}`}
                              name="company_size"
                              value={form.company_size}
                              onChange={handleChange}
                            >
                              <option value="">Select size</option>
                              <option value="1-10 employees">1-10 employees</option>
                              <option value="11-50 employees">11-50 employees</option>
                              <option value="51-200 employees">51-200 employees</option>
                              <option value="201-500 employees">201-500 employees</option>
                              <option value="500+ employees">500+ employees</option>
                            </select>
                            {errors.company_size && (
                              <div className="invalid-feedback">{errors.company_size}</div>
                            )}
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">Founded Year</label>
                            <input
                              type="text"
                              className={`form-control ${errors.founded_year ? 'is-invalid' : ''}`}
                              name="founded_year"
                              value={form.founded_year}
                              onChange={handleChange}
                              placeholder="YYYY"
                            />
                            {errors.founded_year && (
                              <div className="invalid-feedback">{errors.founded_year}</div>
                            )}
                          </div>

                          <div className="col-12 mt-4">
                            <button 
                              type="submit" 
                              className="btn btn-primary px-4"
                              disabled={loading}
                            >
                              {loading ? (
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              ) : (
                                <i className="bi bi-check-circle me-2"></i>
                              )}
                              Save Changes
                            </button>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <div className="row">
                        <div className="col-md-4 text-center mb-4 mb-md-0">
                          {form.logo_url ? (
                            <img 
                              src={form.logo_url} 
                              alt="Company logo" 
                              className="img-fluid rounded" 
                              style={{ maxHeight: '200px' }}
                            />
                          ) : (
                            <div className="bg-light p-5 rounded d-flex align-items-center justify-content-center">
                              <i className="bi bi-building text-muted" style={{ fontSize: '3rem' }}></i>
                            </div>
                          )}
                        </div>
                        <div className="col-md-8">
                          <h4 className="mb-3">{form.company_name}</h4>
                          <p className="text-muted mb-4">{form.company_description}</p>

                          <div className="row">
                            <div className="col-md-6">
                              <div className="mb-3">
                                <h6 className="text-muted mb-1">Website</h6>
                                {form.company_website ? (
                                  <a href={form.company_website} target="_blank" rel="noopener noreferrer">
                                    {form.company_website}
                                  </a>
                                ) : (
                                  <span className="text-muted">Not provided</span>
                                )}
                              </div>

                              <div className="mb-3">
                                <h6 className="text-muted mb-1">Location</h6>
                                <p>{form.location || 'Not provided'}</p>
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="mb-3">
                                <h6 className="text-muted mb-1">Company Size</h6>
                                <p>{form.company_size || 'Not provided'}</p>
                              </div>

                              <div className="mb-3">
                                <h6 className="text-muted mb-1">Founded</h6>
                                <p>{form.founded_year || 'Not provided'}</p>
                              </div>
                            </div>
                          </div>

                          {form.linkedin && (
                            <div className="mt-3">
                              <a 
                                href={form.linkedin} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-outline-primary btn-sm"
                              >
                                <i className="bi bi-linkedin me-1"></i>
                                LinkedIn Profile
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Applications Tab */}
              {activeTab === 'applications' && (
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white border-bottom py-3">
                    <h5 className="mb-0">
                      <i className="bi bi-people me-2 text-primary"></i>
                      Job Applications
                    </h5>
                  </div>

                  <div className="card-body">
                    {loading ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : applications.length === 0 ? (
                      <div className="text-center py-5">
                        <i className="bi bi-people text-muted" style={{ fontSize: '3rem' }}></i>
                        <h5 className="mt-3">No applications yet</h5>
                        <p className="text-muted">Applications for your posted jobs will appear here</p>
                        <Link to="/post-job" className="btn btn-primary mt-2">
                          <i className="bi bi-plus-circle me-1"></i>
                          Post a Job
                        </Link>
                      </div>
                    ) : (
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
                            {applications
                              .filter(application => {
                                const jobExists = jobs.some(j => j.id === application.job_id || j.job_id === application.job_id);
                                const candidateExists = freelancers.some(f => f.id === application.applicant_id);
                                return jobExists && candidateExists;
                              })
                              .map(application => {
                                const job = jobs.find(j => j.id === application.job_id || j.job_id === application.job_id);
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
                                            <a 
                                              href={encodeURI(freelancer.cv_url.startsWith('http') ? freelancer.cv_url : `http://localhost:8000/${freelancer.cv_url}`)} 
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
                                    <td>{job?.title}</td>
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
                    )}
                  </div>
                </div>
              )}

              {/* Jobs Tab */}
              {activeTab === 'jobs' && (
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white border-bottom py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">
                        <i className="bi bi-file-earmark-text me-2 text-primary"></i>
                        Posted Jobs
                      </h5>
                      <Link to="/post-job" className="btn btn-primary btn-sm">
                        <i className="bi bi-plus me-1"></i>
                        Post New Job
                      </Link>
                    </div>
                  </div>

                  <div className="card-body">
                    {loading ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : jobs.length === 0 ? (
                      <div className="text-center py-5">
                        <i className="bi bi-file-earmark-text text-muted" style={{ fontSize: '3rem' }}></i>
                        <h5 className="mt-3">No jobs posted yet</h5>
                        <p className="text-muted">Your posted jobs will appear here</p>
                        <Link to="/post-job" className="btn btn-primary mt-2">
                          <i className="bi bi-plus-circle me-1"></i>
                          Post Your First Job
                        </Link>
                      </div>
                    ) : (
                      <div className="list-group list-group-flush">
                        {jobs.map(job => (
                          <div key={job.id} className="list-group-item border-0 py-3">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h5 className="mb-1">
                                  <Link to={`/jobs/${job.id}`} className="text-decoration-none">
                                    {job.title}
                                  </Link>
                                </h5>
                                <p className="text-muted mb-2">{job.description.substring(0, 100)}...</p>
                                <div className="d-flex gap-3">
                                  <small className="text-muted">
                                    <i className="bi bi-calendar me-1"></i>
                                    Posted: {new Date(job.created_at).toLocaleDateString()}
                                  </small>
                                  <small className={`badge ${
                                    job.status === 'open' ? 'bg-success' : 'bg-secondary'
                                  }`}>
                                    {job.status}
                                  </small>
                                </div>
                              </div>
                              <div className="d-flex gap-2">
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleViewJobApplications(job.id)}
                                >
                                  <i className="bi bi-people me-1"></i>
                                  View Applications
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}