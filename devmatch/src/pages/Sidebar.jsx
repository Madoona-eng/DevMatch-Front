import React, { useState, useEffect } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import axios from 'axios';

function Sidebar({ onSearch }) {
  const [location, setLocation] = useState('');
  const [allTechnologies, setAllTechnologies] = useState([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/users/technologies')
      .then(response => {
        setAllTechnologies(response.data.map(t => t.toLowerCase()));
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch technologies:", error);
        setLoading(false);
      });
  }, []);

  const handleTechChange = (tech) => {
    const techStr = tech.trim().toLowerCase();
    setSelectedTechnologies(prev =>
      prev.includes(techStr)
        ? prev.filter(t => t !== techStr)
        : [...prev, techStr]
    );
  };

  useEffect(() => {
    onSearch(location, selectedTechnologies);
  }, [location, selectedTechnologies, onSearch]);

  return (
    <div className="col-md-3 bg-light p-4" style={{ minHeight: '100vh' }}>
      <h5 className="mb-4 text-primary">Search Freelancers</h5>

      <Form.Group className="mb-3">
        <Form.Label>Location</Form.Label>
        <Form.Control
          type="text"
          placeholder="e.g., Cairo"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Technology</Form.Label>
        {loading ? (
          <Spinner animation="border" size="sm" />
        ) : allTechnologies.length > 0 ? (
          allTechnologies.map((tech, index) => (
            <Form.Check
              key={index}
              type="checkbox"
              label={tech}
              value={tech}
              checked={selectedTechnologies.includes(tech)}
              onChange={() => handleTechChange(tech)}
            />
          ))
        ) : (
          <div>No technologies found</div>
        )}
      </Form.Group>
    </div>
  );
}

export default Sidebar;
