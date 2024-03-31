import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

    // async function handleEdit(e, commentId, updatedContent) {
    //     e.preventDefault();

    //     const comment = {
    //         userId,
    //         postId: id,
    //         content: updatedContent,
    //     };

    //     await axios.put(`/api/comments/${commentId}`, comment);
    //     navigate(`/posts/${id}`);
    //     setEditCommentId(null); // Reset edit mode after submitting edit
    // }

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
            // Optionally handle empty content
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

    return (
        <div className="container">
            <PageTitle title="Post" />

            <h1>Post</h1>

            <hr className="my-3" />

            <div>
                <h1>{post.title}</h1>
                <img src={`http://localhost:5200/${post.image}`} alt={post.title} style={{ height: 100, width: 100, display: "block" }} />
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <textarea
                        className="form-control"
                        id="content"
                        value={content}
                        placeholder="Comment . . ."
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                </div>

                <button type="submit" className="btn btn-primary">
                    Comment
                </button>
            </form>

            <ul>
                {comments.map(comment => (
                    <li key={comment._id}>
                        {editCommentId === comment._id ? (
                            <form onSubmit={(e) => { handleUpdate(e, comment._id); }}>
                                <div className="form-group">
                                    <textarea className="form-control" value={editComment} onChange={(e) => setEditComment(e.target.value)} />
                                </div>
                                <button type="submit" className="btn btn-primary">Update</button>
                                <button type="button" className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
                            </form>
                        ) : (
                            <>
                                <div>{comment.content}</div>
                                <div>{`Number of likes: ${comment.numberOfLikes}`}</div>
                                <div>{`Number of dislikes: ${comment.numberOfDislikes}`}</div>
                                <button className="btn btn-secondary" onClick={() => handleEdit(comment._id, comment.content)}>Edit</button>
                                <button className="btn btn-success" onClick={(e) => handleLike(e, comment._id)}>Like</button>
                                <button className="btn btn-danger" onClick={(e) => handleDislike(e, comment._id)}>Dislike</button>
                                <button className="btn btn-danger" onClick={(e) => handleDelete(e, comment._id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Show;