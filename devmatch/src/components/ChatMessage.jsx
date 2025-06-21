import { Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaComment, FaRegComment } from 'react-icons/fa';
import { FiMoreVertical } from 'react-icons/fi';

export default function ChatMessage({ message, isSelected, onSelect }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
      className="mb-3"
    >
      <Card 
        className={`glass-card ${isSelected ? 'border-primary' : ''}`}
        onClick={onSelect}
      >
        <Card.Body>
          <div className="d-flex">
            <img 
              src={message.avatar} 
              alt={message.user}
              className="rounded-circle me-3"
              width="40"
              height="40"
            />
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <Card.Title className="mb-0 text-primary">{message.user}</Card.Title>
                <div className="d-flex align-items-center">
                  <small className="text-muted me-2">{message.time}</small>
                  <button className="btn btn-sm btn-link text-primary p-0">
                    <FiMoreVertical size={16} />
                  </button>
                </div>
              </div>
              <Card.Text className="text-dark mb-2">{message.text}</Card.Text>
              <div className="d-flex align-items-center">
                {message.comments?.length > 0 ? (
                  <FaComment className="text-primary me-1" />
                ) : (
                  <FaRegComment className="text-muted me-1" />
                )}
                <small className={message.comments?.length > 0 ? 'text-primary' : 'text-muted'}>
                  {message.comments?.length || 0} {message.comments?.length === 1 ? 'comment' : 'comments'}
                </small>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
}