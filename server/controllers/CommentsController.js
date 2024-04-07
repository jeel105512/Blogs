import Comment from "../models/Comment.js";
import { CohereClient } from "cohere-ai";

const client = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

async function findAndVarifyComment(req) {
  const comment = await Comment.findById(req.params.id).populate({
    path: "childComments", // Populate the childComments array
    populate: { path: "childComments" }, // Populate the child comments of child comments recursively
  });

  if (!comment) {
    req.status = 404;
    throw new Error("Comment does not exist.");
  }

  return comment;
}

// Recursive function to delete all child comments
async function deleteChildComments(parentCommentId) {
  const childComments = await Comment.find({ parentCommentId });
  for (const childComment of childComments) {
    await deleteChildComments(childComment._id);
    await Comment.findByIdAndDelete(childComment._id);
  }
}

export const index = async (_, res, next) => {
  try {
    const comments = await Comment.find();

    res.format({
      "text/html": () => {
        res.render("comments/index", {
          comments,
          title: "Comments List",
        });
      },
      "application/json": () => {
        res.json({ status: 200, comments, message: "success" });
      },
      default: () => {
        res.status(406).send("NOT ACCEPTABLE");
      },
    });
  } catch (error) {
    next(error);
  }
};

export const show = async (req, res, next) => {
  try {
    const comment = await findAndVarifyComment(req);

    res.format({
      "text/html": () => {
        res.render("comments/show", {
          comment,
          user: req.user,
          title: "Comment",
        });
      },
      "application/json": () => {
        res.json({ status: 200, message: "SUCCESS", comment });
      },
      default: () => {
        res.status(406).send("NOT ACCEPTABLE");
      },
    });
  } catch (error) {
    next(error);
  }
};

// Add this function to your controller file
export const childComments = async (req, res, next) => {
  try {
    const parentId = req.params.id;

    // Find the parent comment
    const parentComment = await Comment.findById(parentId);
    if (!parentComment) {
      return res
        .status(404)
        .json({ status: 404, message: "Parent comment not found" });
    }

    // Find all child comments of the parent comment
    const childComments = await Comment.find({ parentCommentId: parentId });

    // There is no view for child comments on the server (only JSON)
    res.status(200).json({
      status: 200,
      message: "SUCCESS",
      parentComment,
      childComments,
    });
  } catch (error) {
    next(error);
  }
};

export const add = async (_, res, next) => {
  try {
    res.render("comments/add", {
      title: "New Comment",
    });
  } catch (error) {
    next(error);
  }
};

