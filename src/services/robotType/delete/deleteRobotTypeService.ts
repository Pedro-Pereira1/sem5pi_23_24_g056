import { Inject, Service } from "typedi";
import { Result } from "../../../core/logic/Result";
import { IBuildingDTO } from "../../../dto/building/IBuildingDTO";
import ICreateBuildingService from "../../IServices/building/ICreateBuildingService";
import config from "../../../../config";
import IBuildingRepo from "../../IRepos/building/IBuildingRepo";
import IDeleteBuildingService from "../../IServices/building/IDeleteBuildingService";
import IDeleteRobotTypeService from "../../IServices/robotType/delete/IDeleteRobotTypeService";
import { IRobotTypeDTO } from "../../../dto/robotType/IRobotTypeDTO";
import IRobotTypeRepo from "../../IRepos/robotType/IRobotTypeRepo";

@Service()
export default class deleteRobotTypeService implements IDeleteRobotTypeService {

    constructor(
        @Inject(config.repos.robotType.name) private robotTypeRepo: IRobotTypeRepo
    ) { }

    public async deleteRobotType(id: string): Promise<Result<String>> {
        try {
            const robotTypeOrError = await this.robotTypeRepo.deleteRobotType(id);

            if (robotTypeOrError.isFailure) {
                return Result.fail<String>(robotTypeOrError.errorValue());
            }

            return Result.ok<String>("RobotType deleted succesfully");


        } catch (e) {
            throw e
        }
    }
}