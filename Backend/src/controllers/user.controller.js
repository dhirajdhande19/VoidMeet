import { User } from "../models/user.model.js";
import { Meeting } from "../models/meeting.model.js";
import httpStatus from "http-status";
import bcrypt, { hash } from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../Middlewares.js";
import { trusted } from "mongoose";
import mongoose from "mongoose";

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

// const getUserHistory = async (req, res) => {
//   console.log("REQ USER:", req.user);

//   try {
//     const { id } = req.user;
//     const user = await User.findById(id);
//     const meetings = await Meeting.find({ user_id: id });
//     res.json(meetings); //  ->  meetings
//   } catch (e) {
//     res.json({ message: `${e}` });
//   }
// };

const getUserHistory = async (req, res) => {
  try {
    console.log("====== /get_all_activity request ======");
    console.log("Auth Header:", req.headers.authorization);

    if (!req.user) {
      console.error("❌ No req.user found! Check JWT middleware.");
      return res
        .status(401)
        .json({ error: "Unauthorized - No user found in request" });
    }

    console.log("Decoded user from token:", req.user);

    const userId = req.user.id || req.user._id;
    console.log("User ID extracted:", userId);

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("❌ Invalid userId format");
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Check if user exists in DB
    const userExists = await User.findById(userId);
    console.log("User exists in DB:", !!userExists);

    if (!userExists) {
      console.error("❌ No user found in DB with this ID");
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch meetings for the user
    const meetings = await Meeting.find({ user_id: userId }).sort({ date: -1 });

    console.log(`✅ Found ${meetings.length} meetings for user`);
    console.log("Meetings data:", meetings);

    res.json(meetings);
  } catch (err) {
    console.error("💥 Error in /get_all_activity:", err.message);
    console.error(err.stack);
    res.status(500).json({ error: "Server error", details: err.message });
  }

  //   try {
  //     const { id } = req.user;
  //     // const userId = mongoose.Types.ObjectId.createFromHexString(id);
  //     // return console.log(userId, id);

  //     // Fetch user and populate meetings
  //     const user = await User.findById(id).populate("meetings");

  //     // Return the meetings array
  //     res.status(httpStatus.OK).json(user.meetings);
  //     // res.json([
  //     //   {
  //     //     _id: "689dffd1709955b89def9ea3",
  //     //     user_id: "689de080d237bedf3c690bd0",
  //     //     meetingCode: "zs_tbA",
  //     //     date: "2025-08-14T15:25:05.033Z",
  //     //     __v: 0,
  //     //   },
  //     //   {
  //     //     _id: "689dffd4709955b89def9ea7",
  //     //     user_id: "689de080d237bedf3c690bd0",
  //     //     meetingCode: "tyfyhn",
  //     //     date: "2025-08-14T15:25:08.902Z",
  //     //     __v: 0,
  //     //   },
  //     //   {
  //     //     _id: "689edfd9df64c496ab57f22d",
  //     //     user_id: "689de080d237bedf3c690bd0",
  //     //     meetingCode: "ZBBIpC",
  //     //     date: "2025-08-15T07:20:57.260Z",
  //     //     __v: 0,
  //     //   },
  //     //   {
  //     //     _id: "689edfe6df64c496ab57f233",
  //     //     user_id: "689de080d237bedf3c690bd0",
  //     //     meetingCode: "safdewrt54",
  //     //     date: "2025-08-15T07:21:10.730Z",
  //     //     __v: 0,
  //     //   },
  //     // ]);
  //   } catch (e) {
  //     res.status(500).json({ message: e.message });
  //   }
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
