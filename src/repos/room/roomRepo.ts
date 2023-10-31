import { Inject, Service } from "typedi";
import IRoomRepo from "../../services/IRepos/room/IRoomRepo";
import { Model } from "mongoose";
import IRoomPersistence from "../../dataschema/room/IRoomPersistence";
import { Document } from "mongoose";
import { Room } from "../../domain/Room/Room";
import RoomMap from "../../mappers/room/RoomMap";

@Service()
export default class RoomRepo implements IRoomRepo {

    constructor(
        @Inject('roomSchema') private roomSchema: Model<IRoomPersistence & Document>
    ) { }

    findById(id: number): Promise<Room> {
        throw new Error("Method not implemented.");
    }
    exists(t: Room): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    public async save(room: Room): Promise<Room> {
        const query = { roomId: Number(room.id.toValue()) };

        const roomDocument = await this.roomSchema.findOne(query);

        try {
            if (roomDocument === null) {
                const rawRoom: any = RoomMap.toPersistence(room);

                const roomCreated = await this.roomSchema.create(rawRoom);

                return RoomMap.toDomain(roomCreated);

            } else {

                roomDocument.x = room.props.roomCoordinates.props.x
                roomDocument.y = room.props.roomCoordinates.props.y

                await roomDocument.save();

                return room;
            }
        } catch (err) {
            throw err;
        }
    }
}