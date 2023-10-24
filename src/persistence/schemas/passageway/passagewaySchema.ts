import mongoose, { Document } from "mongoose";
import IPassagewayPersistence from '../../../dataschema/passageway/IPassagewayPersistence'

const PassagewaySchema = new mongoose.Schema(
    {
        passagewayId: { type: Number, unique: true },
        passagewayCoordinatesTopX: { type: Number },
        passagewayCoordinatesTopY: { type: Number },
        passagewayCoordinatesBottomX: { type: Number },
        passagewayCoordinatesBottomY: {type: Number },
    },
    {
        timestamps: true
    }
)

export default mongoose.model<IPassagewayPersistence & mongoose.Document>('Room', PassagewaySchema)