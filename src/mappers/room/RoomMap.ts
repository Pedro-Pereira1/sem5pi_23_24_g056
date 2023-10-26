import { Document } from "mongodb";
import { Mapper } from "../../core/infra/Mapper";
import IRoomPersistence from "../../dataschema/passageway/IPassagewayPersistence";
import { Room } from "../../domain/Room/Room";
import IRoomDTO from "../../dto/room/IRoomDTO";
import { Model } from "mongoose";

export default class RoomMap extends Mapper<Room> {

    public static toDto(room: Room): IRoomDTO {
        return {
            roomId: room.id.toValue(),
            x: room.props.roomCoordinates.props.x,
            y: room.props.roomCoordinates.props.y
        } as IRoomDTO
    }

    public static toDomain(roomdto: any | Model<IRoomPersistence & Document>): Room {
        const roomORError = Room.create(roomdto)

        return roomORError.isSuccess ? roomORError.getValue() : null
    }

    public static toPersistence(room: Room): any {
        return {
            roomId: room.id.toValue(),
            x: room.props.roomCoordinates.props.x,
            y: room.props.roomCoordinates.props.y
        }
    }

}