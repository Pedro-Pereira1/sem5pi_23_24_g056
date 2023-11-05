import { Inject, Service } from "typedi";
import { Result } from "../../../core/logic/Result";
import { IFloorDTO } from "../../../dto/floor/IFloorDTO";
import IListAllBuildingsService from "../../IServices/building/IListAllBuildingsService";
import IBuildingRepo from "../../IRepos/building/IBuildingRepo";
import config from "../../../../config";
import { Building } from "../../../domain/Building/Building";
import { BuildingMap } from "../../../mappers/building/BuildingMap";
import IListAllFloorsService from "../../IServices/floor/list/IListAllFloorsService";
import { IListAllFloorsDTO } from "../../../dto/floor/IListAllFloorsDTO";
import BuildingCode from "../../../domain/Building/BuildingCode";
import { FloorMaper } from "../../../mappers/floor/FloorMaper";

@Service()
export default class listAllFloorsService implements IListAllFloorsService {

    constructor(
        @Inject(config.repos.building.name) private buildingRepo: IBuildingRepo
    )
    {}




    public async listAllFloors(buildingId: string): Promise<Result<IFloorDTO[]>> {


        const buildingResult = await this.buildingRepo.findByBuidingCode(new BuildingCode(buildingId))
        if(buildingResult === null) {
           return Result.fail<IFloorDTO[]>(`Building ${buildingId} not found`)
        }


        const floorsResult = buildingResult.floors

        if(floorsResult.length === 0) {
            return Result.fail<IFloorDTO[]>(`Building ${buildingId} has no floors`)
        }

        let resolve: IFloorDTO[] = []

        floorsResult.forEach(b => {
            resolve.push(FloorMaper.toDto(b))
        })

        return Result.ok<IFloorDTO[]>(resolve)
    }

}
