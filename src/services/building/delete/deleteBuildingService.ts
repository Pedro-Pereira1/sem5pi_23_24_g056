import { Inject, Service } from "typedi";
import { Result } from "../../../core/logic/Result";
import { IBuildingDTO } from "../../../dto/building/IBuildingDTO";
import ICreateBuildingService from "../../IServices/building/ICreateBuildingService";
import config from "../../../../config";
import IBuildingRepo from "../../IRepos/building/IBuildingRepo";
import IDeleteBuildingService from "../../IServices/building/IDeleteBuildingService";

@Service()
export default class deleteBuildingService implements IDeleteBuildingService {

    constructor(
        @Inject(config.repos.building.name) private buildingRepo: IBuildingRepo
    ) { }

    public async deleteBuilding(id: String): Promise<Result<String>> {
        try {
            const buildingOrError = await this.buildingRepo.deleteBuilding(id);

            if (buildingOrError.isFailure) {
                return Result.fail<String>(buildingOrError.errorValue());
            }

            return Result.ok<String>("Building deleted succesfully");


        } catch (e) {
            throw e
        }
    }
}