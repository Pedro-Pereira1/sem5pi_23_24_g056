import { Result } from "../../../core/logic/Result";
import { IBuildingDTO } from "../../../dto/building/IBuildingDTO";

export default interface IEditBuildingService {
    editBuilding(buildingDto: IBuildingDTO): Promise<Result<IBuildingDTO>>
}