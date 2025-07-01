import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { showErrorToast } from '../lib/toast';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { editJob, fetchRecruiterJobs } from '../lib/recruiterApi';

export default function EditJob() {
  const { id } = useParams();
  const { isRecruiter } = useAuth();
  const [form, setForm] = useState({ title: '', description: '', specialization: '', governorate: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isRecruiter) {
      navigate('/');
      return;
    }
    const fetchJob = async () => {
      setLoading(true);
      try {
        const jobs = await fetchRecruiterJobs();
        const job = jobs.find(j => j._id === id);
        if (!job) throw new Error('Job not found');
        setForm({
          title: job.title,
          description: job.description,
          specialization: job.specialization,
          governorate: job.governorate
        });
      } catch (err) {
        setError('Failed to load job.');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, isRecruiter, navigate]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await editJob(id, form);
      toast.success('Job updated!');
      navigate('/recruiter-dashboard');
    } catch (err) {
      setError('Failed to update job.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) {
    showErrorToast(error);
    return <ToastContainer />;
  }

  return (
    <div className="container py-5">
      <h2>Edit Job</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Title</label>
          <input name="title" value={form.title} onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-3">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-3">
          <label>Specialization</label>
          <input name="specialization" value={form.specialization} onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-3">
          <label>Governorate</label>
          <input name="governorate" value={form.governorate} onChange={handleChange} className="form-control" />
        </div>
        <button type="submit" className="btn btn-primary">Save</button>
      </form>
    </div>
  );
}
