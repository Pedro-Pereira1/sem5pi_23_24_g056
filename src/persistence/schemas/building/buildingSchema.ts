import mongoose from "mongoose";
import { IBuildingPersistence } from "../../../dataschema/building/IBuildingPersistence";
import floorSchema from "../floor/floorSchema";

const BuildingSchema = new mongoose.Schema(
    {
        buildingCode: { type: String, unique: true },
        buildingDescription: { type: String },
        buildingName: { type: String },
        buildingLength: { type: Number },
        buildingWidth: { type: Number },
        buildingFloors: { type: [floorSchema] }
    },
    {
        timestamps: true
    }
)

export default mongoose.model<IBuildingPersistence & mongoose.Document>('Building', BuildingSchema)