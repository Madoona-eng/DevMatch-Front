import React, { useState } from 'react';
import { Form, Button, Image, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProfileCompletionForm({ id }) {
  const [aboutMe, setAboutMe] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [technology, setTechnology] = useState(''); // now a string input
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
    if (!aboutMe.trim()) {
      setError('Please enter About Me');
      return false;
    }
    if (!location.trim()) {
      setError('Please enter Location');
      return false;
    }
    if (!experience.trim() || isNaN(experience) || experience < 0) {
      setError('Please enter a valid Experience (0 or more)');
      return false;
    }
    if (!skills.trim()) {
      setError('Please enter Skills');
      return false;
    }
    if (!technology.trim()) {
      setError('Please enter Technology');
      return false;
    }
    if (!imageFile) {
      setError('Please upload an Image');
      return false;
    }
    return true;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  if (!validateForm()) return;

  try {
    // Fetch existing user data
    const existingUserRes = await axios.get(`http://localhost:8000/users/0419`);
    const existingUser = existingUserRes.data;

    // Convert image file to base64 string (if a new file is selected)
    const getBase64 = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

    let imageBase64 = existingUser.image || '';
    if (imageFile) {
      imageBase64 = await getBase64(imageFile);
    }

    // Prepare tech array from input string
    const techArray = technology.split(',').map(t => t.trim()).filter(t => t);

    // Merge old user data with new fields
    const updatedUser = {
      ...existingUser,
      aboutMe,
      location,
      experience: Number(experience),
      skills,
      technology: techArray,
      image: imageBase64,
    };

    // Send updated user data
    await axios.put(`http://localhost:8000/users/0419`, updatedUser);

    setSuccess('Profile updated successfully!');
    setTimeout(() => navigate('/'), 1000);

  } catch (err) {
    setError('Failed to update profile. Please try again.');
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
          onChange={e => setAboutMe(e.target.value)}
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
              style={{ width: 150, height: 150, objectFit: 'cover', border: '2px solid #0d6efd' }}
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
          onChange={e => setLocation(e.target.value)}
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
          onChange={e => setExperience(e.target.value)}
          isInvalid={!!error && (!experience.trim() || isNaN(experience) || experience < 0)}
        />
      </Form.Group>

      <Form.Group controlId="skills" className="mb-3">
        <Form.Label>Skills (comma separated)</Form.Label>
        <Form.Control
          type="text"
          placeholder="e.g., HTML, CSS, JavaScript"
          value={skills}
          onChange={e => setSkills(e.target.value)}
          isInvalid={!!error && !skills.trim()}
        />
      </Form.Group>

      <Form.Group controlId="technology" className="mb-3">
        <Form.Label>Technology (comma separated)</Form.Label>
        <Form.Control
          type="text"
          placeholder="e.g., Angular, React, NodeJS"
          value={technology}
          onChange={e => setTechnology(e.target.value)}
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
