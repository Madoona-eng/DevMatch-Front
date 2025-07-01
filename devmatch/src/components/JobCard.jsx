import React from 'react';
import '../styles/AllJobs.css';

export default function JobCard({ job, onViewDetails }) {
  return (
    <div className="all-job-card shadow-lg position-relative">
      <div className="d-flex align-items-center mb-3">
        <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-3" style={{ width: 48, height: 48 }}>
          <i className="bi bi-briefcase text-primary" style={{ fontSize: '1.5rem' }}></i>
        </div>
        <div>
          <div className="all-job-title mb-1">{job.title}</div>
          <div className="text-muted small">{job.specialization}</div>
        </div>
      </div>
      <div className="all-job-desc mb-3">{job.description?.substring(0, 140)}{job.description?.length > 140 ? '...' : ''}</div>
      <div className="all-job-meta mb-2">
        <span><i className="bi bi-geo-alt me-1"></i> {job.governorate}</span>
        <span className="all-job-badge">{job.status}</span>
        <span className="text-muted"><i className="bi bi-calendar me-1"></i> {job.created_at ? new Date(job.created_at).toLocaleDateString() : ''}</span>
      </div>
      <div className="all-job-actions d-flex justify-content-end">
        <button className="btn btn-primary rounded-pill px-4 py-2" onClick={() => onViewDetails(job._id)}>
          <i className="bi bi-eye me-2"></i> View Details
        </button>
      </div>
    </div>
  );
}
