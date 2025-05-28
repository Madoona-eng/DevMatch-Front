import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Container, Navbar as BSNavbar, Nav } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiHome } from 'react-icons/fi';

export default function Navbar() {
  return (
    <BSNavbar bg="dark" variant="dark" expand="lg" className="glass-card">
      <Container>
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <BSNavbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center">
            <FiMessageSquare className="me-2" />
            <span className="gradient-text">ModernChat</span>
          </BSNavbar.Brand>
        </motion.div>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="d-flex align-items-center">
              <FiHome className="me-1" /> Home
            </Nav.Link>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Nav.Link as={Link} to="/chat" className="btn btn-primary ms-2">
                Start Chatting
              </Nav.Link>
            </motion.div>
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}