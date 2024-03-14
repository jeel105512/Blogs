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
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);
