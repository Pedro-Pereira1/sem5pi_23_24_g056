import { Inject, Service } from "typedi";
import ILoadFloorMapService from "../../IServices/floor/floorMap/ILoadFloorMapService";
import { IFloorDTO } from "../../../dto/floor/IFloorDTO";
import config from "../../../../config";
import IFloorRepo from "../../IRepos/floor/IFloorRepo";
import { Result } from "../../../core/logic/Result";
import { FloorMaper } from "../../../mappers/floor/FloorMaper";
import IBuildingRepo from "../../IRepos/building/IBuildingRepo";
import BuildingCode from "../../../domain/Building/BuildingCode";
import ILoadFloorMapDTO from "../../../dto/floor/ILoadFloorMapDTO";
import DoubleCoords from "../../../domain/Floor/DoubleCoords";
import SingleCoords from "../../../domain/Floor/SingleCoords";

@Service()
export default class LoadFloorMapService implements ILoadFloorMapService {

    constructor(
        @Inject(config.repos.floor.name) private floorRepo: IFloorRepo,
        @Inject(config.repos.building.name) private buildingRepo: IBuildingRepo
    ) { }

    public async loadFloorMap(buildingCode: string, floorId: number, floorLayout: ILoadFloorMapDTO): Promise<Result<IFloorDTO>> {
        const buildingOrError = await this.buildingRepo.findByBuidingCode(new BuildingCode(buildingCode))
        const floorOrError = await this.floorRepo.findById(floorId)

        if (buildingOrError == null) {
            return Result.fail<IFloorDTO>('There is no building with that code')
        }

        if (floorOrError == null) {
            return Result.fail<IFloorDTO>('There is no floor with that ID')
        }

        let map: number[][] = floorLayout.map

        if (map.length > buildingOrError.size.length) {
            return Result.fail<IFloorDTO>('The floor map has a bigger length than the maximum allowed by that building')
        }

        for (let i = 0; i < map.length; i++) {
            if (map[i].length > buildingOrError.size.width) {
                return Result.fail<IFloorDTO>('The floor map has a bigger width than the maximum allowed by that building')
            }
        }

        let passagewaysCoords: DoubleCoords[] = []
        let elevatorsCoords: SingleCoords[] = []
        let roomsCoords: DoubleCoords[] = []

        for (let i = 0; i < floorLayout.passageways.length; i++) {
            passagewaysCoords[i] = DoubleCoords.create({
                id: floorLayout.passageways[i][0],
                x: floorLayout.passageways[i][1],
                y: floorLayout.passageways[i][2],
                x1: floorLayout.passageways[i][3],
                y1: floorLayout.passageways[i][4]
            })
        }

        for (let i = 0; i < floorLayout.elevators.length; i++) {
            elevatorsCoords[i] = SingleCoords.create({
                id: floorLayout.elevators[i][0],
                x: floorLayout.elevators[i][1],
                y: floorLayout.elevators[i][2]
            })
        }

        for (let i = 0; i < floorLayout.rooms.length; i++) {
            roomsCoords[i] = DoubleCoords.create({
                id: floorLayout.rooms[i][0],
                x: floorLayout.rooms[i][1],
                y: floorLayout.rooms[i][2],
                x1: floorLayout.rooms[i][3],
                y1: floorLayout.rooms[i][4]
            })
        }


        const passagewaysIds = floorOrError.map.passagewaysId
        for (const p of passagewaysCoords) {
            if (!passagewaysIds.includes(Number(p.id))) {
                return Result.fail<IFloorDTO>('There is no passageway with id ' + p.id + ' in this floor')
            }
        }

        const elevatorsIds = floorOrError.map.elevatorsId
        for (const e of elevatorsCoords) {
            if (!elevatorsIds.includes(Number(e.id))) {
                return Result.fail<IFloorDTO>('There is no elevator with id ' + e.id + ' in this floor')
            }
        }

        const roomsIds = floorOrError.map.elevatorsId
        for (const r of roomsCoords) {
            if (!roomsIds.includes(Number(r.id))) {
                return Result.fail<IFloorDTO>('There is no room with id ' + r.id + ' in this floor')
            }
        }


        floorOrError.loadFloorMapAndUpdate(map, passagewaysCoords, elevatorsCoords, roomsCoords)

        return Result.ok<IFloorDTO>(FloorMaper.toDto(await this.floorRepo.save(floorOrError)))
    }
}