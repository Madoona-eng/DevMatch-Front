import React, { useState, useEffect } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import axios from 'axios';

function Sidebar({ onSearch }) {
  const [location, setLocation] = useState('');
  const [allTechnologies, setAllTechnologies] = useState([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/users')
      .then(response => {
        const users = response.data;

        const techSet = new Set();
        users.forEach(user => {
          if (user.technology) {
            let techArray = [];
            if (typeof user.technology === 'string') {
              techArray = user.technology
                .split(',')
                .map(t => t.trim().toLowerCase());
            } else if (Array.isArray(user.technology)) {
              techArray = user.technology.map(t => t.trim().toLowerCase());
            }
            techArray.forEach(t => techSet.add(t));
          }
        });

        setAllTechnologies(Array.from(techSet));
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch users:", error);
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

  // Call onSearch whenever location or selectedTechnologies change
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
          placeholder="e.g., Minya"
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
