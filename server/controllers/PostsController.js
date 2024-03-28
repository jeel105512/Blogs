import fs from "fs";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

import Post from "../models/Post.js";
import User from "../models/User.js";

dotenv.config();

// email transporter for password reset
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, // this will be from when you send the emails
    pass: process.env.PASS,
  },
});

// Render the login page
export const login = (_, res) => {
  res.render("authentication/login");
};

const permanentStorage = "postsImages";

async function findAndVarifyPost(req) {
  const post = await Post.findById(req.params.id);

  if (!post) {
    req.status = 404;
    throw new Error("Post does not exist.");
  }

  return post;
}

function getStrongParams(req) {
  if (req.file) {
    req.body.image = req.file;
  }

  const { id, title, image, content } = req.body;

  return { id, title, image, content };
}

export const index = async (_, res, next) => {
  try {
    const posts = await Post.find();

    res.format({
      "text/html": () => {
        res.render("posts/index", {
          posts,
          title: "Posts List",
        });
      },
      "application/json": () => {
        res.json({ status: 200, posts, message: "success" });
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
    const post = await findAndVarifyPost(req);

    res.format({
      "text/html": () => {
        res.render("posts/show", { post, user: req.user, title: "Post" });
      },
      "application/json": () => {
        res.json({ status: 200, message: "SUCCESS", post });
      },
      default: () => {
        res.status(406).send("NOT ACCEPTABLE");
      },
    });
  } catch (error) {
    next(error);
  }
};

export const add = async (_, res, next) => {
  try {
    res.render("posts/add", {
      title: "New Post",
    });
  } catch (error) {
    next(error);
  }
};

export const edit = async (req, res, next) => {
  try {
    const post = await findAndVarifyPost(req);

    res.render("posts/edit", {
      post,
      title: "Edit Post",
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { title, image, content } = getStrongParams(req);
    const post = new Post({
      title,
      content,
    });

    const validationErrors = post.validateSync();

    if (validationErrors) {
      if (image && fs.existsSync(image.path)) {
        fs.unlinkSync(image.path);
      }

      const message = Object.values(validationErrors).map(
        (error) => error.message
      );

      res.status(400);

      throw new Error(message.join("\n"));
    }

    if (image && fs.existsSync(image.path)) {
      fs.copyFileSync(image.path, `${permanentStorage}/${image.filename}`);
      await new Promise((resolve) => setTimeout(resolve, 500));
      fs.unlinkSync(image.path);
      post.image = image.filename;
    }

    await post.save();

    res.redirect("/posts");
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { title, image, content } = getStrongParams(req);

    const post = await findAndVarifyPost(req);

    post.title = title;
    post.content = content;

    const validationErrors = post.validateSync();

    if (validationErrors) {
      if (image && fs.existsSync(image.path)) {
        fs.unlinkSync(image.path);
      }

      const message = Object.values(validationErrors).map(
        (error) => error.message
      );

      res.status(400);

      throw new Error(message.join("\n"));
    }

    if (image && fs.existsSync(image.path)) {
      fs.copyFileSync(image.path, `${permanentStorage}/${image.filename}`);
      await new Promise((resolve) => setTimeout(resolve, 500));
      fs.unlinkSync(image.path);
      await new Promise((resolve) => setTimeout(resolve, 500));
      fs.unlinkSync(`${permanentStorage}/${post.image}`);
      post.image = image.filename;
    }

    await post.save();

    res.redirect("/posts");
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const post = await findAndVarifyPost(req);

    const filepath = `${permanentStorage}/${post.image}`;

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    await Post.findByIdAndDelete(req.params.id);

    res.redirect("/posts");
  } catch (error) {
    next(error);
  }
};

// Action for previewing post content
export const preview = async (req, res, next) => {
  try {
    const post = await findAndVarifyPost(req);

    res.render("posts/preview", {
      post,
      title: "Post Draft",
    });
  } catch (error) {
    next(error);
  }
};

// Publish the draft
export const publish = async (req, res, next) => {
  try {
    const post = await findAndVarifyPost(req);
    // Check if the user has permission to publish the post
    if (req.user.role !== "ADMIN") {
      return res
        .status(403)
        .send("You don't have permission to publish this post.");
    }
    // Change post status to "PUBLISHED"
    post.status = "PUBLISHED";
    await post.save();
    res.redirect("/posts");

    // email all the subscribers
    const users = await User.find({ subscriber: true });

    for (const user of users) {
      try {
        await transporter.sendMail({
          to: user.email,
          from: process.env.EMAIL,
          subject: `A Special New Blog For ${user.firstName}: ${post.title}`,
          html: `
            <p>There is a new Blog posted by your favorite blogger.</p>
            <p>View the new Blog Post titled <a href="http://localhost:${process.env.PORT}/posts/${post.id}">${post.title}</a>.</p>
            `,
        });
      } catch (error) {
        console.error(`Error sending email to ${user.email}: ${error.message}`);
        next(error);
      }
    }
  } catch (error) {
    next(error);
  }
};


export const publicPosts = async (_, res, next) => {
  try {
    const posts = await Post.find({status: "PUBLISHED"});

    res.format({
      "text/html": () => {
        res.render("posts/posts", {
          posts,
          title: "Public Posts",
        });
      },
      "application/json": () => {
        res.json({ status: 200, posts, message: "success" });
      },
      default: () => {
        res.status(406).send("NOT ACCEPTABLE");
      },
    });
  } catch (error) {
    next(error);
  }
}