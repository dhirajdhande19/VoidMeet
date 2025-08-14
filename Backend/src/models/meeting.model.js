import mongoose, { Schema } from "mongoose";

const meetingSchema = new Schema({
  user_id: { type: mongoose.Schema.ObjectId, ref: "User" },
  meetingCode: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
  // createdBy: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: "User",
  // },
});

const Meeting = mongoose.model("Meeting", meetingSchema);

export { Meeting };
