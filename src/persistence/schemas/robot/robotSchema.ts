import mongoose from "mongoose";
import IRobotPersistence from "../../../dataschema/robot/IRobotPersistence";


const robotSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true
        },
        nickname: {
            type: String,
            required: true,
            unique: true
        },
        type: {
            type: String,
            required: true
        },
        serialNumber: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        operationStatus: {
            type: Boolean,
            required: false
        }
        
    },
    {
        timestamps: true
    }
)

export default mongoose.model<IRobotPersistence & mongoose.Document>('Robot', robotSchema)