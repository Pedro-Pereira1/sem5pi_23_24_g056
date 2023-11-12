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
import IDeleteRobotService from "../../IServices/robot/delete/IDeleteRobotService";
import IRobotRepo from "../../IRepos/robot/IRobotRepo";

@Service()
export default class deleteRobotService implements IDeleteRobotService {

    constructor(
        @Inject(config.repos.robot.name) private robotRepo: IRobotRepo
    ) { }

    public async deleteRobot(id: string): Promise<Result<String>> {
        try {
            const robotOrError = await this.robotRepo.deleteRobot(id);

            if (robotOrError.isFailure) {
                return Result.fail<String>(robotOrError.errorValue());
            }

            return Result.ok<String>("Robot deleted succesfully");


        } catch (e) {
            throw e
        }
    }
}