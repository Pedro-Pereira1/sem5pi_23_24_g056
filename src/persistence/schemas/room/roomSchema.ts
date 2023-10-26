import mongoose, { Document } from "mongoose";
import IRoomPersistence from "../../../dataschema/room/IRoomPersistence";

const RoomSchema = new mongoose.Schema(
    {
        roomId: { type: Number, unique: true },
        x: { type: Number },
        y: { type: Number },
    },
    {
        timestamps: true
    }
)

export default mongoose.model<IRoomPersistence & mongoose.Document>('Room', RoomSchema)