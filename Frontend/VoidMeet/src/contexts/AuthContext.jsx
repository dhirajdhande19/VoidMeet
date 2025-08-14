import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import httpStatus from "http-status";
import server from "../enviornment";

export const AuthContext = createContext({});

const client = axios.create({
  baseURL: `${server}/api/v1/users`,
});

export const AuthProvider = ({ children }) => {
  const authContext = useContext(AuthContext);

  const [userData, setUserData] = useState(authContext);

  const router = useNavigate();

  const handleRegister = async (name, email, password) => {
    try {
      let request = await client.post("/register", {
        name: name,
        email: email,
        password: password,
      });
      //return console.log(request);

      if (request.status === httpStatus.CREATED) {
        return request.data.message;
      }
    } catch (err) {
      throw err;
    }
  };

  const handleLogin = async (email, password) => {
    try {
      let request = await client.post("/login", {
        email: email,
        password: password,
      });

      if (request.status === httpStatus.OK) {
        localStorage.setItem("token", request.data.token);
        router("/home");
        return request.data.token;
      }
    } catch (err) {
      throw err;
    }
  };

  const getUserHistory = async (req, res) => {
    try {
      const { id } = req.user;
      const userId = mongoose.Types.ObjectId(id);

      // Fetch user and populate meetings
      const user = await User.findById(userId).populate("meetings");

      // Return the meetings array
      res.json(user.meetings || []);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };

  const addToUserHistory = async (code, token) => {
    try {
      //const token = localStorage.getItem("token");
      //if (!token) return console.error("No token Provided! Please sign up :)");
      let request = await client.post(
        "/add_to_activity",
        {
          meeting_code: code,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return request;
    } catch (e) {
      throw e;
    }
  };

  const clearOneMeetingCode = async (id) => {
    try {
      //return console.log(id);
      let request = await client.delete(`/history/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      //return console.log(request);
      return request;
    } catch (e) {
      throw e;
    }
  };

  const clearAllHistory = async () => {
    try {
      //return console.log(id);
      let request = await client.delete("/history", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      //return console.log(request);
      return request;
    } catch (e) {
      throw e;
    }
  };

  const data = {
    userData,
    setUserData,
    getUserHistory,
    addToUserHistory,
    handleRegister,
    handleLogin,
    clearOneMeetingCode,
    clearAllHistory,
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
