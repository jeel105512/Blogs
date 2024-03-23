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
      required: [true, "user-id is required"],
    },
    content: {
      type: String,
      required: [true, "post must contain some content"],
    },
    numberOfLikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", CommentSchema);
