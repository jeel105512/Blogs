import React, { useState, useEffect } from "react";
import PageTitle from "../../components/PageTitle";
import axios from "axios";
import { Link } from "react-router-dom";

const Posts = () => {
    axios.defaults.withCredentials = true;
    
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const postsResp = await axios.get("/api/posts/publicPosts");

            setPosts(postsResp.data);
        };

        fetchData();
    }, []);
    
    return (
        <div className="container">
            <PageTitle title="Posts" />
            <h1>Posts</h1>
            <hr className="my-3" />

            <div className="d-flex flex-wrap justify-content-center">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Image</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {posts.map((post) => (
                            <tr key={post._id}>
                                <td>{post.title}</td>
                                <td><img src={`http://localhost:5200/${post.image}`} alt={post.title} style={{height: 100, width: 100}} /></td>
                                <td><Link to={`/posts/${post._id}`} className="btn btn-primary">View</Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Posts;