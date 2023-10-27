import mongoose from "mongoose";
import { IBuildingPersistence } from "../../../dataschema/building/IBuildingPersistence";
let floorSchema = require("../floor/floorSchema").schema

const BuildingSchema = new mongoose.Schema(
    {
        buildingCode: { type: String, unique: true },
        buildingDescription: { type: String },
        buildingName: { type: String },
        buildingLength: { type: Number },
        buildingWidth: { type: Number },
        buildingFloors: { type: [Number] }
    },
    {
        timestamps: true
    }
)

export default mongoose.model<IBuildingPersistence & mongoose.Document>('Building', BuildingSchema)