import fs from "fs";
import Post from "../models/Post.js";

const permanentStorage = "postsImages";

async function findAndVarifyUser(req) {
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
    const post = await findAndVarifyUser(req);

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
    const post = await findAndVarifyUser(req);

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

    const post = await findAndVarifyUser(req);

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
    const post = await findAndVarifyUser(req);

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
