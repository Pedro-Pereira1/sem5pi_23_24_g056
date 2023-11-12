import { Repo } from "../../../core/infra/Repo";
import { Result } from "../../../core/logic/Result";
import { Floor } from "../../../domain/Floor/Floor";
import { RobotType } from "../../../domain/RobotType/RobotType";

export default interface IRobotTypeRepo extends Repo<RobotType> {
    save(robotType: RobotType): Promise<RobotType>
    findById(id: string): Promise<RobotType>
    deleteRobotType(id: string): Promise<Result<String>>
    findAll(): Promise<RobotType[]>
}