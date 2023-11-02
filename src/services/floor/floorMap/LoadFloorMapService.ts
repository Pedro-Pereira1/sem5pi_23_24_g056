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
import IdCoords from "../../../domain/Floor/IdCoords";

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

        let passagewaysCoords: IdCoords[] = []
        let elevatorsCoords: IdCoords[] = []
        let roomsCoords: IdCoords[] = []

        for (let i = 0; i < floorLayout.passageways.length; i++) {
            passagewaysCoords[i] = IdCoords.create({
                id: floorLayout.passageways[i][0],
                x: floorLayout.passageways[i][1],
                y: floorLayout.passageways[i][2],
                x1: floorLayout.passageways[i][3],
                y1: floorLayout.passageways[i][4]
            })
        }

        for (let i = 0; i < floorLayout.elevators.length; i++) {
            elevatorsCoords[i] = IdCoords.create({
                id: floorLayout.elevators[i][0],
                x: floorLayout.elevators[i][1],
                y: floorLayout.elevators[i][2]
            })
        }

        for (let i = 0; i < floorLayout.rooms.length; i++) {
            roomsCoords[i] = IdCoords.create({
                id: floorLayout.rooms[i][0],
                x: floorLayout.rooms[i][1],
                y: floorLayout.rooms[i][2],
                x1: floorLayout.rooms[i][3],
                y1: floorLayout.rooms[i][4]
            })
        }

        floorOrError.loadFloorMapAndUpdate(map, passagewaysCoords, elevatorsCoords, roomsCoords)
        console.log(floorOrError.map.props.elevatorsCoords)

        return Result.ok<IFloorDTO>(FloorMaper.toDto(await this.floorRepo.save(floorOrError)))
    }
}