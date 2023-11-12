import { Result } from "../../../core/logic/Result";

export default interface IDeleteBuildingService {
    deleteBuilding(id: String): Promise<Result<String>>;
}