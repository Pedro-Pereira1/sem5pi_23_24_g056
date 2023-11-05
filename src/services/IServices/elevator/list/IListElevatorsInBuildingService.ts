import { Result } from "../../../../core/logic/Result";
import IListElevatorsInBuildingDTO from "../../../../dto/elevator/IListElevatorsInBuildingDTO";

export default interface IListElevatorsInBuildingService {
    listElevatorsInBuilding(buildingCode: string): Promise<Result<IListElevatorsInBuildingDTO[]>>
}