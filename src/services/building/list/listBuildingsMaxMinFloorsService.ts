import { Inject, Service } from "typedi";
import { Result } from "../../../core/logic/Result";
import { IBuildingDTO } from "../../../dto/building/IBuildingDTO";
import IListBuildingsMaxMinFloorsService from "../../IServices/building/IListBuildingsMaxMinFloorsService";
import IBuildingRepo from "../../IRepos/building/IBuildingRepo";
import config from "../../../../config";
import { Building } from "../../../domain/Building/Building";
import { BuildingMap } from "../../../mappers/building/BuildingMap";
import { IBuildingListMaxMinDTO } from "../../../dto/building/IBuildingListMaxMinDTO";

@Service()
export default class listBuildingsMaxMinFloorsService implements IListBuildingsMaxMinFloorsService {

    constructor(
        @Inject(config.repos.building.name) private buildingRepo: IBuildingRepo
    )
    {}

    public async listBuildingsMaxMinFloors(max: number, min: number): Promise<Result<IBuildingDTO[]>> {
        let values: IBuildingDTO[]  = [];

        const buildings = await this.buildingRepo.findBuildingsMaxMinFloors(max,min)

        buildings.forEach((element) => {
            values.push(BuildingMap.toDto(element))
        })

        if(buildings.length === 0) {
            return Result.fail<IBuildingDTO[]>("null")
        }

        
        return Result.ok<IBuildingDTO[]>(values)
    }

}
