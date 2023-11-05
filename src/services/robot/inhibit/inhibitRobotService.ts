import { Inject, Service } from "typedi";
import { Result } from "../../../core/logic/Result";
import IInhibitRobotDTO from "../../../dto/robot/IInhibitRobotDTO";
import { IRobotDTO } from "../../../dto/robot/IRobotDTO";
import IInhibitRobotService from "../../IServices/robot/inhibit/IIhibitRobotService";
import config from "../../../../config";
import IRobotRepo from "../../IRepos/robot/IRobotRepo";
import { RobotMap } from "../../../mappers/robot/RobotMap";

@Service()
export default class InhibitRobotService implements IInhibitRobotService {
    
    constructor(
        @Inject(config.repos.robot.name) private robotRepo: IRobotRepo
    )
    {}
    
    public async inhibitRobot(inhibitRobotDto: IInhibitRobotDTO): Promise<Result<IRobotDTO>> {
        const robotOrError = await this.robotRepo.findById(inhibitRobotDto.id)

        if (robotOrError === null) {
            return Result.fail<IRobotDTO>('There is no robot with such ID')
        }

        robotOrError.inhibit()

        const saved = await this.robotRepo.save(robotOrError)

        return Result.ok<IRobotDTO>(RobotMap.toDto(saved))
    }

}