import { Result } from "../../../../core/logic/Result";
import { Robot } from "../../../../domain/Robot/Robot";
import IListRobotsByAvailableTasksDTO from "../../../../dto/robot/IListRobotsByAvailableTasksDTO";

export default interface IListRobotsByAvailableTasksService {
    listRobotsByAvailableTasks(tasksDto: IListRobotsByAvailableTasksDTO): Promise<Result<Robot>>
}