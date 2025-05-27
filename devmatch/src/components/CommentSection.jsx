import { Card, Button, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useState } from 'react';

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
    <Card className="h-100">
      <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
        <Card.Title className="mb-0">Comments</Card.Title>
        <Button variant="light" size="sm" onClick={onClose}>
          ×
        </Button>
      </Card.Header>
      
      <Card.Body className="comments-body">
        {comments.length === 0 ? (
          <p className="text-muted">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-3 p-2 border-bottom"
            >
              <div className="d-flex justify-content-between">
                <strong className="text-primary">{comment.user}</strong>
                <small className="text-muted">{comment.time}</small>
              </div>
              <p className="mb-0">{comment.text}</p>
            </motion.div>
          ))
        )}
      </Card.Body>
      
      <Card.Footer>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Control
              as="textarea"
              rows={2}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
            />
          </Form.Group>
          <Button 
            variant="primary" 
            type="submit" 
            className="mt-2 w-100"
            disabled={!commentText.trim()}
          >
            Post Comment
          </Button>
        </Form>
      </Card.Footer>
    </Card>
  );
}