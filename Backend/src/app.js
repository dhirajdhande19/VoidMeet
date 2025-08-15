import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import { connectToSocket } from "./controllers/socketManager.js";
import dotenv from "dotenv";
dotenv.config();

// import path from "path";
const app = express();
const server = createServer(app);
const io = connectToSocket(server);

const MONGO_ATLAS_URL = process.env.ATLAS_URL;

app.set("port", process.env.PORT || 8000);
app.use(cors());

import userRoute from "./routes/user.router.js";
//import { authMiddleware } from "./Middlewares.js";

app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

// const __dirname = path.resolve();

// Serve frontend build
// app.use(express.static(path.join(__dirname, "../Frontend/VoidMeet/dist")));

// app.get(/.*/, (req, res) => {
//   res.sendFile(path.join(__dirname, "../Frontend/VoidMeet/dist/index.html"));
// });

app.use("/api/v1/users", userRoute);
app.get("/ping", (req, res) => {
  res.status(200).json({ message: "Ok" });
});

const start = async () => {
  const connectionDB = await mongoose.connect(MONGO_ATLAS_URL);
  console.log(`MONGO Connected to Host: ${connectionDB.connection.host}`);

  server.listen(8000, () => {
    console.log("listining of port 8000");
  });
};

start();

// import path from "path";
// import express from "express";

// const app = express();
// const __dirname = path.resolve();

// // Serve frontend build
// app.use(express.static(path.join(__dirname, "Frontend/VoidMeet/dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "Frontend/VoidMeet/dist", "index.html"));
// });

// app.listen(8000, () => console.log("Server running on http://localhost:8000"));
