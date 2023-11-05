import { Result } from "../../../../core/logic/Result";
import { Robot } from "../../../../domain/Robot/Robot";
import { IRobotDTO } from "../../../../dto/robot/IRobotDTO";

export default interface IListRobotsByDesignationService {
    listRobotsByDesignation(nickname: string): Promise<Result<IRobotDTO[]>>
}