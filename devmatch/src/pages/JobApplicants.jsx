import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { fetchApplicants } from '../lib/recruiterApi';

export default function JobApplicants() {
  const { jobId } = useParams();
  const { isRecruiter } = useAuth();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isRecruiter) {
      navigate('/');
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const allApplicants = await fetchApplicants();
        setApplicants(allApplicants.filter(app => app.job_id === jobId));
      } catch (err) {
        setError('Failed to load applicants.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jobId, isRecruiter, navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container py-5">
      <h2>Applicants for Job</h2>
      {applicants.length === 0 ? (
        <div>No applicants yet.</div>
      ) : (
        <ul className="list-group">
          {applicants.map(app => (
            <li key={app._id} className="list-group-item">
              <strong>{app.applicant_id?.name || 'Unknown'}</strong> - {app.status}
              <div>Email: {app.applicant_id?.email}</div>
              <div>Cover Letter: {app.cover_letter}</div>
              <div>CV: {app.cv_url ? <a href={app.cv_url} target="_blank" rel="noopener noreferrer">View CV</a> : 'N/A'}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
