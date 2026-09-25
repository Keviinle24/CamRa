import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  status: String,
  callers: [{type: String}]
},
    {
      timestamps: true,
    });

export default mongoose.models.Room || mongoose.model("Room", RoomSchema);
