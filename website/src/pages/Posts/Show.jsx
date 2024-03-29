import React from "react";
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
                {comments.map((comment) => (
                    <li key={comment._id}>
                        {comment.content}
                        {` Number of likes: ${comment.numberOfLikes}`}
                        {` ____Number of dislikes: ${comment.numberOfDislikes}`}
                        <form onSubmit={(e) => handleLike(e, comment._id)}>
                            <input type="hidden" name="commentId" value={comment._id} />
                            <button type="submit" className="btn btn-success">Like</button>
                        </form>
                        <form onSubmit={(e) => handleDislike(e, comment._id)}>
                            <input type="hidden" name="commentId" value={comment._id} />
                            <button type="submit" className="btn btn-danger">Dislike</button>
                        </form>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Show;