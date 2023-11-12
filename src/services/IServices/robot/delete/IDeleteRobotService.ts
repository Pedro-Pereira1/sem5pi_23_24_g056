import { Result } from "../../../../core/logic/Result";

export default interface IDeleteRobotService {
    deleteRobot(id: String): Promise<Result<String>>;
}