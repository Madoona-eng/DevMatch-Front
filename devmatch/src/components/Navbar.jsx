import { Link } from 'react-router-dom';
import { Container, Navbar as BSNavbar, Nav } from 'react-bootstrap';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <BSNavbar bg="primary" variant="dark" expand="lg">
      <Container>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <BSNavbar.Brand as={Link} to="/" className="fw-bold">
            GroupChat App
          </BSNavbar.Brand>
        </motion.div>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/chat">Chat</Nav.Link>
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}