export const edit = async (req, res, next) => {
  try {
    const comment = await findAndVarifyComment(req);

    res.render("comments/edit", {
      comment,
      title: "Edit Comment",
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { userId, postId, content } = req.body;
    const parentCommentId = req.body.parentCommentId;

    let parentComment;

    if (parentCommentId) {
      // Check if parentCommentId exists in the database
      parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res
          .status(404)
          .json({ status: 404, message: "Parent comment not found" });
      }
    }

    const newComment = new Comment({
      userId,
      postId,
      content,
      parentCommentId,
    });

    await newComment.save();

    // Update the parent comment's childComments array
    if (parentComment) {
      parentComment.childComments.push(newComment._id);
      await parentComment.save();
    }

    res.format({
      "text/html": () => {
        req.session.notifications = [
          {
            alertType: "alert-success",
            message: "Comment was created successfully",
          },
        ];
        res.redirect("/comments");
      },
      "application/json": () => {
        res.status(201).json({
          status: 201,
          message: "SUCCESS",
          comment: newComment,
        });
      },
      default: () => {
        res.status(406).send("NOT ACCEPTABLE");
      },
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { content } = req.body;
    const commentId = req.params.id;

    // Check if the comment exists
    const existingComment = await Comment.findById(commentId);
    if (!existingComment) {
      return res
        .status(404)
        .json({ status: 404, message: "Comment not found" });
    }

    // Check if the user is the creator of the comment or an ADMIN
    if (
      req.user.role !== "ADMIN" && // Check if user is not ADMIN
      existingComment.userId !== req.user.id // Check if user is not the creator of the comment
    ) {
      return res
        .status(403)
        .json({ status: 403, message: "Unauthorized to update this comment" });
    }

    // If the comment is a child comment, prevent updating parentCommentId
    if (existingComment.parentCommentId && req.body.parentCommentId) {
      delete req.body.parentCommentId;
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { content },
      { new: true }
    );

    res.format({
      "text/html": () => {
        req.session.notifications = [
          {
            alertType: "alert-success",
            message: "Comment was updated successfully",
          },
        ];
        res.redirect("/comments");
      },
      "application/json": () => {
        res.status(200).json({
          status: 200,
          message: "SUCCESS",
          comment: updatedComment,
        });
      },
      default: () => {
        res.status(406).send("NOT ACCEPTABLE");
      },
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const comment = await findAndVarifyComment(req);

    // Check if the user is the creator of the comment or an ADMIN
    if (
      req.user.role !== "ADMIN" && // Check if user is not ADMIN
      comment.userId !== req.user.id // Check if user is not the creator of the comment
    ) {
      return res
        .status(403)
        .json({ status: 403, message: "Unauthorized to delete this comment" });
    }

    await deleteChildComments(req.params.id);
    await Comment.findByIdAndDelete(req.params.id);

    res.format({
      "text/html": () => {
        req.session.notifications = [
          {
            alertType: "alert-success",
            message: "Comment was deleted successfully",
          },
        ];
        res.redirect("/comments");
      },
      "application/json": () => {
        res.status(200).json({ status: 200, message: "SUCCESS" });
      },
      default: () => {
        res.status(406).send("NOT ACCEPTABLE");
      },
    });
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.body.commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ status: 404, message: "Comment not found" });
    }

    const userIndexInLikes = comment.likes.indexOf(req.user.id);
    const userIndexInDislikes = comment.dislikes.indexOf(req.user.id);

    if (userIndexInLikes === -1) {
      // User hasn't liked the comment
      comment.likes.push(req.user.id);
      comment.numberOfLikes += 1;
    } else {
      // User has already liked the comment, remove from likes
      comment.likes.splice(userIndexInLikes, 1);
      comment.numberOfLikes -= 1;
    }

    if (userIndexInDislikes !== -1) {
      // User has disliked the comment, remove from dislikes
      comment.dislikes.splice(userIndexInDislikes, 1);
      comment.numberOfDislikes -= 1;
    }

    await comment.save();

    res.format({
      "text/html": () => {
        res.redirect(`/comments/${req.body.commentId}`);
      },
      "application/json": () => {
        res.status(200).json({ status: 200, message: "SUCCESS" });
      },
      default: () => {
        res.status(406).send("NOT ACCEPTABLE");
      },
    });
  } catch (error) {
    next(error);
  }
};

export const dislikeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.body.commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ status: 404, message: "Comment not found" });
    }

    const userIndexInDislikes = comment.dislikes.indexOf(req.user.id);
    const userIndexInLikes = comment.likes.indexOf(req.user.id);

    if (userIndexInDislikes === -1) {
      // User hasn't disliked the comment
      comment.dislikes.push(req.user.id);
      comment.numberOfDislikes += 1;
    } else {
      // User has already disliked the comment, remove from dislikes
      comment.dislikes.splice(userIndexInDislikes, 1);
      comment.numberOfDislikes -= 1;
    }

    if (userIndexInLikes !== -1) {
      // User has liked the comment, remove from likes
      comment.likes.splice(userIndexInLikes, 1);
      comment.numberOfLikes -= 1;
    }

    await comment.save();

    res.format({
      "text/html": () => {
        res.redirect(`/comments/${req.body.commentId}`);
      },
      "application/json": () => {
        res.status(200).json({ status: 200, message: "SUCCESS" });
      },
      default: () => {
        res.status(406).send("NOT ACCEPTABLE");
      },
    });
  } catch (error) {
    next(error);
  }
};