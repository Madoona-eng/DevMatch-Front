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
    cv_url: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user starts typing
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
      case 'name':
        if (!value.trim()) {
          error = 'Full name is required';
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters';
        }
        break;
      case 'email':
        if (!value.trim()) {
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

    // Mark all fields as touched
    const newTouched = {};
    Object.keys(form).forEach(key => {
      newTouched[key] = true;
    });
    setTouched(newTouched);

    // Validate all required fields
    let isValid = true;
    const newErrors = {};
    
    ['name', 'email', 'password', 'confirmPassword', 'role'].forEach((field) => {
      validateField(field, form[field]);
      if (!form[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        isValid = false;
      }
    });

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    
    if (!isValid) {
      setIsLoading(false);
      return;
    }

    try {
      // Check if email already exists
      const { data: existingUsers } = await axios.get(
        `http://localhost:8000/users?email=${form.email}`
      );
      
      if (existingUsers.length > 0) {
        setApiError('This email is already registered. Please use a different email or try logging in.');
        setIsLoading(false);
        return;
      }


      //make editing in your code abanoub in here 





      const newUser = {
        ...form,
        refused: false,
        registration_date: new Date().toISOString(),
      };

      await axios.post('http://localhost:8000/users', newUser);
      
      // Success feedback
      setApiError('');
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
               style={{ 
                 backgroundColor: '#007bff',
                 border: 'none'
               }}>
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
              {/* Name Field */}
              <div className="mb-3">
                <label htmlFor="name" className="form-label fw-semibold" style={{ color: '#007bff' }}>
                  <i className="bi bi-person me-1"></i> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  className={getFieldClass('name')}
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ 
                    borderRadius: '10px', 
                    padding: '12px 16px',
                    borderColor: touched.name && !errors.name && form.name ? '#007bff' : undefined
                  }}
                />
                {touched.name && errors.name && (
                  <div className="text-danger small mt-1">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold" style={{ color: '#007bff' }}>
                  <i className="bi bi-envelope me-1"></i> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  className={getFieldClass('email')}
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ 
                    borderRadius: '10px', 
                    padding: '12px 16px',
                    borderColor: touched.email && !errors.email && form.email ? '#007bff' : undefined
                  }}
                />
                {touched.email && errors.email && (
                  <div className="text-danger small mt-1">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-semibold" style={{ color: '#007bff' }}>
                  <i className="bi bi-lock me-1"></i> Password
                </label>
                <input
                  type="password"
                  name="password"
                  className={getFieldClass('password')}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ 
                    borderRadius: '10px', 
                    padding: '12px 16px',
                    borderColor: touched.password && !errors.password && form.password ? '#007bff' : undefined
                  }}
                />
                {touched.password && errors.password && (
                  <div className="text-danger small mt-1">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label fw-semibold" style={{ color: '#007bff' }}>
                  <i className="bi bi-shield-lock me-1"></i> Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className={getFieldClass('confirmPassword')}
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ 
                    borderRadius: '10px', 
                    padding: '12px 16px',
                    borderColor: touched.confirmPassword && !errors.confirmPassword && form.confirmPassword ? '#007bff' : undefined
                  }}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <div className="text-danger small mt-1">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              {/* Role Field */}
              <div className="mb-3">
                <label htmlFor="role" className="form-label fw-semibold" style={{ color: '#007bff' }}>
                  <i className="bi bi-briefcase me-1"></i> I am a...
                </label>
                <select
                  name="role"
                  className={getFieldClass('role')}
                  value={form.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ 
                    borderRadius: '10px', 
                    padding: '12px 16px',
                    borderColor: touched.role && !errors.role && form.role ? '#007bff' : undefined
                  }}
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

              {/* CV URL Field */}
              <div className="mb-4">
                <label htmlFor="cv_url" className="form-label fw-semibold" style={{ color: '#007bff' }}>
                  <i className="bi bi-link-45deg me-1"></i> Portfolio/CV URL 
                  <span className="text-muted small">(Optional)</span>
                </label>
                <input
                  type="url"
                  name="cv_url"
                  className="form-control"
                  placeholder="https://yourportfolio.com"
                  value={form.cv_url}
                  onChange={handleChange}
                  style={{ borderRadius: '10px', padding: '12px 16px' }}
                />
              </div>

              {/* Submit Button */}
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

              {/* Login Link */}
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