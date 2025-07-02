// CompleteProfile.js
import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer } from 'react-toastify';
import { showErrorToast } from '../lib/toast';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export default function CompleteProfile() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    company_name: '',
    company_description: '',
    company_website: '',
    company_size: '',
    linkedin: '',
    location: '',
    founded_year: ''
  });

  const [preview, setPreview] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoBase64, setLogoBase64] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (user) {
      setForm({
        company_name: user.company_name || '',
        company_description: user.company_description || '',
        company_website: user.company_website || '',
        company_size: user.company_size || '',
        linkedin: user.linkedin || '',
        location: user.location || '',
        founded_year: user.founded_year || ''
      });
      if (user.image) setPreview(user.image);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setLogoBase64(reader.result); // Store base64 string
      };
      reader.readAsDataURL(file);
      setLogoFile(file);
    } else {
      setPreview('');
      setLogoFile(null);
      setLogoBase64('');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
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
    setIsSubmitting(true);

    if (!validate()) {
      setIsSubmitting(false);
      return;
    }

    setLoading(true);
    try {
      // Prepare payload for JSON (not FormData)
      const payload = { ...form };
      if (logoBase64) {
        payload.image_base64 = logoBase64;
      }

      const response = await axios.post(
        'http://localhost:5000/api/profile/recruiter',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token || (user?.token || '')}`
          }
        }
      );

      // Always update both localStorage and context with the latest user and token
      const updatedUser = {
        ...user,
        ...response.data.user,
        isProfileComplete: true
      };
      localStorage.setItem('devmatch_user', JSON.stringify(updatedUser));
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      login(updatedUser);
      // Optionally, you can use showSuccessToast if you want, or just navigate
      navigate('/'); // Navigate to home after completion
    } catch (err) {
      console.error('Error updating profile:', err);
      let errorMessage = 'Failed to save profile. Please try again.';
      if (err.response) {
        console.error('Backend error response:', err.response.data);
        if (Array.isArray(err.response.data?.errors)) {
          errorMessage = err.response.data.errors.map(e => e.msg || e).join(', ');
        } else if (typeof err.response.data?.message === 'string') {
          errorMessage = err.response.data.message;
        }
      }
      setErrors(prev => ({
        ...prev,
        server: errorMessage
      }));
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const formFields = [
    { name: 'company_name', label: 'Company Name', icon: 'fas fa-building', type: 'text', placeholder: 'Enter your company name', required: true },
    { name: 'company_description', label: 'Company Description', icon: 'fas fa-align-left', type: 'textarea', placeholder: 'Describe your company...', required: true },
    { name: 'company_website', label: 'Company Website', icon: 'fas fa-globe', type: 'url', placeholder: 'https://yourcompany.com', required: true },
    { name: 'company_size', label: 'Company Size', icon: 'fas fa-users', type: 'select', options: ['1-10 employees', '11-50 employees', '51-200 employees', '201-500 employees', '500+ employees'], required: true },
    { name: 'linkedin', label: 'LinkedIn Profile', icon: 'fab fa-linkedin', type: 'url', placeholder: 'https://linkedin.com/company/yourcompany', required: false },
    { name: 'location', label: 'Company Location', icon: 'fas fa-map-marker-alt', type: 'text', placeholder: 'City, Country', required: true },
    { name: 'founded_year', label: 'Founded Year', icon: 'fas fa-calendar-alt', type: 'number', placeholder: '2020', required: true }
  ];

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-8">
          <div className="text-center mb-5">
            <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle mb-3" style={{ width: '80px', height: '80px' }}>
              <i className="fas fa-user-edit text-primary" style={{ fontSize: '1.8rem' }}></i>
            </div>
            <h2 className="mb-3 text-primary fw-bold">Complete Your Company Profile</h2>
            <p className="text-muted">Fill in your company details to get started</p>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              {errors.server && showErrorToast(errors.server)}
              <ToastContainer />

              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-12 text-center mb-3">
                    <div className="d-flex flex-column align-items-center">
                      <div className="rounded-circle bg-light d-flex align-items-center justify-content-center overflow-hidden shadow-sm mb-3" style={{ width: '120px', height: '120px', cursor: 'pointer' }} onClick={triggerFileInput}>
                        {preview ? (
                          <img src={preview} alt="Company logo" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                        ) : (
                          <i className="fas fa-camera text-muted" style={{ fontSize: '2rem' }}></i>
                        )}
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="d-none" 
                      />
                      <button 
                        type="button" 
                        className="btn btn-sm btn-outline-primary rounded-pill" 
                        onClick={triggerFileInput}
                      >
                        <i className="fas fa-upload me-2"></i>
                        {preview ? 'Change Logo' : 'Upload Logo'}
                      </button>
                      <div className="text-muted mt-2 small">
                        Supported formats: JPG, PNG, GIF • Max size: 5MB
                      </div>
                    </div>
                  </div>

                  {formFields.map(({ name, label, icon, type, placeholder, options, required }) => (
                    <div className="col-md-6" key={name}>
                      <label className="form-label fw-semibold text-primary">
                        <i className={`${icon} me-2`}></i>
                        {label}
                        {required && <span className="text-danger ms-1">*</span>}
                      </label>
                      <div className={`input-group ${errors[name] ? 'has-validation' : ''}`}>
                        <span className="input-group-text bg-light border-end-0">
                          <i className={icon}></i>
                        </span>
                        {type === 'textarea' ? (
                          <textarea 
                            className={`form-control ${errors[name] ? 'is-invalid border-start-0' : 'border-start-0'}`} 
                            name={name} 
                            value={form[name]} 
                            onChange={handleChange} 
                            placeholder={placeholder} 
                            rows="3" 
                          />
                        ) : type === 'select' ? (
                          <select 
                            className={`form-control ${errors[name] ? 'is-invalid border-start-0' : 'border-start-0'}`} 
                            name={name} 
                            value={form[name]} 
                            onChange={handleChange}
                          >
                            <option value="">Select {label.toLowerCase()}...</option>
                            {options.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : (
                          <input 
                            type={type} 
                            className={`form-control ${errors[name] ? 'is-invalid border-start-0' : 'border-start-0'}`} 
                            name={name} 
                            value={form[name]} 
                            onChange={handleChange} 
                            placeholder={placeholder} 
                          />
                        )}
                      </div>
                      {errors[name] && (
                        <div className="invalid-feedback d-block mt-1">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          {errors[name]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="text-center mt-5">
                  <button 
                    type="submit" 
                    className="btn btn-primary px-5 py-3 rounded-pill fw-semibold" 
                    disabled={loading || isSubmitting} 
                    style={{ minWidth: '200px' }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Complete Profile
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="text-center mt-4">
            <small className="text-muted">
              <i className="fas fa-lock me-1"></i>
              Your information is secure and will not be shared
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}