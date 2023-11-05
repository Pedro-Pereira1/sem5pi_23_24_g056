import { Result } from "../../../../core/logic/Result";
import { Robot } from "../../../../domain/Robot/Robot";
import IListRobotsByAvailableTasksDTO from "../../../../dto/robot/IListRobotsByAvailableTasksDTO";
import { IRobotDTO } from "../../../../dto/robot/IRobotDTO";

export default interface IListRobotsByAvailableTasksService {
    listRobotsByAvailableTasks(tasksDto: IListRobotsByAvailableTasksDTO): Promise<Result<IRobotDTO[]>>
}