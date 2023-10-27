import { Result } from "../../../../core/logic/Result";
import { Building } from "../../../../domain/Building/Building";
import { IFloorDTO } from "../../../../dto/floor/IFloorDTO";
import { IListAllFloorsDTO } from "../../../../dto/floor/IListAllFloorsDTO";


export default interface IListAllFloorsService {
    listAllFloors(buildingId: string): Promise<Result<IFloorDTO[]>>
}