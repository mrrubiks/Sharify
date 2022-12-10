import MyNav from './subcomponents/Nav';
import { useEffect, useState } from 'react';
import PostContainer from './subcomponents/PostContainer';
import Axios from "axios";

function Posts(props) {
    
    const [posts, setPosts] = useState([]);

    useEffect(() => {

    Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/posts/user`,{ withCredentials: true })
        .then((res) => {
            setPosts(res.data.posts);
        })
        .catch((err) => {
            console.log(err);
        })
    }, []);
    
    return (
            <main>
                <MyNav />
                <PostContainer posts={posts} socket={props.socket} />
            </main>
    );
    
}

export default Posts;