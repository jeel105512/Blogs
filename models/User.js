import mongoose from "mongoose";
import passportLocalMmongoose from "passport-local-mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "You must provide a first name"],
      maxlength: [25, "Your first name cannot exceed 25 characters"],
    },
    lastName: {
      type: String,
      required: [true, "You must provide a last name"],
      maxlength: [25, "Your last name cannot exceed 25 characters"],
    },
    nickName: {
      type: String,
      required: [true, "You must provide a nick name"],
      unique: true,
      maxlength: [25, "Your nick name cannot exceed 25 characters"],
    },
    email: {
      type: String,
      required: [true, "Must be a vaild email"],
      unique: true,
      maxlength: [75, "Your email cannot exceed 75 characters"],
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"], // use a pattern to create validation (regex)
    },
    avatar: {
      type: String,
      required: false,
      maxlength: [59, "Filename cannot exceed 50 characters"],
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    resetPasswordToken: {
      type: String,
      require: false,
    },
    resetPasswordTokenExpiration: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

// "plugins" allow you to highjack how the UserSchema works and add in other additional functionality for it
UserSchema.plugin(passportLocalMmongoose, {
  usernameField: "email", // overriding "userNameField" as "email"
});

export default mongoose.model("User", UserSchema);
