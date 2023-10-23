import mongoose from "mongoose";
import { IBuildingPersistence } from "../../../dataschema/building/IBuildingPersistence";
import { BuildingSize } from "../../../domain/Building/BuildingSize";

const BuildingSchema = new mongoose.Schema(
    {
        buildingDescription: {type: String},
        buildingName: {type: String},
        buildingCode: {type: String, unique: true},
        buildingLength: {type: Number},
        buildingWidth: {type: Number}
    },
    {
        timestamps: true
    }
)

export default mongoose.model<IBuildingPersistence & mongoose.Document>('Building', BuildingSchema)