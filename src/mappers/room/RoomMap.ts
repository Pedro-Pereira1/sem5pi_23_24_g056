import { Document } from "mongodb";
import { Mapper } from "../../core/infra/Mapper";
import IRoomPersistence from "../../dataschema/passageway/IPassagewayPersistence";
import { Room } from "../../domain/Room/Room";
import IRoomDTO from "../../dto/room/IRoomDTO";
import { Model } from "mongoose";
import { RoomDescription } from "../../domain/Room/RoomDescription";
import { RoomCategory } from "../../domain/Room/RoomCategory";
import { RoomName } from "../../domain/Room/RoomName";
import IListAllRoomsInBuildingDTO from "../../dto/room/IListAllRoomsInBuildingDTO";

export default class RoomMap extends Mapper<Room> {

    public static toDto(room: Room): IRoomDTO {
        return {
            roomName: room.id.toString(),
            roomDescription: room.props.roomDescription.description,
            roomCategory: room.props.roomCategory.category
        } as IRoomDTO
    }

    public static toDtoList(room: Room, floorId: number): IListAllRoomsInBuildingDTO {
        return {
            roomName: room.id.toString(),
            roomDescription: room.props.roomDescription.description,
            roomCategory: room.props.roomCategory.category,
            floorId: floorId
        } as IListAllRoomsInBuildingDTO
    }

    public static toDomain(roomDto: any | Model<IRoomPersistence & Document>): Room {
        const roomORError = Room.create({
            roomDescription: RoomDescription.create(roomDto.roomDescription).getValue(),
            roomCategory: RoomCategory.create(roomDto.roomCategory).getValue()
        }, RoomName.create(roomDto.roomName).getValue())

        return roomORError.isSuccess ? roomORError.getValue() : null
    }

    public static toPersistence(room: Room): any {
        return {
            roomName: room.id.toString(),
            roomDescription: room.props.roomDescription.description,
            roomCategory: room.props.roomCategory.category
        }
    }

}