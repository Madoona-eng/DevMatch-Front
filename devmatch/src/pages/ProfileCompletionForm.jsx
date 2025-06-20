import React, { useState, useEffect } from 'react';
import { Form, Button, Image, Alert } from 'react-bootstrap';
import { axiosInstance } from '../lib/axios';
import { useNavigate } from 'react-router-dom';

function ProfileCompletionForm() {
  // Get user from localStorage under 'devmatch_user'
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('devmatch_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserId(user.id);
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    if (!aboutMe.trim()) return setError('Please enter About Me') || false;
    if (!location.trim()) return setError('Please enter Location') || false;
    if (!experience.trim() || isNaN(experience) || experience < 0)
      return setError('Please enter a valid Experience') || false;
    if (!skills.trim()) return setError('Please enter Skills') || false;
    if (!technology.trim()) return setError('Please enter Technology') || false;
    if (!imageFile) return setError('Please upload an Image') || false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

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
      };

      // Use shared axios instance for PUT
      const response = await axiosInstance.put(`/users/${userId}`, updatedUser);
      // Optionally update localStorage with new user
      localStorage.setItem('devmatch_user', JSON.stringify(response.data));
      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      // Show backend error message if available
      if (err.response && err.response.data && err.response.data.message) {
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
          isInvalid={!!error && !aboutMe.trim()}
        />
      </Form.Group>

      <Form.Group controlId="image" className="mb-3">
        <Form.Label>Profile Image</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          isInvalid={!!error && !imageFile}
        />
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
          isInvalid={!!error && !location.trim()}
        />
      </Form.Group>

      <Form.Group controlId="experience" className="mb-3">
        <Form.Label>Experience (years)</Form.Label>
        <Form.Control
          type="number"
          min="0"
          placeholder="e.g., 3"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          isInvalid={!!error && (!experience.trim() || isNaN(experience) || experience < 0)}
        />
      </Form.Group>

      <Form.Group controlId="skills" className="mb-3">
        <Form.Label>Skills (comma separated)</Form.Label>
        <Form.Control
          type="text"
          placeholder="e.g., HTML, CSS, JavaScript"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          isInvalid={!!error && !skills.trim()}
        />
      </Form.Group>

      <Form.Group controlId="technology" className="mb-3">
        <Form.Label>Technology (comma separated)</Form.Label>
        <Form.Control
          type="text"
          placeholder="e.g., Angular, React, NodeJS"
          value={technology}
          onChange={(e) => setTechnology(e.target.value)}
          isInvalid={!!error && !technology.trim()}
        />
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
