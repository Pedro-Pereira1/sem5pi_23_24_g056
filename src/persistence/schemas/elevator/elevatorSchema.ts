import mongoose, { Document } from "mongoose";
import IElevatorPersistence from "../../../dataschema/elevator/IElevatorPersistence";

const ElevatorSchema = new mongoose.Schema(
    {
        elevatorId: { type: Number, unique: true },
        elevatorIdentificationNumber: { type: Number },
        elevatorBrand: { type: String},
        elevatorDescription: { type: String},
        elevatorModel: { type: String},
        elevatorSerialNumber: { type: String}
    },
    {
        timestamps: true
    }
)

export default mongoose.model<IElevatorPersistence & mongoose.Document>('Elevator', ElevatorSchema)