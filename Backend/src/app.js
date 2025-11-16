import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";
import { connectToSocket } from "./controllers/socketManager.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

const MONGO_ATLAS_URL = process.env.ATLAS_URL;
const PORT = process.env.PORT || 1234;

app.set("port", PORT);
app.use(
  cors({
    origin: ["http://localhost:5173", "https://voidmeet.onrender.com/"],
  })
);

import userRoute from "./routes/user.router.js";

app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoute);
app.get("/ping", (req, res) => {
  res.status(200).json({ message: "Ok" });
});

const start = async () => {
  const connectionDB = await mongoose.connect(MONGO_ATLAS_URL);
  console.log(`MONGO Connected to Host: ${connectionDB.connection.host}`);

  server.listen(8000, () => {
    console.log(`listining on port ${PORT}`);
  });
};

start();
