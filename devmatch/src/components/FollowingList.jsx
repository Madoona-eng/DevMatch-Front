import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import Pagination from './Pagination';
import { useAuthStore } from '../store/useAuthStore';
import { Card, Badge, Button, Row, Col, Image } from 'react-bootstrap';

const FollowingList = () => {
  const currentUser = useAuthStore(state => state.authUser);
  const setAuthUser = useAuthStore(state => state.setAuthUser);

  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 🌟 Rehydrate Zustand state from localStorage if missing
  useEffect(() => {
    const storedUser = localStorage.getItem('devmatch_user');
    if (storedUser && !currentUser) {
      const parsedUser = JSON.parse(storedUser);
      setAuthUser(parsedUser);
      console.log("✅ Rehydrated user from localStorage:", parsedUser);
    }
  }, [currentUser, setAuthUser]);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        setLoading(true);

        console.log('🔍 Current User:', currentUser);
        const token = localStorage.getItem('token');
        const url = `http://localhost:5000/api/follow/following?page=${page}`;
        console.log('📡 Request URL:', url);
        console.log('🔐 Auth Token:', token);

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('✅ Response Data:', response.data);

        setFollowing(response.data.follows || []);
        setTotalPages(response.data.pages || 1);

        console.log('📦 Loaded Users:', response.data.follows);
        console.log('📄 Total Pages:', response.data.pages);
      } catch (error) {
        console.error('❌ Error fetching following:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?._id || currentUser?.id) {
      fetchFollowing();
    } else {
      console.warn('⚠️ No authenticated user found!');
    }
  }, [currentUser, page]);

  if (loading) {
    return <div className="text-center my-5">Loading followed users...</div>;
  }

  if (following.length === 0) {
    return (
      <div className="text-center my-5">
        <h4>You're not following anyone yet</h4>
        <p className="text-muted">Start following users to see them here</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-12">
          <h3 className="fw-bold mb-4" style={{ color: '#3A86FF' }}>
            Users You Follow
          </h3>
        </div>
      </div>

      <div className="row">
        {following.map((user) => (
          <div key={user._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 border-0 shadow-sm rounded-4">
              <div className="card-body">
                <div className="d-flex align-items-start gap-3 mb-3">
                  <img
                    src={user.image || '/profile.jpg'}
                    alt={user.name}
                    className="rounded-circle"
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                  />
                  <div>
                    <h5 className="mb-1">
                      <Link
                        to={`/FreelancerProfile/${user._id}`}
                        className="text-decoration-none"
                        style={{ color: '#3A86FF' }}
                      >
                        {user.name}
                      </Link>
                    </h5>
                    {user.location && (
                      <p className="text-muted small mb-1">
                        <MapPin size={14} className="me-1" />
                        {user.location}
                      </p>
                    )}
                    {user.technology && user.technology.length > 0 && (
                      <div className="d-flex flex-wrap gap-1 mt-2">
                        {user.technology.slice(0, 3).map((tech, index) => (
                          <span
                            key={index}
                            className="badge rounded-pill bg-light text-dark border"
                            style={{ fontSize: '0.75rem' }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="d-flex justify-content-end">
                  <Link
                    to={`/FreelancerProfile/${user._id}`}
                    className="btn btn-sm btn-outline-primary"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="row mt-4">
          <div className="col-12 d-flex justify-content-center">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowingList;
