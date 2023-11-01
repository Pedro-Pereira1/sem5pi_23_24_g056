import mongoose, { Document } from "mongoose";
import IRoomPersistence from "../../../dataschema/room/IRoomPersistence";

const RoomSchema = new mongoose.Schema(
    {
        roomName: { type: String, unique: true },
        roomDescription: { type: String },
        roomCategory: { type: String },
    },
    {
        timestamps: true
    }
)

export default mongoose.model<IRoomPersistence & mongoose.Document>('Room', RoomSchema)