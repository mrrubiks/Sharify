import React, { useEffect, useState } from "react";
import { MdOutlineArrowUpward } from "react-icons/md";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Spinner from "react-bootstrap/Spinner";
import Card from "react-bootstrap/Card";
import Axios from "axios";
import { toast } from "react-toastify";

function imagePlaceholder() {
  return (
    <div className="d-flex justify-content-center">
      <Spinner animation="border" className="m-5" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}

function Post(post) {
  const userId = sessionStorage.getItem("userId");
  const [upVotes, setupVotes] = useState(post.upVotes);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    setupVotes(post.upVotes);
  }, [post.upVotes]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/masonry/4.2.2/masonry.pkgd.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, [deleted, imgLoaded]);

  const handleUpvote = () => {
    setupVotes(upVotes + 1);
  };
  const handleDelete = (id) => {
    if (post.preview) return;
    Axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/posts/${id}`, {
      withCredentials: true,
    })
      .then((res) => {
        toast.success("Post deleted");
        setDeleted(true);
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.log(err);
      });
  };

  useEffect(() => {
    if (post.preview) return;
    Axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/api/posts/upvotes/${post._id}`,
      { upVotes: upVotes },
      { withCredentials: true }
    );
  }, [upVotes]);

  return deleted ? null : (
    <Card className="shadow-sm" style={{ marginBottom: "20px" }}>
      {!imgLoaded ? imagePlaceholder() : null}
      <Card.Img
        style={imgLoaded ? {} : { display: "none" }}
        onLoad={() => {
          setImgLoaded(true);
        }}
        variant="top"
        src={
          post.imgURL
            ? post.imgURL
            : process.env.REACT_APP_BACKEND_URL +
              "/api/file/img/" +
              "placeholder.png"
        }
      />
      {/* <Card.Img  variant="top" src={post.imgURL} /> */}
      <Card.Body>
        <Card.Title>{post.title}</Card.Title>
        <Card.Text>{post.description}</Card.Text>
        <div className="d-flex justify-content-between align-items-center">
          <ButtonGroup>
            <Button
              variant="outline-secondary"
              onClick={() => {
                window.location.href = `${process.env.REACT_APP_FRONTEND_URL}/post/${post._id}`;
              }}
              disabled={post.preview}
            >
              View & Share
            </Button>
            {post.userId != userId ? null : (
              <Button
                variant="outline-secondary"
                onClick={() => {
                  handleDelete(post._id);
                }}
                disabled={post.preview}
              >
                Delete
              </Button>
            )}
          </ButtonGroup>
          <Button variant="outline-primary" onClick={() => handleUpvote()}>
            <MdOutlineArrowUpward
              style={{ fontSize: "20px", marginBottom: "5px" }}
            />
            <p style={{ fontSize: "12px", marginBottom: "0" }}>{upVotes}</p>
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default Post;
