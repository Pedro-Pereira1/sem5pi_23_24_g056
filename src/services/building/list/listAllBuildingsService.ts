import { Inject, Service } from "typedi";
import { Result } from "../../../core/logic/Result";
import { IBuildingDTO } from "../../../dto/building/IBuildingDTO";
import IListAllBuildingsService from "../../IServices/building/IListAllBuildingsService";
import IBuildingRepo from "../../IRepos/building/IBuildingRepo";
import config from "../../../../config";
import { Building } from "../../../domain/Building/Building";
import { BuildingMap } from "../../../mappers/building/BuildingMap";

@Service()
export default class listAllBuildingsService implements IListAllBuildingsService {

    constructor(
        @Inject(config.repos.building.name) private buildingRepo: IBuildingRepo
    )
    {}

    public async listAllBuildings(): Promise<Result<IBuildingDTO[]>> {
        const buildings = await this.buildingRepo.findAll()

        if(buildings.length === 0) {
            return Result.fail<IBuildingDTO[]>(null)
        }
        
        let resolve: IBuildingDTO[] = []

        buildings.forEach(b => {
            resolve.push(BuildingMap.toDto(b))
        })
        
        return Result.ok<IBuildingDTO[]>(resolve)
    }

}