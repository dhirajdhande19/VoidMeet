import { User } from "../models/user.model.js";
import { Meeting } from "../models/meeting.model.js";
import httpStatus from "http-status";
import bcrypt, { hash } from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../Middlewares.js";
import { trusted } from "mongoose";

const register = async (req, res) => {
  // await User.collection.dropIndex("username_1");
  // return;
  const { name, email, password } = req.body ?? {};

  if (!name || !email || !password) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Please provide data to continue" });
  }

  //email check call
  if (!validateEmail(email)) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Invalid email format" });
  }

  try {
    // To check if user alredy exist or not
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(httpStatus.FOUND).json({
        message:
          "User with the given email already exits! Please try another email.",
      });
    }

    // to hash the password entered by user
    const hashedPassword = await bcrypt.hash(password, 10);

    // thus new user is created
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return res
      .status(httpStatus.CREATED)
      .json({ message: "User Registered Successfully" });
  } catch (e) {
    res.status(httpStatus.BAD_REQUEST).json({
      message: `${e}`,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Please provide data to continue" });
  }

  //email check call and check
  if (!validateEmail(email)) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Invalid email format" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User not found!" });
    }

    let isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      // let token = crypto.randomBytes(20).toString("hex");
      // user.token = token;
      // await user.save();

      // return res.status(httpStatus.OK).json({ token: `${token}` });

      // create token for user
      const token = jwt.sign(
        { id: user._id, email: user.email }, // payload
        process.env.JWT_SECRET, // Secret from .env
        { expiresIn: process.env.JWT_EXPIRES_IN } // expiry timeline
      );

      return res
        .status(httpStatus.OK)
        .json({ message: "Logged in Successfully", token });
    } else {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid email or password" });
    }
  } catch (e) {
    return res.status(500).json({ message: `Something went wrong ${e}` });
  }
};

const getUserHistory = async (req, res) => {
  console.log("REQ USER:", req.user);

  try {
    const { id } = req.user;
    const user = await User.findById(id);
    const meetings = await Meeting.find({ user_id: id });
    res.json(meetings); //  ->  meetings
  } catch (e) {
    res.json({ message: `${e}` });
  }
};

const addToHistory = async (req, res) => {
  // if (req.user) {

  // }

  //const meeting_code = "kgfh";
  try {
    // if (req.user) {
    // console.log(req.user);
    // return res.json(req);
    const { id } = req.user;
    const { meeting_code } = req.body;
    //const meeting_code = "asfkajs";
    //const user = req.user;
    const user = await User.findOne({ _id: id });
    const newMeeting = new Meeting({
      user_id: user._id,
      meetingCode: meeting_code,
    });

    await newMeeting.save();
    //await User.save();
    //console.log(user.populate());
    await User.findByIdAndUpdate(id, { $push: { meetings: newMeeting._id } });
    res
      .status(httpStatus.CREATED)
      .json({ message: "Added code to history", user }); // -> message: "Added code to history" -> remove user later on
    // } else {
    //   res.status(httpStatus.OK).json({ message: "Not a user" });
    // }
  } catch (e) {
    res.json({
      message: `${e}`,
    });
  }
};

// Validate email before saving user into db
const validateEmail = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

const getDashboard = (req, res) => {
  res.json({ message: `Hello ${req.user.email}` });
};

const clearOneHistory = async (req, res) => {
  try {
    const { id } = req.params;
    //return console.log(id);
    const meeting = await Meeting.findById(id);
    //return console.log(meeting);
    if (meeting) {
      const user = await User.findByIdAndUpdate(meeting.user_id, {
        $pull: { meetings: meeting._id },
      });
      //console.log(user);

      await Meeting.findByIdAndDelete(id);
      res
        .status(httpStatus.OK)
        .json({ message: "Meeting history for one code deleted sucessfully" });

      //console.log("deleted", meeting);
    } else {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "this meeting history dosen't exist anymore" });
    }

    //await User.findOne({_id: id})
  } catch (e) {
    return res.status(500).json({ message: `${e}` });
  }
};

const clearAllHistory = async (req, res) => {
  try {
    const { id } = req.user;
    //const { meetings } = req.body;
    //return console.log(req.body);
    const user = await User.findById(id);
    const meetings = await Meeting.deleteMany({ user_id: id });
    await User.findByIdAndUpdate(id, {
      $set: { meetings: [] },
    });

    res.status(httpStatus.OK).json({ message: "All History Cleared!" });

    //return console.log(user, meetings);
  } catch (e) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: `${e}` });
  }
};

export {
  register,
  login,
  getUserHistory,
  addToHistory,
  getDashboard,
  clearOneHistory,
  clearAllHistory,
};
