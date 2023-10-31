import mongoose from "mongoose";
import IRobotTypePersistence from "../../../dataschema/robotType/IRobotTypePersistence";


const robotTypeSchema = new mongoose.Schema(
    {
        robotTypeID: { type: String, unique: true },
        robotBrand: { type: String },
        robotModel: { type: String },
        availableTasks: { type: [String] }
    },
    {
        timestamps: true
    }
)

export default mongoose.model<IRobotTypePersistence & mongoose.Document>('RobotType', robotTypeSchema)