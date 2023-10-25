import { Result } from "../../../core/logic/Result";
import { IBuildingDTO } from "../../../dto/building/IBuildingDTO";

export default interface IListBuildingsMaxMinFloorsService {
    listBuildingsMaxMinFloors(max:number, min:number): Promise<Result<IBuildingDTO[]>>
}