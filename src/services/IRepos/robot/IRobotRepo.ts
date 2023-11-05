import { Repo } from "../../../core/infra/Repo";
import { Robot } from "../../../domain/Robot/Robot";
import { AvailableTask } from "../../../domain/RobotType/AvailableTask";

export default interface IRobotRepo extends Repo<Robot> {
    findBySerialNumberAndType(serialNumber: string, type: string): unknown;
    save(robot: Robot): Promise<Robot>
    findById(id: string): Promise<Robot>
    findByNickname(nickname: string): Promise<Robot>
    findByAvailableTask(tasks: AvailableTask[]): Promise<Robot[]>
    findAll(): Promise<Robot[]>
}