
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import { showErrorToast } from '../lib/toast';
import { ToastContainer } from 'react-toastify';
import Pagination from '../components/Pagination';

import JobCard from '../components/JobCard';
import '../styles/AllJobs.css';

export default function AllJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;
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

  // Reset to first page if jobs list changes and currentPage is out of range
  useEffect(() => {
    const totalPages = Math.ceil(jobs.length / jobsPerPage);
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [jobs, jobsPerPage, currentPage]);

  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const paginatedJobs = jobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  if (loading) return <div className="text-center mt-5">Loading jobs...</div>;
  if (error) {
    showErrorToast(error);
    return <ToastContainer />;
  }

  return (
    <div className="container py-5">
      <ToastContainer />
      <h2 className="mb-4">All Jobs</h2>
      {jobs.length === 0 ? (
        <div>No jobs found.</div>
      ) : (
        <>
          <div className="all-jobs-list">
            {paginatedJobs.map(job => (
              <JobCard key={job._id} job={job} onViewDetails={(id) => navigate(`/jobs/${id}`)} />
            ))}
          </div>
          {jobs.length > jobsPerPage && (
            <div className="alljobs-pagination mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={page => {
                  if (page >= 1 && page <= totalPages && page !== currentPage) {
                    setCurrentPage(page);
                  }
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
