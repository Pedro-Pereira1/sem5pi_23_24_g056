import mongoose, { Document } from "mongoose";
import IPassagewayPersistence from '../../../dataschema/passageway/IPassagewayPersistence'

const PassagewaySchema = new mongoose.Schema(
    {
        passagewayId: { type: Number, unique: true },

    },
    {
        timestamps: true
    }
)

export default mongoose.model<IPassagewayPersistence & mongoose.Document>('Passageway', PassagewaySchema)
