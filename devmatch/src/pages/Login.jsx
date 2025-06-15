import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear errors when user starts typing
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
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
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

    // Validate all fields
    let isValid = true;
    const newErrors = {};
    
    Object.keys(form).forEach((field) => {
      validateField(field, form[field]);
      if (!form[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    
    if (!isValid) {
      setIsLoading(false);
      return;
    }

    try {
      const { data: users } = await axios.get(
        `http://localhost:8000/users?email=${form.email}&password=${form.password}`
      );
      
      if (users.length === 0) {
        setApiError('Invalid email or password. Please check your credentials and try again.');
        setIsLoading(false);
        return;
      }
      
      // Success
      alert('🎉 Welcome back to DevMatch!');
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setApiError('Something went wrong. Please check your connection and try again.');
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
      <div className="container" style={{ maxWidth: '450px' }}>
        <div className="card shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
          <div className="card-header text-center py-4" 
               style={{ 
                 backgroundColor: '#007bff',
                 border: 'none'
               }}>
            <h2 className="text-white fw-bold mb-1">
              <i className="bi bi-code-square me-2"></i>
              Welcome Back
            </h2>
            <p className="text-white opacity-75 mb-0">Sign in to DevMatch</p>
          </div>
          
          <div className="card-body p-4">
            {apiError && (
              <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <div>{apiError}</div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} noValidate>
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
              <div className="mb-4">
                <label htmlFor="password" className="form-label fw-semibold" style={{ color: '#007bff' }}>
                  <i className="bi bi-lock me-1"></i> Password
                </label>
                <input
                  type="password"
                  name="password"
                  className={getFieldClass('password')}
                  placeholder="Enter your password"
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

              {/* Submit Button */}
              <button 
                type="submit" 
                className="btn w-100 py-3 fw-semibold mb-3 text-white"
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
                    Signing in...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Sign In
                  </>
                )}
              </button>

              {/* Register Link */}
              <div className="text-center">
                <p className="text-muted mb-0">
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    className="text-decoration-none fw-semibold"
                    style={{ color: '#007bff' }}
                  >
                    Create one here
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