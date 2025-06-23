import { Form, InputGroup, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FiSend } from 'react-icons/fi';
import { useState } from 'react';

export default function MessageInput({ onSend }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <Form onSubmit={handleSubmit}>
        <InputGroup className="mb-3 glass-card p-1">
          <Form.Control
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your broadcast message..."
            className="border-0 bg-transparent text-dark"
            style={{ outline: 'none', boxShadow: 'none' }}
          />
          <Button 
            variant="primary" 
            type="submit"
            disabled={!message.trim()}
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: '40px', height: '40px' }}
          >
            <FiSend size={18} />
          </Button>
        </InputGroup>
      </Form>
    </motion.div>
  );
}