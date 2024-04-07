import React from "react";
import { useAuth } from "../../App";

const Comment = ({ comment, handleEdit, handleLike, handleDislike, handleDelete, isEditing, editComment, setEditComment, handleUpdate, cancelEdit, cohere }) => {
    const { user } = useAuth();

    const isCommentCreator = comment.userId === user.id;

    return (
        <li key={comment._id}>
            
            {isEditing ? (
                <>
                    <form onSubmit={(e) => { handleUpdate(e, comment._id); }}>
                        <div className="form-group">
                            <textarea className="form-control" value={editComment} onChange={(e) => setEditComment(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary">Update</button>
                        <button type="button" className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
                    </form>
                    {/* Button to generate comment */}
                    <button className="btn btn-primary" onClick={(e) => cohere(e, comment.content)}>Improve Comment</button>
                </>
            ) : (
                <>
                    <div>{comment.content}</div>
                    <div>{`Number of likes: ${comment.numberOfLikes}`}</div>
                    <div>{`Number of dislikes: ${comment.numberOfDislikes}`}</div>
                    {isCommentCreator && (
                        <>
                            <button className="btn btn-secondary" onClick={() => handleEdit(comment._id, comment.content)}>Edit</button>
                            <button className="btn btn-danger" onClick={(e) => handleDelete(e, comment._id)}>Delete</button>
                        </>
                    )}
                    <button className="btn btn-success" onClick={(e) => handleLike(e, comment._id)}>Like</button>
                    <button className="btn btn-danger" onClick={(e) => handleDislike(e, comment._id)}>Dislike</button>
                </>
            )}
        </li>
    );
}

export default Comment;
