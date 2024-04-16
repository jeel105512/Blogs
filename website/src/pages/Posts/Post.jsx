import React from "react";

import styles from "./Post.module.css";

const Post = ({ post }) => {
    return (
        <div className={styles["blog-post-container"]}>
            <h1 className={styles["blog-post-title"]}>{post.title}</h1>
            <img src={`http://localhost:5200/${post.image}`} alt={post.title}/>
            <div className={styles["blog-post-content"]} dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
    );
}

export default Post;