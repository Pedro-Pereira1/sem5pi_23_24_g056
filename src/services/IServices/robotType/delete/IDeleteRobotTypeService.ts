import { Result } from "../../../../core/logic/Result";

export default interface IDeleteRobotTypeService {
    deleteRobotType(id: String): Promise<Result<String>>;
}