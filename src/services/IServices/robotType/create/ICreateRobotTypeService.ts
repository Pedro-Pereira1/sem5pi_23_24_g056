import { Result } from "../../../../core/logic/Result";
import { ICreateRobotTypeDTO } from "../../../../dto/robotType/ICreateRobotTypeDTO";
import { IRobotTypeDTO } from "../../../../dto/robotType/IRobotTypeDTO";

export default interface ICreateRobotTypeService {
    createRobotType(robotTypeDTO: ICreateRobotTypeDTO): Promise<Result<IRobotTypeDTO>>
}
