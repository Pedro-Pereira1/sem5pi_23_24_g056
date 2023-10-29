import { Result } from "../../../../core/logic/Result";
import { ICreateRobotDTO } from "../../../../dto/robot/ICreateRobotDTO";
import { IRobotDTO } from "../../../../dto/robot/IRobotDTO";

export default interface ICreateRobotService {
    createRobot(robotDTO: ICreateRobotDTO): Promise<Result<IRobotDTO>>
}
