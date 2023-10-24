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

    findById(id: number): Room {
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

                roomDocument.roomCoordinatesBottomX = room.props.roomCoordinates.props.topX
                roomDocument.roomCoordinatesTopY = room.props.roomCoordinates.props.topY
                roomDocument.roomCoordinatesBottomX = room.props.roomCoordinates.props.bottonX
                roomDocument.roomCoordinatesBottomY = room.props.roomCoordinates.props.bottonY

                await roomDocument.save();

                return room;
            }
        } catch (err) {
            throw err;
        }
    }
}