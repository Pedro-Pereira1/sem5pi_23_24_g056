import mongoose, { Document } from "mongoose";
import IFloorPersistence from "../../../dataschema/floor/IFloorPersistence";

const FloorSchema = new mongoose.Schema(
    {
        floorNumber: {type: Number},
        floorDescription: {type: String}
    },
    {
        timestamps: true   
    }
)

export default mongoose.model<IFloorPersistence & mongoose.Document>('FLoor', FloorSchema)