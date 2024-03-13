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

export const login = (_, res) => {
  res.render("authentication/login", {
    title: "Login",
  });
};

export const authenticate = async (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })(req, res, next);
};

export const logout = (req, res, next) => {
  req.logout((error) => {
    if (error) return next(error);

    req.session.destroy((error) => {
      if (error) return next(error);

      res.clearCookie("connect.sid");
      res.redirect("/login");
    });
  });
};

export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  res.redirect("/login");
};

export const isRole = (role) => {
  return (req, _, next) => {
    if (!req.isAuthenticated) {
      req.status = 401;

      return next(new Error("Not Authorised"));
    }

    if (role !== req.user.role) {
      req.status = 403;

      return next(new Error("Forbidden"));
    }

    next();
  };
};

// Lab-03 (testing: reset password)
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
      <p>Click this <a href="http://localhost:3000/reset-password/${token}">link</a> to set a new password.</p>
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