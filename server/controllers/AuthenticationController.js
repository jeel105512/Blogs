import passport from "passport";
import crypto from "crypto"; // for generating the reset-password token
import nodemailer from "nodemailer";
import dotenv from "dotenv";

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

// Authenticate user using Passport's local strategy
export const authenticate = async (req, res, next) => {
  // Passport's authentication middleware for local strategy is invoked with options.
  passport.authenticate(
    "local",
    {
      successRedirect: "/", // Redirect on successful authentication
      failureRedirect: "/login", // Redirect on failed authentication
    },
    (error, user) => {
      if (error) {
        req.session.notifications = [
          { alertType: "alert-danger", message: "Issue with logging in" },
        ];
        return next(error);
      }

      if (!user) {
        req.session.notifications = [
          { alertType: "alert-danger", message: "Issue with logging in" },
        ];
        return res.redirect("/login");
      }

      req.logIn(user, (err) => {
        if (err) return next(err);

        req.session.notifications = [
          { alertType: "alert-success", message: "Successfully logged in" },
        ];

        res.format({
          "text/html": () => res.redirect("/"),
          "application/json": () =>
            res.status(200).json({
              status: 200,
              message: "SUCCESS",
              user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                nickname: user.nickname,
                email: user.email,
              },
            }),
          default: () => res.status(406).send("NOT ACCEPTABLE"),
        });
      });
    }
  )(req, res, next); // Invoke Passport middleware with request, response, and next middleware function
};

// Logout user, destroy session, and clear cookies
export const logout = (req, res, next) => {
  // Logout the user by removing user information from the session
  req.logout((error) => {
    if (error) {
      console.error(error);
      return next(error);
    }

    // Destroy the user's session, removing session data from the server
    req.session.destroy((error) => {
      if (error) {
        console.error(error);
        return next(error);
      }

      // Clear the "connect.sid" cookie used for tracking the session
      res.clearCookie("connect.sid", { path: "/" });

      // Redirect the user to the login page after successful logout
      res.format({
        "text/html": () => res.redirect("/login"),
        "application/json": () =>
          res.status(200).json({ status: 200, message: "SUCCESS" }),
        default: () => res.status(406).send("NOT ACCEPTABLE"),
      });
    });
  });
};

// Check if the user is authenticated, and redirect to login if not
export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // Proceed if authenticated
  }

  res.clearCookie("connect.sid", { path: "/" });

  res.format({
    "text/html": () => res.redirect("/login"),
    "application/json": () =>
      res.status(401).json({ status: 401, message: "NOT AUTHORIZED" }),
    default: () => res.status(406).send("NOT ACCEPTABLE"),
  });
};

// Check if the user has a specific role
export const isRole = (role) => {
  return (req, res, next) => {
    if (!req.isAuthenticated) {
      // Check if user is not authenticated
      req.status = 401; // Unauthorized status code

      return next(new Error("NOT AUTHORIZED")); // Return an error for unauthorized access
    }

    if (role !== req.user.role) {
      // Check if user's role doesn't match the specified role
      req.status = 403; // Forbidden status code

      return next(new Error("FORBIDDEN")); // Return an error for forbidden access
    }

    next(); // Proceed if user has the correct role
  };
};

export const getForgotPassword = (_, res) => {
  res.render("authentication/forgot-password", {
    title: "Forgot Password",
  });
};

export const postForgotPassword = async (req, res) => {
  try {
    const buffer = await new Promise((resolve, reject) => {
      crypto.randomBytes(32, (error, buffer) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          resolve(buffer);
        }
      });
    });

    const token = buffer.toString("hex");

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      console.error("No user found");
      return res.redirect("/forgot-password");
    }

    user.resetPasswordToken = token;
    user.resetPasswordTokenExpiration = Date.now() + 3600000; // 1 hour
    await user.save();

    await transporter.sendMail({
      to: req.body.email,
      from: process.env.EMAIL,
      subject: "Password reset",
      html: `
        <p>You requested a password reset.</p>
        <p>Click this <a href="http://localhost:${process.env.PORT}/reset-password/${token}">link</a> to set a new password.</p>
        `,
    });

    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
};

export const getResetPassword = async (req, res) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      console.error("No user found or token expired");
      return;
    }

    res.render("authentication/reset-password", {
      title: "New Password",
      userId: user.id,
      passwordToken: token,
    });
  } catch (error) {
    console.error(error);
  }
};

export const postResetPassword = async (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  try {
    const user = await User.findOne({
      resetPasswordToken: passwordToken,
      resetPasswordTokenExpiration: { $gt: Date.now() },
      _id: userId,
    });

    if (!user) {
      console.error("No user found or token expired");
      const error = new Error("No user found or token expired");
      error.status = 404;
      throw error;
    }

    user.setPassword(newPassword, async () => {
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpiration = undefined;

      await user.save();
      res.redirect("/login");
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};