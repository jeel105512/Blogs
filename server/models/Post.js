import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "post must have a title"],
    },
    image: {
      type: String,
      required: false,
      maxlength: [59, "filename cannot exceed 50 characters"],
    },
    content: {
      type: String,
      required: [true, "post must contain some content"],
    },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED"],
      default: "DRAFT",
    },
  },
  { timestamps: true }
);

// Define a static method on the PostSchema to get the newest 5 posts
PostSchema.statics.getNewestPosts = async function() {
  try {
    // Fetch the newest 5 posts based on creation timestamp in descending order
    const newestPosts = await this.find().sort({ createdAt: -1 }).limit(5);
    return newestPosts;
  } catch (error) {
    throw new Error("Error fetching newest posts");
  }
};

// Define a static method on the PostSchema to get the total number of posts
PostSchema.statics.getTotalPosts = async function() {
  try {
    // Count all posts
    const totalPosts = await this.countDocuments();
    return totalPosts;
  } catch (error) {
    throw new Error("Error fetching total number of posts");
  }
};

export default mongoose.model("Post", PostSchema);
