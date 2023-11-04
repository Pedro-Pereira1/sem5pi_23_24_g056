import { Result } from "../../../../core/logic/Result";
import IElevatorDTO from "../../../../dto/elevator/IElevatorDTO";

export default interface IListElevatorsInBuildingService {
    listElevatorsInBuilding(buildingCode: string): Promise<Result<IElevatorDTO[]>>
}