import { Inject, Service } from "typedi";
import IRoomRepo from "../../services/IRepos/room/IRoomRepo";
import { FilterQuery, Model } from "mongoose";
import IRoomPersistence from "../../dataschema/room/IRoomPersistence";
import { Document } from "mongoose";
import { Room } from "../../domain/Room/Room";
import RoomMap from "../../mappers/room/RoomMap";

@Service()
export default class RoomRepo implements IRoomRepo {

    constructor(
        @Inject('roomSchema') private roomSchema: Model<IRoomPersistence & Document>
    ) { }

    public async findById(id: string): Promise<Room> {
        const query = { roomId: id };
        const roomRecord = await this.roomSchema.findOne(query as FilterQuery<IRoomPersistence & Document>);

        if (roomRecord != null) {
            return RoomMap.toDomain(roomRecord);
        }
        else
            return null;
    }
    public async exists(room: Room): Promise<boolean> {
        const query = { roomId: room.id.toValue() };
        const roomRecord = await this.roomSchema.findOne(query as FilterQuery<IRoomPersistence & Document>);
        if (roomRecord != null) {
            return true;
        }
        else
            return false;
    }

    public async save(room: Room): Promise<Room> {
        const query = { roomId: room.id.toString() };

        const roomDocument = await this.roomSchema.findOne(query);

        try {
            if (roomDocument === null) {
                const rawRoom: any = RoomMap.toPersistence(room);

                const roomCreated = await this.roomSchema.create(rawRoom);

                return RoomMap.toDomain(roomCreated);

            } else {

                roomDocument.roomDescription = room.props.roomDescription.description
                roomDocument.roomCategory = room.props.roomCategory.category

                await roomDocument.save();

                return room;
            }
        } catch (err) {
            throw err;
        }
    }
}