import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import ChatMessage from '../components/ChatMessage';
import MessageInput from '../components/MessageInput';
import CommentSection from '../components/CommentSection';
import { motion } from 'framer-motion';
import { chatData } from '../utils/chatData';

export default function ChatPage() {
  const [messages, setMessages] = useState(chatData);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showComments, setShowComments] = useState(false);

  const handleSendMessage = (newMessage) => {
    setMessages([...messages, {
      id: messages.length + 1,
      user: 'You',
      text: newMessage,
      time: new Date().toLocaleTimeString(),
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
              text: commentText,
              time: new Date().toLocaleTimeString()
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
    <Container fluid className="chat-page">
      <Row className="g-0">
        <Col md={3} className="sidebar-col">
          <Sidebar />
        </Col>
        
        <Col md={6} className="main-chat-col">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="chat-container"
          >
            <div className="messages-container">
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
            </div>
            
            <MessageInput onSend={handleSendMessage} />
          </motion.div>
        </Col>
        
        <Col md={3} className="comments-col">
          {showComments && selectedMessage && (
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className="comments-container"
            >
              <CommentSection 
                comments={selectedMessage.comments}
                onAddComment={handleAddComment}
                onClose={() => setShowComments(false)}
              />
            </motion.div>
          )}
        </Col>
      </Row>
    </Container>
  );
}