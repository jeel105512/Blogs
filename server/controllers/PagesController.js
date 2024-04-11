import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";

// Creates a controller action called "home"
/*
export const home = (_, res) => {
    // Renders our home page view
    res.render("pages/home");
};
*/

export const home = async (_, res) => {
  try {
    // Fetch the total number of users
    const totalUsers = await User.getTotalUsers();

    // Fetch the total number of comments
    const totalComments = await Comment.getTotalComments();

    // Fetch the total number of posts
    const totalPosts = await Post.getTotalPosts();

    // Fetch the 5 most recent users
    const recentUsers = await User.getNewestUsers();

    // Fetch the 5 most recent comments
    const recentComments = await Comment.getNewestComments();

    // Fetch the 5 most recent posts
    const recentPosts = await Post.getNewestPosts();

    // Render the home page view with all the data
    res.render("pages/home", {
      totalUsers,
      totalComments,
      totalPosts,
      recentUsers,
      recentComments,
      recentPosts,
    });
  } catch (error) {
    // Handle any errors
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
};
