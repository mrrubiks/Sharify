import React from "react";
import Axios from "axios";
import { toast } from "react-toastify";
// Can also import Contaner from "react-bootstrap/Container"
// You can reduce the code sent to the browser by importing only the components you need
// But this is a shorter way to do it
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";

function Login() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  function handleSubmit(event) {
    event.preventDefault();
    Axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/login`,
      { username: username, password: password },
      { withCredentials: true }
    )
      .then((response) => {
        if (response.status === 200) {
          window.location.href = process.env.REACT_APP_FRONTEND_URL + "/posts";
        } else if (response.status === 201) {
          toast.warn("You are already logged in");
        }
      })
      .catch((error) => {
        if (error.response.status === 401)
          toast.error("Invalid username or password");
        else toast.error("Something went wrong");
      });

    setUsername("");
    setPassword("");
  }
  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col sm={6}>
          <Card>
            <Card.Header>
              <h3>Login</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="username">Username</Form.Label>
                  <Form.Control
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.currentTarget.value);
                    }}
                    placeholder="Enter username"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="password">Password</Form.Label>
                  <Form.Control
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.currentTarget.value);
                    }}
                    placeholder="Enter password"
                  />
                </Form.Group>
                <div className="d-grid gap-2">
                  <Button variant="secondary" type="submit">
                    {" "}
                    Login{" "}
                  </Button>
                </div>
                <p style={{ textAlign: "center", padding: "10px 0px 0px 0px" }}>
                  Don't have an account?{" "}
                  <a href={process.env.REACT_APP_FRONTEND_URL + "/register"}>
                    Register here
                  </a>
                </p>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={4} style={{ textAlign: "center" }}>
          <Card>
            <Card.Body>
              <Button
                variant="block"
                as="a"
                href={process.env.REACT_APP_BACKEND_URL + "/oauth/google"}
              >
                <i className="fab fa-google"></i>
                Sign In with Google
              </Button>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <Button
                variant="block"
                as="a"
                href={process.env.REACT_APP_BACKEND_URL + "/oauth/github"}
              >
                <i className="fab fa-github"></i>
                Sign In with Github
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
