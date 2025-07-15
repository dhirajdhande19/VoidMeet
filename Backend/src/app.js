import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import { connectToSocket } from "./controllers/socketManager.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 8000);
app.use(cors());

import userRoute from "./routes/user.router.js";

app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoute);

const start = async () => {
  const connectionDB = await mongoose.connect(
    "mongodb+srv://dhirajdhande2:VvhmPYHgkuJmgNq0@cluster0.cup9r9m.mongodb.net/"
  );
  console.log(`MONGO Connected to Host: ${connectionDB.connection.host}`);

  server.listen(8000, () => {
    console.log("listining of port 8000");
  });
};

start();
