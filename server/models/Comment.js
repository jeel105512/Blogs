import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    userId: {
      type: String,
      required: [true, "user-id is required"],
    },
    postId: {
      type: String,
      required: [true, "post-id is required"],
    },
    content: {
      type: String,
      required: [true, "Comment must contain some content"],
    },
    likes: {
      type: Array,
      default: [],
    },
    numberOfLikes: {
      type: Number,
      default: 0,
    },
    parentCommentId: {
      type: Schema.Types.ObjectId, // Reference to the parent comment
      ref: "Comment", // This establishes the relationship with the Comment model itself
    },
    childComments: [
      {
        type: Schema.Types.ObjectId, // Reference to the child comments
        ref: "Comment", // This establishes the relationship with the Comment model itself
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Comment", CommentSchema);
