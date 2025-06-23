import { axiosInstance } from './axios';

// Fetch recruiter profile
export const fetchRecruiterProfile = async(token) => {
    const res = await axiosInstance.get('/profile/recruiter', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.user;
};

// Edit recruiter profile (with optional image upload)
export const editRecruiterProfile = async(profileData, token) => {
    const formData = new FormData();
    Object.entries(profileData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, value);
    });
    const res = await axiosInstance.put('/profile/recruiter', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data.user;
};

// Post a new job
export const postJob = async(jobData, token) => {
    const res = await axiosInstance.post('/jobs', jobData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.job;
};

// Fetch all jobs posted by recruiter
export const fetchRecruiterJobs = async(token) => {
    const res = await axiosInstance.get('/jobs', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

// Edit a job
export const editJob = async(jobId, jobData, token) => {
    const res = await axiosInstance.put(`/jobs/${jobId}`, jobData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.job;
};

// Delete a job
export const deleteJob = async(jobId, token) => {
    const res = await axiosInstance.delete(`/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

// Fetch all applicants for recruiter's jobs
export const fetchApplicants = async(token) => {
    const res = await axiosInstance.get('/applications/recruiter', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

// Accept an application
export const acceptApplication = async(applicationId, token) => {
    const res = await axiosInstance.put(`/applications/accept/${applicationId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};