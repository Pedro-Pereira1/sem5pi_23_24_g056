import { Result } from "../../../../core/logic/Result";
import { IRobotTypeDTO } from "../../../../dto/robotType/IRobotTypeDTO";


export default interface IListAllRobotTypeService {
    listAllRobotTypes(): Promise<Result<IRobotTypeDTO[]>>
}