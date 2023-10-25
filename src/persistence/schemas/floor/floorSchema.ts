import mongoose, { Document } from "mongoose";
import IFloorPersistence from "../../../dataschema/floor/IFloorPersistence";
let passagewaySchema =  require("../passageway/passagewaySchema").schema
let roomSchema =  require("../room/roomSchema").schema
let elevatorSchema =  require("../elevator/elevatorSchema").schema

const FloorSchema = new mongoose.Schema(
    {
        floorNumber: { type: Number },
        floorid: { type: Number, unique: true },
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