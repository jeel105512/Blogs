import React from "react";
import { useAuth } from "../../App";
import styles from "./Comment.module.css";

const Comment = ({ comment, handleEdit, handleLike, handleDislike, handleDelete, isEditing, editComment, setEditComment, handleUpdate, cancelEdit, cohere }) => {
    const { user } = useAuth();

    const isCommentCreator = comment.userId === user.id;

    return (
        <div key={comment._id} className={styles["comment-section-comments"]}>

            {isEditing ? (
                <>
                    <form onSubmit={(e) => { handleUpdate(e, comment._id); }}>
                        <textarea className={styles["comment-textarea"]} value={editComment} onChange={(e) => setEditComment(e.target.value)} />
                        <div className={styles["comment-section-comments-form-buttons"]}>
                            <button type="submit" className={styles["update-comment-button"]}>Update</button>
                            <button type="button" className={styles["cancel-comment-button"]} onClick={cancelEdit}>Cancel</button>
                            <button class={styles["improve-comment-button"]} onClick={(e) => cohere(e, comment.content)}>Improve Comment</button>
                        </div>
                    </form>
                </>
            ) : (
                <>
                    <div className={styles["comment-section-comment"]}>
                        <div className={styles["comment-content"]}>{comment.content}</div>
                        <button onClick={(e) => handleLike(e, comment._id)}>{comment.numberOfLikes} <i className={`fa-solid fa-thumbs-up ${styles["like"]}`}></i></button>
                        <button onClick={(e) => handleDislike(e, comment._id)}>{comment.numberOfDislikes} <i className={`fa-solid fa-thumbs-down ${styles["dislike"]}`}></i></button>
                        {isCommentCreator && (
                            <>
                                <button onClick={() => handleEdit(comment._id, comment.content)}><i className={`fa-solid fa-pen-to-square ${styles["edit"]}`}></i></button>
                                <button onClick={(e) => handleDelete(e, comment._id)}><i className={`fa-solid fa-trash ${styles["delete"]}`}></i></button>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default Comment;
