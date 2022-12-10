import React, { useEffect, useState } from "react";
import { MdOutlineArrowUpward } from "react-icons/md";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Axios from "axios";

import Post from "./Post";

const PostContainer = ({ posts, socket }) => {
  posts.sort((a, b) => {
    return Date.parse(b.date) - Date.parse(a.date);
  });
  return (
    <Container style={{ marginTop: "50px" }}>
      <Row data-masonry='{"percentPosition": true }'>
        {posts.map((post, index) => {
          // console.log("postGenerator");
          return (
            <Col sm={6} lg={4} md={4} xxl={3} key={index}>
              {Post(post)}
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default PostContainer;
