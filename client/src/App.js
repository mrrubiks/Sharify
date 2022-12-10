import './App.css';
import React from 'react';
import Axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';

import Login from './components/Login';
import Home from './components/Home';
import MyPosts from './components/MyPosts';
import Posts from './components/Posts';
import Register from './components/Register';
import SharePosts from './components/SharePosts';
import UploadPosts from './components/UploadPosts';
import Logout from './components/Logout';

// React Toastify configuration
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Bootstrap configuration
import 'bootstrap/dist/css/bootstrap.min.css';

// const socket = io(`${process.env.REACT_APP_BACKEND_URL}`);


function App() {
  // socket.on('connect', () => {
  //   console.log('Connected to server');
  // });
  return (
    <> { /*React Fragment same as <div></div>*/}
      <BrowserRouter>
        <Routes> {/* Not using Switch because we want to render all the components that matches the path*/}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register userId={null} />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/post/:id" element={<SharePosts />} />
          <Route path="/user/posts" element={<MyPosts />} />
          {/* <Route path="/share/:user" element={<SharePosts  />} /> */}
          <Route path="/posts/upload" element={<UploadPosts />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Same as */}
      <ToastContainer />
    </>
  );
}

export default App;
