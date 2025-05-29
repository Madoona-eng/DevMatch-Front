import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import ChatMessage from '../components/ChatMessage';
import MessageInput from '../components/MessageInput';
import CommentSection from '../components/CommentSection';
import { motion, AnimatePresence } from 'framer-motion';
import { chatData } from '../utils/chatData';
import { FiUsers, FiMessageCircle } from 'react-icons/fi';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Chatpage.css';
import Navbar from '../components/Navbar'; // Adjust the path if needed

export default function ChatPage() {
  const [messages, setMessages] = useState(chatData);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showComments, setShowComments] = useState(false);

  const handleSendMessage = (newMessage) => {
    setMessages([...messages, {
      id: messages.length + 1,
      user: 'You',
      avatar: 'https://i.pravatar.cc/150?img=5',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      comments: []
    }]);
  };

  const handleAddComment = (commentText) => {
    if (!selectedMessage) return;
    
    const updatedMessages = messages.map(msg => {
      if (msg.id === selectedMessage.id) {
        return {
          ...msg,
          comments: [
            ...msg.comments,
            {
              id: msg.comments.length + 1,
              user: 'You',
              avatar: 'https://i.pravatar.cc/150?img=5',
              text: commentText,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
      }
      return msg;
    });
    
    setMessages(updatedMessages);
    setSelectedMessage(updatedMessages.find(msg => msg.id === selectedMessage.id));
  };

  return (
    <>
      <Navbar /> 
    <Container fluid className="chat-page py-3">
      <Row className="g-3">
        {/* Sidebar Column */}
        <Col md={3} className="d-none d-md-block">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="h-100"
          >
            <Sidebar />
          </motion.div>
        </Col>
        
        {/* Main Chat Column */}
        <Col xs={12} md={showComments ? 6 : 9}>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-100 d-flex flex-column"
          >
            <div className="d-flex align-items-center mb-3">
              <FiMessageCircle className="me-2" size={24} />
              <h4 className="mb-0">Group Chat</h4>
            </div>
            
            <div className="messages-container flex-grow-1 mb-3">
              <AnimatePresence>
                {messages.map(message => (
                  <ChatMessage 
                    key={message.id}
                    message={message}
                    isSelected={selectedMessage?.id === message.id}
                    onSelect={() => {
                      setSelectedMessage(message);
                      setShowComments(true);
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>
            
            <MessageInput onSend={handleSendMessage} />
          </motion.div>
        </Col>
        
        {/* Comments Column */}
        <AnimatePresence>
          {showComments && (
            <Col xs={12} md={3} className="mt-md-0 mt-3">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="h-100"
              >
                <CommentSection 
                  comments={selectedMessage?.comments || []}
                  onAddComment={handleAddComment}
                  onClose={() => setShowComments(false)}
                />
              </motion.div>
            </Col>
          )}
        </AnimatePresence>
      </Row>
    </Container>
        </>

  );
}