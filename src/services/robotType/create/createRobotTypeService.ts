import { Inject, Service } from "typedi";
import { Result } from "../../../core/logic/Result";
import config from "../../../../config";
import ICreateRobotTypeService from "../../IServices/robotType/create/ICreateRobotTypeService";
import { ICreateRobotTypeDTO } from "../../../dto/robotType/ICreateRobotTypeDTO";
import { IRobotTypeDTO } from "../../../dto/robotType/IRobotTypeDTO";
import { RobotType } from "../../../domain/RobotType/RobotType";
import { RobotBrand } from "../../../domain/RobotType/RobotBrand";
import { RobotModel } from "../../../domain/RobotType/RobotModel";
import IRobotTypeRepo from "../../IRepos/robotType/IRobotTypeRepo";
import { RobotTypeMap } from "../../../mappers/robotType/RobotTypeMap";
import { AvailableTask } from "../../../domain/RobotType/AvailableTask";

@Service()
export default class createRobotTypeService implements ICreateRobotTypeService {

    constructor(
        @Inject(config.repos.robotType.name) private robotTypeRepo: IRobotTypeRepo
    ) { }


    public async createRobotType(robotTypeDTO: ICreateRobotTypeDTO): Promise<Result<IRobotTypeDTO>> {

        try {
            const robotTypeExists = await this.robotTypeRepo.findById(robotTypeDTO.robotTypeID)
            if(robotTypeExists != null){
                return Result.fail<IRobotTypeDTO>("RobotType already exists")
            }

            const robotTypeOrError = RobotType.create(robotTypeDTO,robotTypeDTO.robotTypeID)
            if (robotTypeOrError.isFailure) {
                return Result.fail<IRobotTypeDTO>(robotTypeOrError.errorValue())
            }

            const robotTypeResult = robotTypeOrError.getValue()
            await this.robotTypeRepo.save(robotTypeResult);
            const robotTypeDtoResult = RobotTypeMap.toDto(robotTypeResult) as IRobotTypeDTO

            return Result.ok<IRobotTypeDTO>(robotTypeDtoResult)

        } catch (e) {
            throw e
        }
    }
}
