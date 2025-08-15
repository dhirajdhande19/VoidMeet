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

  // const getUserHistory = async () => {
  //   try {
  //     //if (!token) return console.error("No token Provided! Please sign up :)");
  //     let request = await client.get("/get_all_activity", {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });
  //     console.log(request);
  //     return request.data;
  //   } catch (e) {
  //     throw e;
  //   }
  // };

  const getUserHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("=== getUserHistory() called ===");
      console.log("Environment MODE:", import.meta.env.MODE);
      console.log(
        "Token from localStorage:",
        token ? token.slice(0, 20) + "..." : "❌ No token found"
      );

      if (!token) {
        console.error("❌ No token Provided! Please sign up or log in.");
        return [];
      }

      console.log(
        "Sending request to:",
        client.defaults.baseURL + "/get_all_activity"
      );

      let request = await client.get("/get_all_activity", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Response Status:", request.status);
      console.log("✅ Response Data:", request.data);

      return request.data;
    } catch (e) {
      console.error("💥 Error in getUserHistory:", e.message || e);
      if (e.response) {
        console.error(
          "📩 Server responded with:",
          e.response.status,
          e.response.data
        );
      } else if (e.request) {
        console.error(
          "📡 No response received from server. Possible CORS or network issue."
        );
      } else {
        console.error("⚠️ Error setting up request:", e.message);
      }
      throw e;
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
