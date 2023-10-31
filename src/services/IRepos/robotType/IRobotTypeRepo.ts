import { Repo } from "../../../core/infra/Repo";
import { Floor } from "../../../domain/Floor/Floor";
import { RobotType } from "../../../domain/RobotType/RobotType";

export default interface IRobotTypeRepo extends Repo<RobotType> {
    save(robotType: RobotType): Promise<RobotType>
    findById(id: string): Promise<RobotType>
}