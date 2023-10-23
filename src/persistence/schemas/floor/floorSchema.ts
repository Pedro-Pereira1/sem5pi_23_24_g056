import mongoose, { Document } from "mongoose";
import IFloorPersistence from "../../../dataschema/floor/IFloorPersistence";

const FloorSchema = new mongoose.Schema(
    {
        floorNumber: {
            type: Number,
            unique: true
        },
        floorDescription: { type: String },
        floorMap: {
            map: [[String]],
            passageways: [String],
            rooms: [String],
            elevators: [String]
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model<IFloorPersistence & mongoose.Document>('Floor', FloorSchema)