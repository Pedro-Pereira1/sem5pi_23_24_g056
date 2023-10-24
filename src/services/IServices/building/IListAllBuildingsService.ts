import { Result } from "../../../core/logic/Result";
import { IBuildingDTO } from "../../../dto/building/IBuildingDTO";

export default interface IListAllBuildingsService {
    listAllBuildings(): Promise<Result<IBuildingDTO[]>>
}