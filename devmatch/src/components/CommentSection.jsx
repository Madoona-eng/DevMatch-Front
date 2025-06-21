import { Card, Button, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { FiX, FiSend } from 'react-icons/fi';
import { InputGroup } from 'react-bootstrap';

export default function CommentSection({ comments, onAddComment, onClose }) {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText('');
    }
  };

  return (
    <Card className="h-100 glass-card">
      <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white border-0">
        <Card.Title className="mb-0">Comments</Card.Title>
        <Button 
          variant="link" 
          onClick={onClose}
          className="text-white p-0"
        >
          <FiX size={20} />
        </Button>
      </Card.Header>
      
      <Card.Body className="comments-body">
        {comments.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted">No comments yet</p>
            <small className="text-muted">Be the first to comment</small>
          </div>
        ) : (
          comments.map(comment => (
            <motion.div
              key={comment._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-3 p-3 bg-light rounded"
            >
              <div className="d-flex align-items-start">
                <img 
                  src={comment.avatar} 
                  alt={comment.user}
                  className="rounded-circle me-3"
                  width="32"
                  height="32"
                />
                <div>
                  <div className="d-flex justify-content-between">
                    <strong className="text-primary">{comment.user}</strong>
                    <small className="text-muted">{comment.time}</small>
                  </div>
                  <p className="mb-0 text-dark">{comment.text}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </Card.Body>
      
      <Card.Footer className="border-0">
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Form.Control
              as="textarea"
              rows={2}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="border-0 bg-light"
              style={{ resize: 'none' }}
            />
            <Button 
              variant="primary" 
              type="submit" 
              className="rounded-circle ms-2"
              style={{ width: '40px', height: '40px' }}
              disabled={!commentText.trim()}
            >
              <FiSend size={16} />
            </Button>
          </InputGroup>
        </Form>
      </Card.Footer>
    </Card>
  );
}