import { Inject, Service } from "typedi";
import { Result } from "../../../core/logic/Result";
import config from "../../../../config";
import ICreateRobotService from "../../IServices/robot/create/ICreateRobotService";
import { ICreateRobotDTO } from "../../../dto/robot/ICreateRobotDTO";
import { IRobotDTO } from "../../../dto/robot/IRobotDTO";
import IRobotRepo from "../../IRepos/robot/IRobotRepo";
import { Nickname } from "../../../domain/Robot/Nickname";
import { OperationStatus } from "../../../domain/Robot/OperationStatus";
import { SerialNumber } from "../../../domain/Robot/SerialNumber";
import { RobotDescription } from "../../../domain/Robot/RobotDescription";
import IRobotTypeRepo from "../../IRepos/robotType/IRobotTypeRepo";
import { RobotMap } from "../../../mappers/robot/RobotMap";
import { Robot } from "../../../domain/Robot/Robot";
import { Code } from "../../../domain/Robot/Code";


@Service()
export default class createRobotService implements ICreateRobotService {

    constructor(
        @Inject(config.repos.robot.name) private robotRepo: IRobotRepo,
        @Inject(config.repos.robotType.name) private robotTypeRepo: IRobotTypeRepo
    ) { }


    public async createRobot(robotDTO: ICreateRobotDTO): Promise<Result<IRobotDTO>> {

        try {

            const robotExists = await this.robotRepo.findById(robotDTO.code)
            if(robotExists != null){
                return Result.fail<IRobotDTO>("Robot already exists")
            }

            const typeOrError = await this.robotTypeRepo.findById(robotDTO.type)
            if(typeOrError == null){
                return Result.fail<IRobotDTO>("Robot Type not found")
            }

            const robotDuplicatedNickname = await this.robotRepo.findByNickname(robotDTO.nickname)
            if(robotDuplicatedNickname != null){
                return Result.fail<IRobotDTO>("Robot with this nickname already exists")
            }

            const robotOfType = await this.robotRepo.findBySerialNumberAndType(robotDTO.serialNumber,robotDTO.type)
            if(robotOfType){
                return Result.fail<IRobotDTO>("Robot of this type and serial number already exists")
            }

            const robotOrError = Robot.create(robotDTO,typeOrError,robotDTO.code, true)
            if (robotOrError.isFailure) {
                return Result.fail<IRobotDTO>(robotOrError.errorValue())
            }

            const robotResult = robotOrError.getValue()

            await this.robotRepo.save(robotResult);
            
            const robotDtoResult = RobotMap.toDto(robotResult) as IRobotDTO

            return Result.ok<IRobotDTO>(robotDtoResult)

        } catch (e) {
            throw e
        }
    }
}
