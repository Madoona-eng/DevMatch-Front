import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    cv_file: null,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const generateId = () => {
    return Math.random().toString(36).substr(2, 4);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'cv_file' && files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    if (apiError) {
      setApiError('');
    }
    
    validateField(name, files ? files[0] : value);
  };

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value || !value.toString().trim()) {
          error = 'Full name is required';
        } else if (value.toString().trim().length < 2) {
          error = 'Name must be at least 2 characters';
        }
        break;
      case 'email':
        if (!value || !value.toString().trim()) {
          error = 'Email address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          error = 'Password must contain uppercase, lowercase, and number';
        }
        break;
      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password';
        } else if (value !== form.password) {
          error = 'Passwords do not match';
        }
        break;
      case 'role':
        if (!value) {
          error = 'Please select your role';
        }
        break;
      case 'cv_file':
        if (form.role === 'programmer' && value) {
          const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
          if (!allowedTypes.includes(value.type)) {
            error = 'Please upload a PDF or Word document';
          } else if (value.size > 5 * 1024 * 1024) {
            error = 'File size must be less than 5MB';
          }
        }
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
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
      if (key !== 'cv_file') {
        newTouched[key] = true;
      }
    });
    setTouched(newTouched);

    let isValid = true;
    const newErrors = {};
    
    const requiredFields = ['name', 'email', 'password', 'confirmPassword', 'role'];
    requiredFields.forEach((field) => {
      if (!form[field] || (typeof form[field] === 'string' && !form[field].trim())) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace('confirmPassword', 'confirm password')} is required`;
        isValid = false;
      }
    });

    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    
    if (!isValid) {
      setIsLoading(false);
      return;
    }

    try {
      const { data: existingUsers } = await axios.get(
        `http://localhost:8000/users?email=${encodeURIComponent(form.email)}`
      );
      
      if (existingUsers.length > 0) {
        setApiError('This email is already registered. Please use a different email or try logging in.');
        setIsLoading(false);
        return;
      }

      const userData = {
        id: generateId(),
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
        cv_url: form.cv_file ? `uploads/${form.cv_file.name}` : '',
        refused: false,
        registration_date: new Date().toISOString(),
        ...(form.role === 'recruiter' && {
          isProfileComplete: false,
          company_name: '',
          company_description: '',
          company_website: '',
          company_size: '',
          linkedin: '',
          logo: null,
          logo_url: '',
          location: '',
          founded_year: ''
        })
      };

      await axios.post('http://localhost:8000/users', userData);
      
      alert('🎉 Registration successful! Welcome to DevMatch!');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      setApiError('Registration failed. Please check your connection and try again.');
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

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" 
         style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <div className="card shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
          <div className="card-header text-center py-4" 
               style={{ backgroundColor: '#007bff', border: 'none' }}>
            <h2 className="text-white fw-bold mb-1">
              <i className="bi bi-rocket-takeoff me-2"></i>
              Join DevMatch
            </h2>
            <p className="text-white opacity-75 mb-0">Create your developer profile</p>
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
                <label htmlFor="name" className="form-label fw-semibold" style={{ color: '#007bff' }}>
                  <i className="bi bi-person me-1"></i> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className={getFieldClass('name')}
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ borderRadius: '10px', padding: '12px 16px' }}
                />
                {touched.name && errors.name && (
                  <div className="text-danger small mt-1">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {errors.name}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold" style={{ color: '#007bff' }}>
                  <i className="bi bi-envelope me-1"></i> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className={getFieldClass('email')}
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ borderRadius: '10px', padding: '12px 16px' }}
                />
                {touched.email && errors.email && (
                  <div className="text-danger small mt-1">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {errors.email}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-semibold" style={{ color: '#007bff' }}>
                  <i className="bi bi-lock me-1"></i> Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className={getFieldClass('password')}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ borderRadius: '10px', padding: '12px 16px' }}
                />
                {touched.password && errors.password && (
                  <div className="text-danger small mt-1">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {errors.password}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label fw-semibold" style={{ color: '#007bff' }}>
                  <i className="bi bi-shield-lock me-1"></i> Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className={getFieldClass('confirmPassword')}
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ borderRadius: '10px', padding: '12px 16px' }}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <div className="text-danger small mt-1">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="role" className="form-label fw-semibold" style={{ color: '#007bff' }}>
                  <i className="bi bi-briefcase me-1"></i> I am a...
                </label>
                <select
                  name="role"
                  id="role"
                  className={getFieldClass('role')}
                  value={form.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ borderRadius: '10px', padding: '12px 16px' }}
                >
                  <option value="">Select your role</option>
                  <option value="programmer">💻 Programmer/Developer</option>
                  <option value="recruiter">🎯 Recruiter/HR</option>
                </select>
                {touched.role && errors.role && (
                  <div className="text-danger small mt-1">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {errors.role}
                  </div>
                )}
              </div>

              {form.role === 'programmer' && (
                <div className="mb-4">
                  <label htmlFor="cv_file" className="form-label fw-semibold" style={{ color: '#007bff' }}>
                    <i className="bi bi-file-earmark-arrow-up me-1"></i> Upload CV/Resume 
                    <span className="text-muted small">(Optional - PDF or Word)</span>
                  </label>
                  <input
                    type="file"
                    name="cv_file"
                    id="cv_file"
                    className={getFieldClass('cv_file')}
                    accept=".pdf,.doc,.docx"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{ borderRadius: '10px', padding: '12px 16px' }}
                  />
                  {touched.cv_file && errors.cv_file && (
                    <div className="text-danger small mt-1">
                      <i className="bi bi-exclamation-circle me-1"></i>
                      {errors.cv_file}
                    </div>
                  )}
                  <div className="text-muted small mt-1">
                    <i className="bi bi-info-circle me-1"></i>
                    Supported formats: PDF, DOC, DOCX (max 5MB)
                  </div>
                </div>
              )}

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
                    Creating Account...
                  </>
                ) : (
                  <>
                    <i className="bi bi-rocket-takeoff me-2"></i>
                    Create Account
                  </>
                )}
              </button>

              <div className="text-center mt-4">
                <p className="text-muted mb-0">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="text-decoration-none fw-semibold"
                    style={{ color: '#007bff' }}
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}