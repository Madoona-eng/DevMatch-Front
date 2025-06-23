import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';

export default function AllJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axiosInstance.get('/jobs');
        setJobs(res.data);
      } catch (err) {
        setError('Failed to fetch jobs.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <div className="text-center mt-5">Loading jobs...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  return (
    <div className="container py-5">
      <h2 className="mb-4">All Jobs</h2>
      {jobs.length === 0 ? (
        <div>No jobs found.</div>
      ) : (
        <ul className="list-group">
          {jobs.map(job => (
            <li key={job._id} className="list-group-item">
              <strong>{job.title}</strong> - {job.specialization} ({job.governorate})
              <div>Status: {job.status}</div>
              <button className="btn btn-link p-0 ms-2" onClick={() => navigate(`/jobs/${job._id}`)}>
                View Details
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
