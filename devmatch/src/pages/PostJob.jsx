import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { postJob } from '../lib/recruiterApi';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function PostJob() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    specialization_id: '',
    governorate_id: '',
    work_mode: 'onsite',
    job_type: 'full-time'
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [specializations, setSpecializations] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const navigate = useNavigate();
  const { user, isRecruiter } = useAuth();

  // Redirect if not a recruiter
  useEffect(() => {
    if (!isRecruiter) {
      navigate('/');
      return;
    }
    
    

    fetchData();
  }, [isRecruiter, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    if (apiError) {
      setApiError('');
    }
    
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'title':
        if (!value.trim()) {
          error = 'Job title is required';
        } else if (value.trim().length < 5) {
          error = 'Job title must be at least 5 characters';
        }
        break;
      case 'description':
        if (!value.trim()) {
          error = 'Job description is required';
        } else if (value.trim().length < 20) {
          error = 'Job description must be at least 20 characters';
        }
        break;
      case 'specialization_id':
        if (!value) {
          error = 'Please select a specialization';
        }
        break;
      case 'governorate_id':
        if (!value) {
          error = 'Please select a location';
        }
        break;
      case 'work_mode':
        if (!value) {
          error = 'Please select work mode';
        }
        break;
      case 'job_type':
        if (!value) {
          error = 'Please select job type';
        }
        break;
    }
    setErrors({ ...errors, [name]: error });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setIsLoading(true);

    const newTouched = {};
    Object.keys(form).forEach(key => {
      newTouched[key] = true;
    });
    setTouched(newTouched);

    let isValid = true;
    const newErrors = {};
    Object.keys(form).forEach((field) => {
      validateField(field, form[field]);
      if (!form[field]) {
        newErrors[field] = `${field.replace('_', ' ').charAt(0).toUpperCase() + field.replace('_', ' ').slice(1)} is required`;
        isValid = false;
      }
    });
    setErrors(newErrors);
    if (!isValid) {
      setIsLoading(false);
      return;
    }
    try {
      const newJob = {
        title: form.title,
        description: form.description,
        specialization: form.specialization_id, // backend expects specialization (string or id)
        governorate: form.governorate_id, // backend expects governorate (string or id)
        work_mode: form.work_mode,
        job_type: form.job_type
      };
      await postJob(newJob);
      // alert removed
      navigate('/jobs');
    } catch (err) {
      console.error('Post job error:', err);
      setApiError('Failed to post job. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldClass = (fieldName) => {
    if (!touched[fieldName]) return 'form-control';
    if (errors[fieldName]) return 'form-control is-invalid';
    if (form[fieldName]) return 'form-control is-valid';
    return 'form-control';
  };

  if (!isRecruiter) {
    return null;
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" 
         style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="card shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
          <div className="card-header text-center py-4" 
               style={{ 
                 backgroundColor: '#007bff',
                 border: 'none'
               }}>
            <h2 className="text-white fw-bold mb-1">
              <i className="bi bi-plus-circle me-2"></i>
              Post New Job
            </h2>
            <p className="text-white opacity-75 mb-0">Find the perfect developer for your team</p>
          </div>
          
          <div className="card-body p-4">
            {apiError && (
              <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <div>{apiError}</div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="title" className="form-label fw-semibold" style={{ color: '#007bff' }}>
                  <i className="bi bi-briefcase me-1"></i> Job Title
                </label>
                <input
                  type="text"
                  name="title"
                  className={getFieldClass('title')}
                  placeholder="e.g. Senior React Developer"
                  value={form.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ 
                    borderRadius: '10px', 
                    padding: '12px 16px',
                    borderColor: touched.title && !errors.title && form.title ? '#007bff' : undefined
                  }}
                />
                {touched.title && errors.title && (
                  <div className="text-danger small mt-1">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {errors.title}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label fw-semibold" style={{ color: '#007bff' }}>
                  <i className="bi bi-file-text me-1"></i> Job Description
                </label>
                <textarea
                  name="description"
                  className={getFieldClass('description')}
                  placeholder="Describe the role, responsibilities, and requirements..."
                  value={form.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows="4"
                  style={{ 
                    borderRadius: '10px', 
                    padding: '12px 16px',
                    borderColor: touched.description && !errors.description && form.description ? '#007bff' : undefined
                  }}
                />
                {touched.description && errors.description && (
                  <div className="text-danger small mt-1">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {errors.description}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="specialization_id" className="form-label fw-semibold" style={{ color: '#007bff' }}>
                  <i className="bi bi-code-square me-1"></i> Specialization
                </label>
                <select
                  name="specialization_id"
                  className={getFieldClass('specialization_id')}
                  value={form.specialization_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ 
                    borderRadius: '10px', 
                    padding: '12px 16px',
                    borderColor: touched.specialization_id && !errors.specialization_id && form.specialization_id ? '#007bff' : undefined
                  }}
                >
                  <option value="">Select specialization</option>
                  {specializations.map((spec) => (
                    <option key={spec.id} value={spec.spec_id}>
                      {spec.name}
                    </option>
                  ))}
                </select>
                {touched.specialization_id && errors.specialization_id && (
                  <div className="text-danger small mt-1">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {errors.specialization_id}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="governorate_id" className="form-label fw-semibold" style={{ color: '#007bff' }}>
                  <i className="bi bi-geo-alt me-1"></i> Location
                </label>
                <select
                  name="governorate_id"
                  className={getFieldClass('governorate_id')}
                  value={form.governorate_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ 
                    borderRadius: '10px', 
                    padding: '12px 16px',
                    borderColor: touched.governorate_id && !errors.governorate_id && form.governorate_id ? '#007bff' : undefined
                  }}
                >
                  <option value="">Select location</option>
                  {governorates.map((gov) => (
                    <option key={gov.id} value={gov.governorate_id}>
                      {gov.name}
                    </option>
                  ))}
                </select>
                {touched.governorate_id && errors.governorate_id && (
                  <div className="text-danger small mt-1">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {errors.governorate_id}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="work_mode" className="form-label fw-semibold" style={{ color: '#007bff' }}>
                  <i className="bi bi-building me-1"></i> Work Mode
                </label>
                <select
                  name="work_mode"
                  className={getFieldClass('work_mode')}
                  value={form.work_mode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{
                    borderRadius: '10px',
                    padding: '12px 16px',
                    borderColor: touched.work_mode && !errors.work_mode && form.work_mode ? '#007bff' : undefined
                  }}
                >
                  <option value="">Select work mode</option>
                  <option value="onsite">Onsite</option>
                  <option value="remotely">Remotely</option>
                </select>
                {touched.work_mode && errors.work_mode && (
                  <div className="text-danger small mt-1">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {errors.work_mode}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="job_type" className="form-label fw-semibold" style={{ color: '#007bff' }}>
                  <i className="bi bi-clock me-1"></i> Job Type
                </label>
                <select
                  name="job_type"
                  className={getFieldClass('job_type')}
                  value={form.job_type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{
                    borderRadius: '10px',
                    padding: '12px 16px',
                    borderColor: touched.job_type && !errors.job_type && form.job_type ? '#007bff' : undefined
                  }}
                >
                  <option value="">Select job type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="by task">By Task</option>
                </select>
                {touched.job_type && errors.job_type && (
                  <div className="text-danger small mt-1">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {errors.job_type}
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                className="btn w-100 py-3 fw-semibold text-white"
                disabled={isLoading}
                style={{ 
                  borderRadius: '10px',
                  backgroundColor: '#007bff',
                  border: 'none',
                  fontSize: '16px'
                }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Posting Job...
                  </>
                ) : (
                  <>
                    <i className="bi bi-plus-circle me-2"></i>
                    Post Job
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}