import mongoose, { Document } from "mongoose";
import IFloorPersistence from "../../../dataschema/floor/IFloorPersistence";
let passagewaySchema = require("../passageway/passagewaySchema").schema
let roomSchema = require("../room/roomSchema").schema
let elevatorSchema = require("../elevator/elevatorSchema").schema

const FloorSchema = new mongoose.Schema(
    {
        floorId: { type: Number, unique: true },
        floorNumber: { type: Number },
        floorDescription: { type: String },
        floorMap: {
            map: [[Number]],
            passageways: [Number],
            rooms: [String],
            elevators: [Number],
            passagewaysCoords: [[Number]],
            elevatorsCoords: [[Number]] ,
            roomCoords: [[Number]],
            doorsCoords: [[Number]]
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model<IFloorPersistence & mongoose.Document>('Floor', FloorSchema)