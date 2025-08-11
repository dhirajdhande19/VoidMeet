import { User } from "../models/user.model.js";
import { Meeting } from "../models/meeting.model.js";
import httpStatus from "http-status";
import bcrypt, { hash } from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

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
  const { token } = req.query;
  try {
    const user = await User.findOne({ token: token });
    const meetings = await Meeting.find({ user_id: user.username });
    res.json(meetings);
  } catch (e) {
    res.json(`Something went wrong : ${e}`);
  }
};

const addToHistory = async (req, res) => {
  const { token, meeting_code } = req.body;
  try {
    const user = await User.findOne({ token: token });
    const newMeeting = new Meeting({
      user_id: user.username,
      meetingCode: meeting_code,
    });

    await newMeeting.save();
    res.status(httpStatus.CREATED).json({ message: "Added code to history" });
  } catch (e) {
    res.json({
      message: `Something went wrong : ${e}`,
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

export { register, login, getUserHistory, addToHistory, getDashboard };
