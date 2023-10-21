import { Result } from "../../../core/logic/Result";
import { IBuildingDTO } from "../../../dto/building/IBuildingDTO";

export default interface ICreateBuildingService {
    createBuilding(BuildingDto: IBuildingDTO): Promise<Result<IBuildingDTO>>
}