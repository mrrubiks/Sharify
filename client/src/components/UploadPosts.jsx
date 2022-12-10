import MyNav from "./subcomponents/Nav";
import { useEffect, useState } from "react";
import Axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FileUploader } from "react-drag-drop-files";
import { Stack } from "react-bootstrap";
import { toast } from "react-toastify";

import Post from "./subcomponents/Post";
const fileTypes = ["JPG", "SVG", "PNG", "GIF"];

function UploadPosts({ socket }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imgURL, setImageURL] = useState("");
  const [uploadType, setUploadType] = useState("url");
  const [file, setFile] = useState(null);
  const handleFileChange = (file) => {
    setFile(file);
    const formData = new FormData();
    formData.append("image", file, file.name);
    Axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/file/upload`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          toast.success("Image uploaded!");
          setImageURL(
            process.env.REACT_APP_BACKEND_URL +
              "/api/file/img/" +
              response.data.imageHash
          );
        }
      })
      .catch((error) => {
        if (error.response.status === 401)
          toast.error("You need to be logged in to upload images");
        else toast.error("Something went wrong");
      });
  };
  Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/isAuthenticated`, {
    withCredentials: true,
  }).then((response) => {
    if (!response.data.isAuthenticated) {
      toast.error("You need to be logged in to upload posts");
      window.location.href = "/login";
    }
  });

  function handleSubmit(e) {
    e.preventDefault();
    Axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/posts`,
      { title: title, description: description, imgURL: imgURL },
      { withCredentials: true }
    )
      .then((response) => {
        if (response.status === 200) {
          toast.success("Post uploaded!");
          window.location.href = "/";
        }
      })
      .catch((error) => {
        if (error.response.status === 401)
          toast.error("You need to be logged in to post");
        else toast.error("Something went wrong");
      });
  }

  return (
    <>
      <MyNav />
      <Container className="mt-5">
        <h1> Post and share! </h1>
        <Row className="justify-content-center">
          <Col sm={12} lg={8} md={8} xxl={8}>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="title">
                <Form.Label>Enter title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter title"
                  required={true}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.currentTarget.value);
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Enter description</Form.Label>
                <Form.Control
                  as={"textarea"}
                  type="text"
                  placeholder="Enter description"
                  required={true}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.currentTarget.value);
                  }}
                />
                <Form.Text className="text-muted">
                  Please enter a description of your post. Do not exceed 100
                  characters.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="title">
                {uploadType === "url" ? (
                  <>
                    <Form.Label>Enter Internet image URL</Form.Label>
                    <Stack direction="horizontal" gap={3}>
                      <Col xs={9}>
                        <Form.Control
                          type="text"
                          placeholder="Paste your image URL here"
                          required={true}
                          value={imgURL}
                          onChange={(e) => {
                            setImageURL(e.currentTarget.value);
                          }}
                        />
                      </Col>
                      <Col className="ms-auto" xs="auto">
                        <Button
                          variant="outline-primary"
                          onClick={() => {
                            setUploadType("local file");
                          }}
                        >
                          Upload local file
                        </Button>
                      </Col>
                    </Stack>
                  </>
                ) : (
                  <>
                    <Form.Label>Drag and drop your image</Form.Label>
                    <Stack direction="horizontal" gap={3}>
                      <Col>
                        <FileUploader
                          multiple={false}
                          handleChange={handleFileChange}
                          name="file"
                          types={fileTypes}
                        />
                      </Col>
                      <Col className="ms-auto" xs="auto">
                        <Button
                          variant="outline-primary"
                          onClick={() => {
                            setUploadType("url");
                          }}
                        >
                          Enter Internet URL
                        </Button>
                      </Col>
                    </Stack>
                  </>
                )}
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Col>
          <Col sm={12} lg={4} md={4} xxl={4}>
            <h2>Preview</h2>
            <Post
              title={title}
              description={description}
              imgURL={imgURL}
              userId={sessionStorage.getItem("userId")}
              upVotes={0}
              preview={true}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default UploadPosts;
