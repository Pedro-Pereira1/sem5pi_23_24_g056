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
                roomCoords:floor.map.roomsCoords
            }
        } as IFloorDTO
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
        let roomCoords: DoubleCoords[] = []


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
                x1: floorDTO.floorMap.roomCoords[i][3],
                y1: floorDTO.floorMap.roomCoords[i][4]
            }))
        }

        for (let i = 0; i < floorDTO.floorMap.elevatorsCoords.length; i++) {
            elevatorsCoords.push(SingleCoords.create({
                id: Number(floorDTO.floorMap.elevatorsCoords[i][0]),
                x: floorDTO.floorMap.elevatorsCoords[i][1],
                y: floorDTO.floorMap.elevatorsCoords[i][2]
            }))
        }

        for (let i = 0; i < floorDTO.floorMap.roomCoords.length; i++) {
            roomCoords.push(DoubleCoords.create({
                id: floorDTO.floorMap.roomCoords[i][0].toString(),
                x:  floorDTO.floorMap.roomCoords[i][1],
                y:  floorDTO.floorMap.roomCoords[i][2],
                x1: floorDTO.floorMap.roomCoords[i][3],
                y1: floorDTO.floorMap.roomCoords[i][4]
            }))
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
                    roomsCoords: roomCoords
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
                roomCoords:floor.map.roomsCoords
            }
        }
    }
}
