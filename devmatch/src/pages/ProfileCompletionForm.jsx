import React, { useState, useEffect } from 'react';
import { Form, Button, Image, Alert } from 'react-bootstrap';
import { axiosInstance } from '../lib/axios';
import { useNavigate } from 'react-router-dom';
import { getUserId } from '../utils/userUtils';

function ProfileCompletionForm() {
  // Get user from localStorage under 'devmatch_user'
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('devmatch_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserId(getUserId(user));
      } catch (e) {
        setUserId(null);
      }
    } else {
      setUserId(null);
    }
  }, []);

  const [aboutMe, setAboutMe] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [technology, setTechnology] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [github, setGithub] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!aboutMe.trim()) errors.aboutMe = 'Please enter About Me';
    if (!location.trim()) errors.location = 'Please enter Location';
    if (!experience.trim() || isNaN(experience) || experience < 0) errors.experience = 'Please enter a valid Experience';
    if (!skills.trim()) errors.skills = 'Please enter Skills';
    if (!technology.trim()) errors.technology = 'Please enter Technology';
    if (!imageFile) errors.image = 'Please upload an Image';
    if (!github.trim()) errors.github = 'Please enter your GitHub link';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFieldErrors({});

    if (!userId) {
      setError('User not authenticated.');
      return;
    }

    if (!validateForm()) return;

    try {
      // Use shared axios instance and correct API route
      const existingUserRes = await axiosInstance.get(`/users/${userId}`);
      const existingUser = existingUserRes.data;

      const getBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });

      let imageBase64 = existingUser.image || '';
      if (imageFile) {
        imageBase64 = await getBase64(imageFile);
      }

      const techArray = technology.split(',').map((t) => t.trim()).filter(Boolean);

      const updatedUser = {
        ...existingUser,
        aboutMe,
        location,
        experience: Number(experience),
        skills,
        technology: techArray,
        image: imageBase64,
        github,
        isProfileComplete: true // Mark profile as complete
      };

      // Use shared axios instance for PUT
      const response = await axiosInstance.put(`/users/${userId}`, updatedUser);
      // Optionally update localStorage with new user
      localStorage.setItem('devmatch_user', JSON.stringify(response.data));
      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      // Show backend field errors if available
      if (err.response && err.response.data && err.response.data.errors) {
        setFieldErrors(err.response.data.errors);
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to update profile. Please try again.');
      }
      console.error(err);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="p-4 shadow rounded"
      style={{ maxWidth: 700, margin: 'auto', backgroundColor: '#f8f9fa' }}
    >
      <h3 className="mb-4 text-primary text-center">Complete Your Profile</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form.Group controlId="aboutMe" className="mb-3">
        <Form.Label>About Me</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Tell us about yourself..."
          value={aboutMe}
          onChange={(e) => setAboutMe(e.target.value)}
          isInvalid={!!fieldErrors.aboutMe}
        />
        {fieldErrors.aboutMe && <div className="text-danger small mt-1">{fieldErrors.aboutMe}</div>}
      </Form.Group>

      <Form.Group controlId="image" className="mb-3">
        <Form.Label>Profile Image</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          isInvalid={!!fieldErrors.image}
        />
        {fieldErrors.image && <div className="text-danger small mt-1">{fieldErrors.image}</div>}
        {imagePreview && (
          <div className="mt-3 text-center">
            <Image
              src={imagePreview}
              roundedCircle
              style={{
                width: 150,
                height: 150,
                objectFit: 'cover',
                border: '2px solid #0d6efd',
              }}
              alt="Image preview"
            />
          </div>
        )}
      </Form.Group>

      <Form.Group controlId="location" className="mb-3">
        <Form.Label>Location</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter your location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          isInvalid={!!fieldErrors.location}
        />
        {fieldErrors.location && <div className="text-danger small mt-1">{fieldErrors.location}</div>}
      </Form.Group>

      <Form.Group controlId="experience" className="mb-3">
        <Form.Label>Experience (years)</Form.Label>
        <Form.Control
          type="number"
          min="0"
          placeholder="e.g., 3"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          isInvalid={!!fieldErrors.experience}
        />
        {fieldErrors.experience && <div className="text-danger small mt-1">{fieldErrors.experience}</div>}
      </Form.Group>

      <Form.Group controlId="skills" className="mb-3">
        <Form.Label>Skills (comma separated)</Form.Label>
        <Form.Control
          type="text"
          placeholder="e.g., HTML, CSS, JavaScript"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          isInvalid={!!fieldErrors.skills}
        />
        {fieldErrors.skills && <div className="text-danger small mt-1">{fieldErrors.skills}</div>}
      </Form.Group>

      <Form.Group controlId="technology" className="mb-3">
        <Form.Label>Technology (comma separated)</Form.Label>
        <Form.Control
          type="text"
          placeholder="e.g., Angular, React, NodeJS"
          value={technology}
          onChange={(e) => setTechnology(e.target.value)}
          isInvalid={!!fieldErrors.technology}
        />
        {fieldErrors.technology && <div className="text-danger small mt-1">{fieldErrors.technology}</div>}
      </Form.Group>

      <Form.Group controlId="github" className="mb-3">
        <Form.Label>GitHub Link</Form.Label>
        <Form.Control
          type="url"
          placeholder="https://github.com/yourusername"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          isInvalid={!!fieldErrors.github}
        />
        {fieldErrors.github && <div className="text-danger small mt-1">{fieldErrors.github}</div>}
      </Form.Group>

      <div className="d-grid mt-4">
        <Button variant="primary" type="submit" size="lg">
          Save Profile
        </Button>
      </div>
    </Form>
  );
}

export default ProfileCompletionForm;