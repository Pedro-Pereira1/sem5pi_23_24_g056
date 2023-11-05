import { Result } from "../../../../core/logic/Result";
import { Robot } from "../../../../domain/Robot/Robot";

export default interface IListRobotsByDesignation {
    listRobotsByDesignation(nickname: string): Promise<Result<Robot>>
}