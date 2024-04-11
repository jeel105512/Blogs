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
    dislikes: {
      type: Array,
      default: [],
    },
    numberOfLikes: {
      type: Number,
      default: 0,
    },
    numberOfDislikes: {
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

// Define a static method on the CommentSchema to get the newest 5 comments
CommentSchema.statics.getNewestComments = async function() {
  try {
    // Fetch the newest 5 comments based on creation timestamp in descending order
    const newestComments = await this.find().sort({ createdAt: -1 }).limit(5);
    return newestComments;
  } catch (error) {
    throw new Error("Error fetching newest comments");
  }
};

// Define a static method on the CommentSchema to get the total number of comments
CommentSchema.statics.getTotalComments = async function() {
  try {
    // Count all comments
    const totalComments = await this.countDocuments();
    return totalComments;
  } catch (error) {
    throw new Error("Error fetching total number of comments");
  }
};

export default mongoose.model("Comment", CommentSchema);
