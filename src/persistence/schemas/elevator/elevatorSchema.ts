import mongoose, { Document } from "mongoose";
import IRoomPersistence from "../../../dataschema/room/IRoomPersistence";

const ElevatorSchema = new mongoose.Schema(
    {
        elevatorId: { type: Number, unique: true },
        elevatorCoordinatesTopX: { type: Number },
        elevatorCoordinatesTopY: { type: Number },
        elevatorCoordinatesBottomX: { type: Number },
        elevatorCoordinatesBottomY: {type: Number },
    },
    {
        timestamps: true
    }
)

export default mongoose.model<IRoomPersistence & mongoose.Document>('Elevator', ElevatorSchema)