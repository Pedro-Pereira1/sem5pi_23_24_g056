import { Repo } from "../../../core/infra/Repo";
import { Robot } from "../../../domain/Robot/Robot";
import { IRobotDTO } from "../../../dto/robot/IRobotDTO";

export default interface IRobotRepo extends Repo<Robot> {
    findBySerialNumberAndType(serialNumber: string, type: string): unknown;
    save(robot: Robot): Promise<Robot>
    findById(id: string): Promise<Robot>
    findByNickname(nickname: string): Promise<Robot>
    findAll(): Promise<Robot[]>
}