import mongoose, { Document } from "mongoose";
import IElevatorPersistence from "../../../dataschema/elevator/IElevatorPersistence";

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

export default mongoose.model<IElevatorPersistence & mongoose.Document>('Elevator', ElevatorSchema)