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
import { FloorNumber } from "../../domain/Floor/FloorNumber";
import IElevatorRepo from "../../services/IRepos/elevator/IElevatorRepo";
import IRoomRepo from "../../services/IRepos/room/IRoomRepo";
import IPassagewayRepo from "../../services/IRepos/passageway/IPassagewayRepo";

export class FloorMaper extends Mapper<Floor> {

    public static toDto(floor: Floor): IFloorDTO {
        return {
            floorNumber: floor.id.toValue(),
            floorDescription: floor.description.description,
            floorMap: {
                map: floor.props.floormap.props.map,
                passageways: floor.map.passagewaysId,
                elevators: floor.map.elevatorsId,
                rooms: floor.map.roomsId,
            }
        } as IFloorDTO
    }

    public static toDomain(floorDTO: any | Model<IFloorPersistence & Document>): Floor {
        const elevatorRepo: IElevatorRepo = Container.get(config.repos.elevator.name)
        const roomRepo: IRoomRepo = Container.get(config.repos.room.name)
        const passagewayRepo: IPassagewayRepo = Container.get(config.repos.passageway.name)

        let floorNumber = floorDTO.floorNumber
        let description = floorDTO.description
        let elevators: Elevator[] = []
        let passageways: Passageway[] = []
        let rooms: Room[] = []
        let map: string[][] = floorDTO.floorMap.map

        floorDTO.floorMap.passageways.forEach(async p => {
            const a = await passagewayRepo.findById(p)
            passageways.push(a)
        });

        floorDTO.floorMap.elevator.forEach(async e => {
            const a = await elevatorRepo.findById(e)
            elevators.push(a)
        });

        floorDTO.floorMap.rooms.forEach(async r => {
            const a = await roomRepo.findById(r)
            rooms.push(a)
        })


        const FloorOrError = Floor.create(
            {
                floorDescription: new FloorDescription({ value: description }),
                floormap: new FloorMap({
                    map: map,
                    passageways: passageways,
                    elevators: elevators,
                    rooms: rooms
                })
            }, floorNumber)

        return FloorOrError.isSuccess ? FloorOrError.getValue() : null
    }

    public static toPersistence(floor: Floor): any {
        return {
            floorNumber: floor.id.toValue(),
            floorDescription: floor.description.description,
            floorMap: {
                map: floor.props.floormap.props.map,
                passageways: floor.map.passagewaysId,
                elevators: floor.map.elevatorsId,
                rooms: floor.map.roomsId,
            }
        } as IFloorDTO
    }
}