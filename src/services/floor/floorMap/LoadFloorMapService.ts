import { Inject, Service } from "typedi";
import ILoadFloorMapService from "../../IServices/floor/floorMap/ILoadFloorMapService";
import { IFloorDTO } from "../../../dto/floor/IFloorDTO";
import config from "../../../../config";
import IFloorRepo from "../../IRepos/floor/IFloorRepo";
import { Result } from "../../../core/logic/Result";
import { FloorMaper } from "../../../mappers/floor/FloorMaper";
import IBuildingRepo from "../../IRepos/building/IBuildingRepo";
import BuildingCode from "../../../domain/Building/BuildingCode";

@Service()
export default class LoadFloorMapService implements ILoadFloorMapService {

    constructor(
        @Inject(config.repos.floor.name) private floorRepo: IFloorRepo,
        @Inject(config.repos.building.name) private buildingRepo: IBuildingRepo
    ){}

    public async loadFloorMap(buildingCode: string, floorId: number, floorLayout: Buffer): Promise<Result<IFloorDTO>> {
        const buildingOrError = await this.buildingRepo.findByBuidingCode(new BuildingCode(buildingCode))
        const floorOrError = await this.floorRepo.findById(floorId)

        if (buildingOrError == null) {
            return Result.fail<IFloorDTO>('There is no building with that code')
        }

        if (floorOrError == null) {
            return Result.fail<IFloorDTO>('There is no floor with that ID')
        }

        const rawLayout = floorLayout.toString('utf-8')
        const layers = rawLayout.split('\n')

        let mapString:string[][] = []
        let map: number[][] = []

        for (let layer of layers) {
            mapString.push(layer.split(','))
        }

        if (mapString.length > buildingOrError.size.length) {
            return Result.fail<IFloorDTO>('The floor map has a bigger length than the maximum allowed by that building')
        }

        if (mapString[0].length > buildingOrError.size.width) {
            return Result.fail<IFloorDTO>('The floor map has a bigger width than the maximum allowed by that building')
        }

        let number = 0

        for(let i = 0; i < mapString.length; i++) {
            for(let j = 0; i < mapString[0].length; j++) {
                number = Number(mapString[i][j])

                if (number > 14) {
                    return Result.fail<IFloorDTO>('invalid sintax')
                }

                map[i][j] = number
            }
        }


        floorOrError.loadFloorMapAndUpdate(map)

        return Result.ok<IFloorDTO>(FloorMaper.toDto(await this.floorRepo.save(floorOrError)))
    }
}