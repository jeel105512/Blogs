import React from "react";

const Post = ({ post }) => {
    return (
        <div>
            <h1>{post.title}</h1>
            <img src={`http://localhost:5200/${post.image}`} alt={post.title} style={{ height: 100, width: 100, display: "block" }} />
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
    );
}

export default Post;