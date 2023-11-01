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
import FloorNumber from "../../domain/Floor/FloorId";
import IElevatorRepo from "../../services/IRepos/elevator/IElevatorRepo";
import IRoomRepo from "../../services/IRepos/room/IRoomRepo";
import IPassagewayRepo from "../../services/IRepos/passageway/IPassagewayRepo";
import IdCoords from "../../domain/Floor/IdCoords";

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
        let passagewaysCoords: IdCoords[] = []
        let elevatorsCoords: IdCoords[] = []
        let roomCoords: IdCoords[] = []


        for (const f of floorDTO.floorMap.passageways) {
            passageways.push(await passagewayRepo.findById(f))
        }

        for (const f of floorDTO.floorMap.elevators) {
            elevators.push(await elevatorRepo.findById(f))
        }

        for (const f of floorDTO.floorMap.rooms) {
            rooms.push(await roomRepo.findById(f))
        }

        let i = 0
        for (const p of passageways) {
            passagewaysCoords.push(new IdCoords({
                id: p.id.toValue(),
                x: floorDTO.passagewaysCoords[i][0],
                y: floorDTO.passagewaysCoords[i][1]
            }))
            i++
        }

        i = 0
        for (const e of elevators) {
            elevatorsCoords.push(new IdCoords({
                id: e.id.toValue(),
                x: floorDTO.passagewaysCoords[i][0],
                y: floorDTO.passagewaysCoords[i][1]
            }))
            i++
        }

        i = 0
        for (const r of elevators) {
            roomCoords.push(new IdCoords({
                id: r.id.toValue(),
                x: floorDTO.passagewaysCoords[i][0],
                y: floorDTO.passagewaysCoords[i][1]
            }))
            i++
        }

        const FloorOrError = Floor.create(
            {
                floorNumber: floorNumber,
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
