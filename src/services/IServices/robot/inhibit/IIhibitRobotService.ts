import { Result } from "../../../../core/logic/Result";
import IInhibitRobotDTO from "../../../../dto/robot/IInhibitRobotDTO";
import { IRobotDTO } from "../../../../dto/robot/IRobotDTO";

export default interface IInhibitRobotService {
    inhibitRobot(inhibitRobotDto: IInhibitRobotDTO): Promise<Result<IRobotDTO>>
}