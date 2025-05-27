import { Form, InputGroup, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { IoSend } from 'react-icons/io5';
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
        <InputGroup className="mb-3">
          <Form.Control
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <Button 
            variant="primary" 
            type="submit"
            disabled={!message.trim()}
          >
            <IoSend />
          </Button>
        </InputGroup>
      </Form>
    </motion.div>
  );
}