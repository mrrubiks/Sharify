import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import MyNav from "./subcomponents/Nav";
import Post from "./subcomponents/Post";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button, Card, Container, Stack } from "react-bootstrap";
import { toast } from "react-toastify";

function SharePosts() {
  const copySuccessNotify = () =>
    toast.success("Link copied to your clipboard!");

  let { id } = useParams();
  const [uploadDate, setUploadDate] = useState(null);
  const [post, setPost] = useState(null);
  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/posts/${id}`, {
      withCredentials: true,
    }).then((response) => {
      setUploadDate(new Date(response.data.post.date).toLocaleDateString());
      setPost(response.data.post);
      //   console.log(response.data.post.upVotes);
    });
  }, []);
  return (
    <div>
      <MyNav />
      <Container style={{ marginTop: "50px" }}>
        <Row className="justify-content-center">
          <Col xs={12} md={6} lg={6} xl={6}>
            {Post(
              post
                ? post
                : {
                    title: "loading...",
                    description: "loading...",
                    preview: true,
                  }
            )}
          </Col>
          <Col xs={12} md={6} lg={4} xl={3}>
            <Stack gap={3}>
              <Card className="mt-auto">
                <Card.Header>
                  <h3>Author infomation</h3>
                </Card.Header>
                <Card.Body>
                  <Card.Text as="div">
                    <p>
                      Username: {post ? post.userId.username : "loading..."}
                    </p>
                    <p>Upload Time: {post ? uploadDate : "loading"}</p>
                  </Card.Text>
                </Card.Body>
              </Card>
              <Button
                variant="outline-primary"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  copySuccessNotify();
                }}
              >
                Copy Sharify Link to Clipboard
              </Button>
            </Stack>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SharePosts;
