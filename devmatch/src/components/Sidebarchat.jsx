import { useState, useEffect } from 'react';
import { Card, ListGroup, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FiUsers } from 'react-icons/fi';
import { axiosInstance } from '../lib/axios';

export default function Sidebar({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get(`/users?page=${pagination.page}&limit=${pagination.limit}`);
        const userList = Array.isArray(response.data?.users) ? response.data.users : [];
        setUsers(userList);
        setPagination(prev => ({
          ...prev,
          total: typeof response.data.total === 'number' ? response.data.total : userList.length
        }));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
        setLoading(false);
      }
    };
    fetchUsers();
  }, [pagination.page, pagination.limit]);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass-card h-100">
        <Card.Header className="bg-primary text-white border-0">
          <div className="d-flex align-items-center">
            <FiUsers className="me-2" size={20} />
            <h5 className="mb-0">Group Members</h5>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="d-flex justify-content-center p-4">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              <ListGroup variant="flush">
                {(users || []).map(user => (
                  <ListGroup.Item 
                    key={user._id}
                    className={`d-flex align-items-center ${user._id === currentUser?._id ? 'bg-light-primary' : ''}`}
                  >
                    <img 
                      src={user.avatar || '/default-avatar.png'} 
                      alt={user.name}
                      className="rounded-circle me-3"
                      width="32"
                      height="32"
                    />
                    <div>
                      <div className="fw-medium">{user.name}</div>
                      <small className="text-muted">{user.role}</small>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              {/* Pagination */}
              {pagination.total > pagination.limit && (
                <div className="p-3 border-top">
                  <nav>
                    <ul className="pagination pagination-sm justify-content-center mb-0">
                      <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => handlePageChange(pagination.page - 1)}
                        >
                          Previous
                        </button>
                      </li>
                      {Array.from({ length: Math.ceil(pagination.total / pagination.limit) }, (_, i) => (
                        <li key={i} className={`page-item ${pagination.page === i + 1 ? 'active' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => handlePageChange(i + 1)}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${pagination.page * pagination.limit >= pagination.total ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => handlePageChange(pagination.page + 1)}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </motion.div>
  );
}