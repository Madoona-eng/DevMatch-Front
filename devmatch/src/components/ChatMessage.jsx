import { Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaComment } from 'react-icons/fa';

export default function ChatMessage({ message, isSelected, onSelect }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card 
        className={`mb-3 ${isSelected ? 'border-primary' : ''}`}
        onClick={onSelect}
      >
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <Card.Title className="text-primary">{message.user}</Card.Title>
              <Card.Text>{message.text}</Card.Text>
            </div>
            <div className="d-flex align-items-center">
              <small className="text-muted me-2">{message.time}</small>
              <FaComment 
                className={`text-${isSelected ? 'primary' : 'muted'}`} 
              />
              {message.comments.length > 0 && (
                <span className="badge bg-primary rounded-pill ms-1">
                  {message.comments.length}
                </span>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
}

