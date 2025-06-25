import { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import Sidebar from '../components/Sidebarchat';
import ChatMessage from '../components/ChatMessage';
import MessageInput from '../components/MessageInput';
import CommentSection from '../components/CommentSection';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiMessageCircle } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Chatpage.css';
import {
  fetchMessages,
  createMessage,
  updateMessage,
  deleteMessage,
  createComment,
  updateComment,
  deleteComment
} from '../lib/axios.jsx';
import { useAuthStore } from '../store/useAuthStore.jsx';

export default function ChatPage() {
  const [allMessages, setAllMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  const currentUser = useAuthStore(state => state.authUser);
  const isCheckingAuth = useAuthStore(state => state.isCheckingAuth);

  // ✅ Stop checking auth when authUser is known (either null or user)
  useEffect(() => {
    if (currentUser !== undefined) {
      useAuthStore.setState({ isCheckingAuth: false });
    }
  }, [currentUser]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const { data } = await fetchMessages();
        const msgList = Array.isArray(data) ? data : (Array.isArray(data?.messages) ? data.messages : []);
        const normalized = msgList.map(msg => {
          const user = msg.user || {};
          return {
            ...msg,
            user: {
              ...user,
              id: user._id || user.id
            },
            comments: msg.comments || [],
          };
        });

        setAllMessages(normalized);
        setPagination(prev => ({
          ...prev,
          total: normalized.length
        }));
        setLoading(false);
      } catch (error) {
        console.error('Error loading messages:', error);
        toast.error('Failed to load messages');
        setAllMessages([]);
        setLoading(false);
      }
    };
    loadMessages();
  }, []);

  useEffect(() => {
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    setMessages(allMessages.slice(start, end));
  }, [allMessages, pagination.page, pagination.limit]);

  const handleSendMessage = async (newMessage) => {
    try {
      const { data } = await createMessage(newMessage);
      const updatedAll = [{
        ...data,
        user: {
          ...(data.user || {}),
          id: data.user?._id || data.user?.id
        }
      }, ...allMessages];

      setAllMessages(updatedAll);
      const start = (pagination.page - 1) * pagination.limit;
      setMessages(updatedAll.slice(start, start + pagination.limit));
      setPagination(prev => ({ ...prev, total: updatedAll.length }));
      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleEditMessage = async (messageId, newText) => {
    try {
      const { data } = await updateMessage(messageId, newText);
      const updatedAll = allMessages.map(msg =>
        msg._id === messageId ? {
          ...data,
          comments: msg.comments || [],
          user: {
            ...(data.user || {}),
            id: data.user?._id || data.user?.id
          }
        } : msg
      );

      setAllMessages(updatedAll);
      const start = (pagination.page - 1) * pagination.limit;
      setMessages(updatedAll.slice(start, start + pagination.limit));

      if (selectedMessage?._id === messageId) {
        setSelectedMessage({
          ...data,
          comments: selectedMessage.comments || [],
          user: {
            ...(data.user || {}),
            id: data.user?._id || data.user?.id
          }
        });
      }
      toast.success('Message updated successfully');
    } catch (error) {
      console.error('Error updating message:', error);
      toast.error('Failed to update message');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteMessage(messageId);
        const updatedAll = allMessages.filter(msg => msg._id !== messageId);
        setAllMessages(updatedAll);
        const start = (pagination.page - 1) * pagination.limit;
        setMessages(updatedAll.slice(start, start + pagination.limit));
        setPagination(prev => ({ ...prev, total: updatedAll.length }));
        if (selectedMessage?._id === messageId) {
          setSelectedMessage(null);
          setShowComments(false);
        }
        toast.success('Message deleted successfully');
      } catch (error) {
        console.error('Error deleting message:', error);
        toast.error('Failed to delete message');
      }
    }
  };

  const handleAddComment = async (commentText) => {
    if (!selectedMessage) return;
    try {
      const { data: newComment } = await createComment(selectedMessage._id, commentText);
      const updateMsg = msg =>
        msg._id === selectedMessage._id
          ? { ...msg, comments: [...(msg.comments || []), newComment] }
          : msg;

      const updatedAll = allMessages.map(updateMsg);
      setAllMessages(updatedAll);
      const start = (pagination.page - 1) * pagination.limit;
      setMessages(updatedAll.slice(start, start + pagination.limit));
      setSelectedMessage(updateMsg(selectedMessage));
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleEditComment = async (commentId, newText) => {
    try {
      const { data: updatedComment } = await updateComment(commentId, newText);
      const updateMsg = msg =>
        msg._id === selectedMessage._id
          ? {
            ...msg,
            comments: (msg.comments || []).map(comment =>
              comment._id === commentId ? updatedComment : comment
            )
          }
          : msg;

      const updatedAll = allMessages.map(updateMsg);
      setAllMessages(updatedAll);
      const start = (pagination.page - 1) * pagination.limit;
      setMessages(updatedAll.slice(start, start + pagination.limit));
      setSelectedMessage(updateMsg(selectedMessage));
      toast.success('Comment updated successfully');
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(commentId);
        const updateMsg = msg =>
          msg._id === selectedMessage._id
            ? {
              ...msg,
              comments: (msg.comments || []).filter(comment => comment._id !== commentId)
            }
            : msg;

        const updatedAll = allMessages.map(updateMsg);
        setAllMessages(updatedAll);
        const start = (pagination.page - 1) * pagination.limit;
        setMessages(updatedAll.slice(start, start + pagination.limit));
        setSelectedMessage(updateMsg(selectedMessage));
        toast.success('Comment deleted successfully');
      } catch (error) {
        console.error('Error deleting comment:', error);
        toast.error('Failed to delete comment');
      }
    }
  };

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
    setShowComments(true);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  if (isCheckingAuth || loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Container fluid className="chat-page py-3">
        <Row className="g-3">
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

          <Col xs={12} md={showComments ? 6 : 9}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="h-100 d-flex flex-column"
            >
              <div className="d-flex align-items-center mb-3">
                <FiMessageCircle className="me-2" size={24} color="#0d6efd" />
                <h4 className="mb-0 text-primary">Group Chat</h4>
              </div>

              <div className="messages-container flex-grow-1 mb-3">
                <AnimatePresence>
                  {messages.map(message => (
                    <ChatMessage
                      key={message._id}
                      message={message}
                      isSelected={selectedMessage?._id === message._id}
                      onSelect={() => handleSelectMessage(message)}
                      onEdit={handleEditMessage}
                      onDelete={handleDeleteMessage}
                      currentUserId={currentUser?.id}
                    />
                  ))}
                </AnimatePresence>

                <div className="d-flex justify-content-center mt-3">
                  <nav>
                    <ul className="pagination">
                      <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(pagination.page - 1)}>Previous</button>
                      </li>
                      {Array.from({ length: Math.ceil(pagination.total / pagination.limit) }, (_, i) => (
                        <li key={i} className={`page-item ${pagination.page === i + 1 ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                        </li>
                      ))}
                      <li className={`page-item ${pagination.page * pagination.limit >= pagination.total ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(pagination.page + 1)}>Next</button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>

              <MessageInput onSend={handleSendMessage} />
            </motion.div>
          </Col>

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
                    onEditComment={handleEditComment}
                    onDeleteComment={handleDeleteComment}
                    currentUserId={currentUser?.id}
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
