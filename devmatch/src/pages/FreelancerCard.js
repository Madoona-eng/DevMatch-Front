import React from 'react';
import { Card, Badge, Button, Row, Col, Image } from 'react-bootstrap';
import { FaMapMarkerAlt, FaLaptopCode, FaBriefcase } from 'react-icons/fa';

function FreelancerCard({ user }) {
  return (
    <Card className="h-100 shadow-sm border-0 rounded-4">
      <Card.Body>
        <Row className="align-items-center">
          <Col xs={4} className="text-center">
            {user.image ? (
              <Image
                src={user.image}
                roundedCircle
                fluid
                style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                className="mb-3"
              />
            ) : (
              <FaBriefcase size={70} className="text-secondary mb-3" />
            )}
            <Badge bg="success" className="text-uppercase">{user.role}</Badge>
          </Col>
          <Col xs={8}>
            <Card.Title className="text-primary fs-5 mb-1">{user.name}</Card.Title>

            <div className="mb-2 text-dark small">
              <FaMapMarkerAlt className="me-2 text-danger" />
              {user.location}
            </div>

      <div className="mb-2 text-dark small">
  <FaLaptopCode className="me-2 text-info" />
  {Array.isArray(user.technology) ? user.technology.join(' | ') : user.technology}
</div>


            <div className="mb-2 text-dark small">
              <FaBriefcase className="me-2 text-warning" />
              {user.experience} years experience
            </div>

            {user.cv_url && (
              <Button
                href={user.cv_url}
                target="_blank"
                variant="outline-primary"
                size="sm"
                className="mt-2 me-2"
              >
                View CV
              </Button>
            )}

            {/* View Profile Button */}
            <Button
              href={`/FreelancerProfile/${user.id}`} // or any routing logic
              variant="primary"
              size="sm"
              className="mt-2"
            >
              View Profile
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default FreelancerCard;
