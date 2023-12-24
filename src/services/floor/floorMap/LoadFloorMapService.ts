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
import RoomCoords from "../../../domain/Floor/RoomCoords";

@Service()
export default class LoadFloorMapService implements ILoadFloorMapService {

    constructor(
        @Inject(config.repos.floor.name) private floorRepo: IFloorRepo,
        @Inject(config.repos.building.name) private buildingRepo: IBuildingRepo
    ) { }

    public async loadFloorMap(floorLayout: ILoadFloorMapDTO): Promise<Result<IFloorDTO>> {
        const buildingOrError = await this.buildingRepo.findByBuidingCode(new BuildingCode(floorLayout.buildingCode))
        const floorOrError = await this.floorRepo.findById(floorLayout.floorId)

        if (buildingOrError == null) {
            return Result.fail<IFloorDTO>('There is no building with that code')
        }

        if (floorOrError == null) {
            return Result.fail<IFloorDTO>('There is no floor with that ID')
        }

        if(!buildingOrError.floorsNumber.includes(Number(floorOrError.id.toValue()))) {
            return Result.fail<IFloorDTO>('The floor doesn\'t belong to the building')
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

        for(const p of floorLayout.passageways) {
            if (p.length !== 5) {
                return Result.fail<IFloorDTO>('There is a problem with the coordinates of the passageway with id ' + p[0])
            }
        }

        for(const e of floorLayout.elevators) {
            if (e.length !== 3) {
                return Result.fail<IFloorDTO>('There is a problem with the coordinates of the elevator with id ' + e[0])
            }
        }

        for(const r of floorLayout.roomsCoords) {
            if (r.length !== 4) {
                return Result.fail<IFloorDTO>('There is a problem with the coordinates of the room with id ' + r[0])
            }
        }

        let passagewaysCoords: DoubleCoords[] = []
        let elevatorsCoords: SingleCoords[] = []
        let roomsCoords: RoomCoords[] = []
        let doorsCoords: [][] = []

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
            roomsCoords[i] = RoomCoords.create({
                id: floorLayout.rooms[i][0],
                x: floorLayout.roomsCoords[i][0],
                y: floorLayout.roomsCoords[i][1],
                x1: floorLayout.roomsCoords[i][2],
                y1: floorLayout.roomsCoords[i][3]
            })
        }

        for (const p of passagewaysCoords) {
            if (!(map[p.y][p.x] !== 12 || map[p.y][p.x] !== 13) && !(map[p.y1][p.x1] !== 12 || map[p.y1][p.x1] !== 13)) {
                return Result.fail<IFloorDTO>('There is no passageway in the coords: X1:' + p.x + ' Y1:' + p.y + ' X2:' + p.x1 + ' Y2: ' + p.y1)
            }
        }

        for (const e of elevatorsCoords) {
            if (map[e.y][e.x] !== 14) {
                return Result.fail<IFloorDTO>('There is no elevator in the coords: X1:' + e.x + ' Y1:' + e.y)
            }
        }

        for (const r of roomsCoords) {
            if (map[r.y][r.x] != 7 && (map[r.y1][r.x1] != 4 || map[r.y1][r.x] != 6)) {
                return Result.fail<IFloorDTO>('There is no room in the coords: X1:' + r.x + ' Y1:' + r.y + ' X2:' + r.x1 + ' Y2: ' + r.y1)
            }
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

        const roomsIds = floorOrError.map.roomsId
        for (const r of floorLayout.rooms) {
            if (!roomsIds.includes(r)) {
                return Result.fail<IFloorDTO>('There is no room with id ' + r + ' in this floor')
            }
        }

        for (const d in floorLayout.doors) {
            if (floorLayout.doors[d].length !== 2) {
                return Result.fail<IFloorDTO>('There is a problem with the coordinates of the door in index ' + d)
            }
        }

        floorOrError.loadFloorMapAndUpdate(map, passagewaysCoords, elevatorsCoords, roomsCoords, floorLayout.doors)

        await this.floorRepo.save(floorOrError)

        return Result.ok<IFloorDTO>(FloorMaper.toDto(floorOrError))
    }
}