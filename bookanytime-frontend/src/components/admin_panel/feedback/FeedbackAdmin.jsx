import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Divider, Box   } from '@mui/material';
import { Container, Row, Col } from 'react-bootstrap';
import { Email, Phone, CalendarToday } from '@mui/icons-material';


const FeedbackAdmin = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/feedback/feedback-logs`)
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  if (users.length === 0) return <p>No users found.</p>;
  return (
    <Container className="my-4">
          <Typography
      variant="h5"
      className="mb-4 text-center"
      style={{ fontWeight: 'bold', color: '#333' }}
    >
      Feedback for Properties and Website
    </Typography>

      <Row className="g-3">
        {users.map(user => (
          <Col xs={12} md={6} lg={4} key={user._id}>
            <Card className="shadow-sm border-0 rounded-4" style={{ backgroundColor: "#fdfdfd" ,     boxShadow: "0 6px 18px rgba(0, 0, 0, 0.5)"
}}>
              <CardContent style={{ padding: '16px' }}>
                <Box mb={1}>
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    fontWeight={600}
                    sx={{ lineHeight: 1.2 }}
                  >
                    {user.username}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    className="d-flex align-items-center"
                    sx={{ fontSize: '0.75rem' }}
                  >
                    <CalendarToday sx={{ fontSize: 14, mr: 0.5 }} />
                    {new Date(user.createdAt).toLocaleString()}
                  </Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box mb={1}>
                  <Typography variant="body2" className="d-flex align-items-center" sx={{ fontSize: '0.85rem' }}>
                    <Email sx={{ fontSize: 16, mr: 0.5 }} />
                    {user.email}
                  </Typography>
                  <Typography variant="body2" className="d-flex align-items-center" sx={{ fontSize: '0.85rem' }}>
                    <Phone sx={{ fontSize: 16, mr: 0.5 }} />
                    {user.phone}
                  </Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box sx={{ maxHeight: 120, overflowY: 'auto' }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}
                  >
                    <strong>Feedback:</strong> {user.description}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};



export default FeedbackAdmin;
