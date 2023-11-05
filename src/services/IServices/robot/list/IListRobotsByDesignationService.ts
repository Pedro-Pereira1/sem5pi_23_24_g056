import { Result } from "../../../../core/logic/Result";
import { Robot } from "../../../../domain/Robot/Robot";

export default interface IListRobotsByDesignationService {
    listRobotsByDesignation(nickname: string): Promise<Result<Robot>>
}