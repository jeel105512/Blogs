import fs from "fs";

import User from "../models/User.js";

const permanentStorage = "avatars";

async function findAndVarifyUser(req) {
  const user = await User.findById(req.params.id);

  if (!user) {
    req.status = 404;
    throw new Error("User does not exist");
  }

  return user;
}

// restrict parameters to only being the ones allowed for the action (basically filtering out the unwanted parameters)
function getStrongParams(req) {
  if (req.file) {
    req.body.avatar = req.file;
  }

  const { id, firstName, lastName, nickName, email, avatar, password } =
    req.body;

  return { id, firstName, lastName, nickName, email, avatar, password };
}

export const index = async (req, res, next) => {
  try {
    const users = await User.find();

    res.render("users/index", {
      title: "List of Users",
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const show = async (req, res, next) => {
  try {
    const user = await findAndVarifyUser(req);

    res.render("users/show", {
      title: "User View",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const add = async (req, res, next) => {
  try {
    res.render("users/add", {
      title: "New User",
      formType: "create",
    });
  } catch (error) {
    next(error);
  }
};

export const edit = async (req, res, next) => {
  try {
    const user = await findAndVarifyUser(req);

    res.render("users/edit", {
      title: "Edit User",
      user,
      formType: "update",
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { firstName, lastName, nickName, email, password, avatar } =
      getStrongParams(req);
    const user = new User({ firstName, lastName, nickName, email });

    const validationErrors = user.validateSync(); // validateSync => mogoose method where you can provide the paths to validate, if you provide a path that corresponds to an array, and the item's values of that array are wrong, it won't throw an error, because you need to provide in the path the index of the value you want to validate.

    if (validationErrors) {
      // if there are any validation errors
      if (avatar && fs.existsSync(avatar.path)) {
        // check if there is an image, if yes, delete it (from temp storage)
        fs.unlinkSync(avatar.path); // unlinkSync is to delete the file. unlink => async, unlinkSync => not async (sync)
      }

      const message = Object.values(validationErrors).map(
        (error) => error.message
      );

      res.status(400);

      throw new Error(message.join("\n"));
    }

    if (avatar && fs.existsSync(avatar.path)) {
      // if there are no validation errors, and if the file (avatar) exists
      fs.copyFileSync(avatar.path, `${permanentStorage}/${avatar.filename}`); // copy the file/image/avatar to a permanent location
      await new Promise(resolve => setTimeout(resolve, 500));
      fs.unlinkSync(avatar.path); // delete the file/image/avatar from the temp location
      user.avatar = avatar.filename; // assign the filename/imagename/avatarname to the avatar property in the user document
    }

    await User.register(user, password); // password-local-mongoose helper => register(user, password), takes care of hashing the user's password, saving the user object to the database, and handling other authentication-related tasks.

    res.redirect("/users");
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { firstName, lastName, nickName, email, password, avatar } =
      getStrongParams(req);
    const user = await findAndVarifyUser(req);

    user.firstName = firstName;
    user.lastName = lastName;
    user.nickName = nickName;
    user.email = email;

    const validationErrors = user.validateSync();

    if (validationErrors) {
      if (avatar && fs.existsSync(avatar.path)) {
        fs.unlinkSync(avatar.path);
      }

      const message = Object.values(validationErrors).map(
        (error) => error.message
      );

      res.status(400);

      throw new Error(message.join("\n"));
    }

    if (avatar && fs.existsSync(avatar.path)) {
      fs.copyFileSync(avatar.path, `${permanentStorage}/${avatar.filename}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      fs.unlinkSync(avatar.path);
      await new Promise(resolve => setTimeout(resolve, 500));
      fs.unlinkSync(`${permanentStorage}/${user.avatar}`); // deleting the old existing file/image/avatar
      user.avatar = avatar.filename;
    }

    if (password) {
      await user.setPassword(password);
    }

    user.save();

    res.redirect("/users");
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const user = await findAndVarifyUser(req);

    const filepath = `${permanentStorage}/${user.avatar}`;

    if(fs.existsSync(filepath)){
        fs.unlinkSync(filepath);
    }

    await User.findByIdAndDelete(req.params.id);

    res.redirect("/users");
  } catch (error) {
    next(error);
  }
};