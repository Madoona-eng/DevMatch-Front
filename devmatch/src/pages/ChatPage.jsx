import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../components/Sidebarchat';
import ChatMessage from '../components/ChatMessage';
import MessageInput from '../components/MessageInput';
import CommentSection from '../components/CommentSection';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiMessageCircle } from 'react-icons/fi';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Chatpage.css';
import Navbar from '../components/Navbar';
import { 
  createBroadcastMessage, 
  getBroadcastMessage, 
  getAllBroadcastMessages,
  createComment 
} from '../lib/axios.jsx';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const { data } = await getAllBroadcastMessages();
        setMessages(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading messages:', error);
        setLoading(false);
      }
    };
    loadMessages();
  }, []);

  const handleSendMessage = async (newMessage) => {
    try {
      const { data } = await createBroadcastMessage(newMessage);
      setMessages([...messages, data]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleAddComment = async (commentText) => {
    if (!selectedMessage) return;
    
    try {
      const { data: newComment } = await createComment(selectedMessage._id, commentText);
      
      const updatedMessages = messages.map(msg => {
        if (msg._id === selectedMessage._id) {
          return {
            ...msg,
            comments: [...msg.comments, newComment]
          };
        }
        return msg;
      });
      
      setMessages(updatedMessages);
      setSelectedMessage(updatedMessages.find(msg => msg._id === selectedMessage._id));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleSelectMessage = async (message) => {
    try {
      const { data } = await getBroadcastMessage(message._id);
      setSelectedMessage(data);
      setShowComments(true);
    } catch (error) {
      console.error('Error fetching message:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-5 text-primary">Loading messages...</div>;
  }

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
                <FiMessageCircle className="me-2" size={24} color="#0d6efd" />
                <h4 className="mb-0 text-primary">Broadcast Messages</h4>
              </div>
              
              <div className="messages-container flex-grow-1 mb-3">
                <AnimatePresence>
                  {messages.map(message => (
                    <ChatMessage 
                      key={message._id}
                      message={message}
                      isSelected={selectedMessage?._id === message._id}
                      onSelect={() => handleSelectMessage(message)}
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