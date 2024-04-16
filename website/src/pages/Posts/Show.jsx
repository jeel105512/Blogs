import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Post from "./Post";
import Comment from "./Comment";
import RecentPosts from "./Index";
import client from "../../../facade/utilities/CohereClient";
import styles from "./Show.module.css";

const Show = () => {
    axios.defaults.withCredentials = true;

    const navigate = useNavigate();
    const { id } = useParams();
    const [post, setPost] = React.useState({});
    const [userId, setUserId] = React.useState("");
    const [content, setContent] = React.useState("");
    const [comments, setComments] = React.useState([]);
    const [editCommentId, setEditCommentId] = useState(null); // Track which comment is being edited
    const [editComment, setEditComment] = useState(""); // Track content for editing
    const [generatedComment, setGeneratedComment] = useState(""); // State to hold generated comment

    React.useEffect(() => {
        const fetchData = async () => {
            const postResp = await axios.get(`/api/posts/${id}`);

            setPost(postResp.data.post);
            setUserId(postResp.data.userId);
        };

        fetchData();
    }, [id]);

    React.useEffect(() => {
        const fetchData = async () => {
            const commentsResp = await axios.get("/api/comments");

            setComments(commentsResp.data);
        }

        fetchData();
    }, [id]);

    async function handleSubmit(e) {
        e.preventDefault();

        const comment = {
            userId,
            postId: id,
            content,
        };

        await axios.post("/api/comments", comment);
        navigate(`/posts/${id}`);

        setContent("");
    }

    async function handleEdit(commentId, existingContent) {
        setEditComment(existingContent); // Prefill content for editing
        setEditCommentId(commentId);
    }

    async function cancelEdit() {
        setEditComment(""); // Reset content for editing
        setEditCommentId(null); // Reset edit mode
    }

    async function handleUpdate(e, commentId) {
        e.preventDefault();
        const updatedComment = editComment.trim();
        if (updatedComment === "") {
            return;
        }

        console.log(updatedComment);

        const comment = {
            userId,
            postId: id,
            content: updatedComment,
        };

        await axios.put(`/api/comments/${commentId}`, comment);
        navigate(`/posts/${id}`);
        setEditCommentId(null); // Reset edit mode after submitting edit
        setEditComment(""); // Reset content for editing
    }

    async function handleLike(e, commentId) {
        e.preventDefault();

        const comment = {
            commentId,
            userId,
            postId: id,
            content,
        };

        await axios.post(`/api/comments/${commentId}/likeComment`, comment);
        navigate(`/posts/${id}`);
    }

    async function handleDislike(e, commentId) {
        e.preventDefault();

        const comment = {
            commentId,
            userId,
            postId: id,
            content,
        };

        await axios.post(`/api/comments/${commentId}/dislikeComment`, comment);
        navigate(`/posts/${id}`);
    }

    async function handleDelete(e, commentId) {
        e.preventDefault();

        await axios.delete(`/api/comments/${commentId}`);

        navigate(`/posts/${id}`);
    }

    async function cohere(e, comment) {
        e.preventDefault();
        try {
            const prompt = `Can you please re-write this statement in a better way: ${comment}`;

            const response = await client.generate({
                prompt,
            });

            const generatedComment = response.generations[0].text;
            setGeneratedComment(generatedComment); // Set the generated comment in state
        } catch (error) {
            console.error("Error generating comment:", error);
        }
    }

    return (
        <div className={`${styles["comments-section"]} text-white`}>
            <div className={styles["blog-post-container"]}>
                <PageTitle title="Post" />
            </div>
            <Post post={post} />
            {/* Display generated comment */}
            {generatedComment && (
                <div className="alert alert-info" role="alert">
                    <strong>Improved Comment:</strong> {generatedComment}
                </div>
            )}
            {/* <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <textarea
                        className="form-control"
                        id="content"
                        value={content}
                        placeholder="Comment . . ."
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Comment</button>
                <button className="btn btn-primary" onClick={(e) => cohere(e, content)}>Improve Comment</button>
            </form> */}
            <form onSubmit={handleSubmit}>
                <textarea
                    class={styles["comment-textarea"]}
                    id="content"
                    value={content}
                    placeholder="Comment . . ."
                    onChange={(e) => setContent(e.target.value)}>
                </textarea>
                <div class={styles["comments-section-buttons"]}>
                    <button type="submit" class={styles["comment-button"]}>Comment</button>
                    <button class={styles["improve-comment-button"]} onClick={(e) => cohere(e, content)}>Improve Comment</button>
                </div>
            </form>
            <div class={styles["comment-section-comments"]}>
                {comments.map((comment) => (
                    <Comment
                        key={comment._id}
                        comment={comment}
                        handleEdit={handleEdit}
                        handleLike={handleLike}
                        handleDislike={handleDislike}
                        handleDelete={handleDelete}
                        isEditing={editCommentId === comment._id}
                        editComment={editComment}
                        setEditComment={setEditComment}
                        handleUpdate={handleUpdate}
                        cancelEdit={cancelEdit}
                        cohere={cohere}
                    />
                ))}
            </div>
            <RecentPosts title={"Recent Posts"}/>
        </div>
    );
}

export default Show;