import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  MapPin,
  Briefcase,
  CalendarDays,
  FileText,
  User,
  Heart,
  Quote
} from 'lucide-react';

const FreelancerProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false); // follow button state

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/users/${id}`)
      .then((response) => setUser(response.data))
      .catch((error) => console.error('Error fetching user:', error));
  }, [id]);

  const handleFollowToggle = () => {
    setIsFollowing((prev) => !prev);

    // Optional API call
    // axios.post(`http://localhost:8000/users/${id}/follow`, { follow: !isFollowing })
    //   .then(res => console.log(res.data))
    //   .catch(err => console.error(err));
  };

  if (!id) {
    return <p className="text-center my-5 text-danger">No user ID provided in the URL. Please select a freelancer from the list.</p>;
  }

  if (!user)
    return <p className="text-center my-5">Loading user profile...</p>;

  return (
    <>
      <Navbar />
    <div className="container my-5">
      {/* Header Banner */}
      <div
        className="rounded-4 text-white mb-0 shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #3A86FF, #4361EE)',
          padding: '3rem 1rem',
        }}
      >
        <div className="d-flex flex-column align-items-center position-relative text-center">
          <img
            src={user.image || '/profile.jpg'}
            alt="Profile"
            className="rounded-circle border border-3 border-white shadow"
            style={{ width: '140px', height: '140px', objectFit: 'cover' }}
          />
          <h3 className="mt-3 mb-1 fw-bold">{user.name}</h3>

          {user.technology?.length > 0 && (
            <div className="text-light mb-1 d-flex flex-wrap justify-content-center align-items-center">
              <User size={16} className="me-1" />
              {user.technology.map((tech, index) => (
                <span key={index} className="mx-1 small text-white-50">
                  {tech}
                  {index < user.technology.length - 1 && <span className="mx-1">|</span>}
                </span>
              ))}
            </div>
          )}

          <p className="text-light">
            <MapPin size={16} className="me-1" /> {user.location}
          </p>

          {/* Follow Button */}
          <button
            onClick={handleFollowToggle}
            className={`btn position-absolute top-0 end-0 m-3 d-flex align-items-center shadow-sm ${
              isFollowing ? 'btn-danger text-white' : 'btn-light'
            }`}
            style={{ transition: '0.3s ease', borderRadius: '20px' }}
            aria-label={isFollowing ? 'Unfollow Freelancer' : 'Follow Freelancer'}
            title={isFollowing ? 'Unfollow' : 'Follow'}
          >
            <Heart
              size={16}
              className={`me-1 ${
                isFollowing ? 'text-white fill-current' : 'text-danger'
              }`}
            />
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="mx-auto" style={{ maxWidth: '960px', marginTop: '-30px' }}>
        <div className="card shadow border-0 p-4 rounded-4">
          {/* About Me */}
          <h5 className="fw-bold mb-3 text-primary">About Me</h5>
          <div
            className="p-3 border-start border-3 rounded bg-light-subtle d-flex align-items-start gap-2"
            style={{ fontStyle: 'italic' }}
          >
            <Quote size={18} className="text-secondary mt-1" />
            <span>{user.aboutMe}</span>
          </div>

          {/* Experience & Date */}
          <div className="row mt-4">
            <div className="col-md-6 mb-2">
              <Briefcase className="me-2 text-secondary" size={18} />
              <strong>Experience:</strong> {user.experience} years
            </div>
            <div className="col-md-6 mb-2">
              <CalendarDays className="me-2 text-secondary" size={18} />
              <strong>Registered:</strong>{' '}
              {new Date(user.registration_date).toLocaleDateString()}
            </div>
          </div>

          {/* Skills */}
          {user.skills && (
            <div className="mt-4">
              <h6 className="fw-bold text-primary">Skills</h6>
              <div className="d-flex flex-wrap gap-2">
                {user.skills.split(',').map((skill, index) => (
                  <span
                    key={index}
                    className="badge rounded-pill bg-primary-subtle text-primary border border-primary"
                    title={skill.trim()}
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Technologies */}
          {user.technology && user.technology.length > 0 && (
            <div className="mt-4">
              <h6 className="fw-bold text-primary">Technologies</h6>
              <div className="d-flex flex-wrap gap-2">
                {user.technology.map((tech, index) => (
                  <span
                    key={index}
                    className="badge rounded-pill bg-light text-dark border"
                    title={tech}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CV Button */}
          {user.cv_url && (
            <div className="mt-4">
              <a
                href={user.cv_url}
                className="btn btn-outline-primary d-inline-flex align-items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText size={18} className="me-2" />
                View CV
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default FreelancerProfile;
