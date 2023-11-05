import { Result } from "../../../../core/logic/Result";
import { IRobotDTO } from "../../../../dto/robot/IRobotDTO";

export default interface IListAllRobotsService {
    listAllRobots(): Promise<Result<IRobotDTO[]>>
}