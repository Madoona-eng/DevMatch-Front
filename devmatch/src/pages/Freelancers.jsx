import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import FreelancerCard from './FreelancerCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';

function FreelancersPage() {
  const [freelancers, setFreelancers] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/users')
      .then(res => {
        const onlyFreelancers = res.data.filter(user => user.role === 'programmer');
        setFreelancers(onlyFreelancers);
        setFiltered(onlyFreelancers);
      });
  }, []);

  // Now onSearch gets only location and selectedTechs
  const handleSearch = (location, selectedTechs) => {
    const result = freelancers.filter(user => {
      const matchesLocation = location
        ? user.location?.toLowerCase().includes(location.toLowerCase())
        : true;

      // Normalize user's technology field to array of lowercase strings
      let techArray = [];
      if (typeof user.technology === 'string') {
        techArray = user.technology.split(',').map(t => t.trim().toLowerCase());
      } else if (Array.isArray(user.technology)) {
        techArray = user.technology.map(t => String(t).trim().toLowerCase());
      }

      // Match ANY selected technology (OR condition)
      let matchesTech = true;
      if (selectedTechs.length > 0) {
        matchesTech = selectedTechs.some(st => techArray.includes(st));
      }

      return matchesLocation && matchesTech;
    });

    setFiltered(result);
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          <Sidebar onSearch={handleSearch} />
          <div className="col-md-9">
            <div className="row mt-3">
              {filtered.map(user => (
                <div key={user.id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                  <FreelancerCard user={user} />
                </div>
              ))}
              {filtered.length === 0 && <p className="text-muted">No freelancers found.</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FreelancersPage;
