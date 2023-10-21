import mongoose from "mongoose";
import { IBuildingPersistence } from "../../../dataschema/building/IBuildingPersistence";

const BuildingSchema = new mongoose.Schema(
    {
        buildingDescription: {type: String},
        buildingName: {type: String, unique: true}
    },
    {
        timestamps: true
    }
)

export default mongoose.model<IBuildingPersistence & mongoose.Document>('Building', BuildingSchema)