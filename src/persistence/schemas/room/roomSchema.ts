import mongoose, { Document } from "mongoose";
import IRoomPersistence from "../../../dataschema/room/IRoomPersistence";

const RoomSchema = new mongoose.Schema(
    {
        roomId: { type: Number },
        roomCoordinatesTopX: { type: Number },
        roomCoordinatesTopY: { type: Number },
        roomCoordinatesBottomX: { type: Number },
        roomCoordinatesBottomY: {type: Number },
    },
    {
        timestamps: true
    }
)

export default mongoose.model<IRoomPersistence & mongoose.Document>('Room', RoomSchema)