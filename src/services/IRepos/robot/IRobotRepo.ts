import { Repo } from "../../../core/infra/Repo";
import { Robot } from "../../../domain/Robot/Robot";

export default interface IRobotRepo extends Repo<Robot> {
    findBySerialNumberAndType(serialNumber: string, type: string): unknown;
    save(robot: Robot): Promise<Robot>
    findById(id: string): Promise<Robot>
}