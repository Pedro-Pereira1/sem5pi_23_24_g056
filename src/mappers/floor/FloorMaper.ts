import { Document, Model } from "mongoose";
import { Mapper } from "../../core/infra/Mapper";
import IFloorPersistence from "../../dataschema/floor/IFloorPersistence";
import { Floor } from "../../domain/Floor/Floor";
import { IFloorDTO } from "../../dto/floor/IFloorDTO";
import Container from "typedi";
import config from "../../../config";
import { Elevator } from "../../domain/Elevator/Elevator";
import { Passageway } from "../../domain/Passageway/Passageway";
import { Room } from "../../domain/Room/Room";
import { FloorDescription } from "../../domain/Floor/FloorDescription";
import { FloorMap } from "../../domain/Floor/FloorMap";
import FloorNumber from "../../domain/Floor/FloorNumber";
import IElevatorRepo from "../../services/IRepos/elevator/IElevatorRepo";
import IRoomRepo from "../../services/IRepos/room/IRoomRepo";
import IPassagewayRepo from "../../services/IRepos/passageway/IPassagewayRepo";
import DoubleCoords from "../../domain/Floor/DoubleCoords";
import SingleCoords from "../../domain/Floor/SingleCoords";
import RoomCoords from "../../domain/Floor/RoomCoords";
import {IListFloorPassagewaysDTO} from "../../dto/floor/IListFloorPassagewaysDTO";

export class FloorMaper extends Mapper<Floor> {

    public static toDto(floor: Floor): IFloorDTO {
        return {
            floorId: floor.id.toValue(),
            floorNumber: floor.floorNumber.number,
            floorDescription: floor.description.description,
            floorMap: {
                map: floor.map.props.map,
                passageways: floor.map.passagewaysId,
                rooms: floor.map.roomsId,
                elevators: floor.map.elevatorsId,
                passagewaysCoords: floor.map.passagewaysCoords,
                elevatorsCoords: floor.map.elevatorsCoords,
                roomCoords:floor.map.roomsCoords,
                doorsCoords: floor.map.doorsCoords
            }
        } as IFloorDTO
    }

    public static toDtoList(floor: Floor,floorConnected: string[]): IListFloorPassagewaysDTO {
        return {
            floorId: floor.id.toValue(),
            floorNumber: floor.floorNumber.number,
            floorDescription: floor.description.description,
            floorMap: {
                passageways: floor.map.passagewaysId
            },
            floorConnected: floorConnected
        } as IListFloorPassagewaysDTO
    }

    public static async toDomain(floorDTO: any | Model<IFloorPersistence & Document>): Promise<Floor> {
        const elevatorRepo: IElevatorRepo = Container.get(config.repos.elevator.name)
        const roomRepo: IRoomRepo = Container.get(config.repos.room.name)
        const passagewayRepo: IPassagewayRepo = Container.get(config.repos.passageway.name)


        let floorNumber = floorDTO.floorNumber
        let description = floorDTO.floorDescription
        let elevators: Elevator[] = []
        let passageways: Passageway[] = []
        let rooms: Room[] = []
        let map: number[][] = floorDTO.floorMap.map
        let passagewaysCoords: DoubleCoords[] = []
        let elevatorsCoords: SingleCoords[] = []
        let roomCoords: RoomCoords[] = []
        let doorsCoords: number[][] = []


        for (const f of floorDTO.floorMap.passageways) {
            passageways.push(await passagewayRepo.findById(f))
        }

        for (const f of floorDTO.floorMap.elevators) {
            elevators.push(await elevatorRepo.findById(f))
        }

        for (const f of floorDTO.floorMap.rooms) {
            rooms.push(await roomRepo.findById(f))
        }

        for (let i = 0; i < floorDTO.floorMap.passagewaysCoords.length; i++) {
            passagewaysCoords.push(DoubleCoords.create({
                id: Number(floorDTO.floorMap.passagewaysCoords[i][0]),
                x:  floorDTO.floorMap.passagewaysCoords[i][1],
                y:  floorDTO.floorMap.passagewaysCoords[i][2],
                x1: floorDTO.floorMap.passagewaysCoords[i][3],
                y1: floorDTO.floorMap.passagewaysCoords[i][4]
            }))
        }

        for (let i = 0; i < floorDTO.floorMap.elevatorsCoords.length; i++) {
            elevatorsCoords.push(SingleCoords.create({
                id: Number(floorDTO.floorMap.elevatorsCoords[i][0]),
                x: floorDTO.floorMap.elevatorsCoords[i][1],
                y: floorDTO.floorMap.elevatorsCoords[i][2],
                orientation: floorDTO.floorMap.elevatorsCoords[i][3]
            }))
        }

        for (let i = 0; i < floorDTO.floorMap.roomCoords.length; i++) {
            roomCoords.push(RoomCoords.create({
                id: floorDTO.floorMap.rooms[i],
                x:  floorDTO.floorMap.roomCoords[i][0],
                y:  floorDTO.floorMap.roomCoords[i][1],
                x1: floorDTO.floorMap.roomCoords[i][2],
                y1: floorDTO.floorMap.roomCoords[i][3]
            }))
        }

        for (let i = 0; i < floorDTO.floorMap.doorsCoords.length; i++) {
            doorsCoords[i] = []
            doorsCoords[i][0] = floorDTO.floorMap.doorsCoords[i][0]
            doorsCoords[i][1] = floorDTO.floorMap.doorsCoords[i][1]
        }

        const FloorOrError = Floor.create(
            {
                floorNumber: new FloorNumber({ number: floorNumber }),
                floorDescription: new FloorDescription({ value: description }),
                floormap: new FloorMap({
                    map: map,
                    passageways: passageways,
                    elevators: elevators,
                    rooms: rooms,
                    passagewaysCoords: passagewaysCoords,
                    elevatorsCoords: elevatorsCoords,
                    roomsCoords: roomCoords,
                    doorsCoords: doorsCoords
                })
            }, floorDTO.floorId)

        return FloorOrError.isSuccess ? FloorOrError.getValue() : null
    }

    public static toPersistence(floor: Floor): any {
        return {
            floorId: floor.id.toValue(),
            floorNumber: floor.floorNumber.number,
            floorDescription: floor.description.description,
            floorMap: {
                map: floor.map.props.map,
                passageways: floor.map.passagewaysId,
                rooms: floor.map.roomsId,
                elevators: floor.map.elevatorsId,
                passagewaysCoords: floor.map.passagewaysCoords,
                elevatorsCoords: floor.map.elevatorsCoords,
                roomCoords:floor.map.roomsCoords,
                doorsCoords: floor.map.doorsCoords
            }
        }
    }
}
