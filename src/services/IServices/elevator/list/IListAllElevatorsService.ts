import {Result} from "../../../../core/logic/Result";
import IListAllElevatorsDTO from "../../../../dto/elevator/IListAllElevatorsDTO";
import { IFloorDTO } from "../../../../dto/floor/IFloorDTO";

export default interface IListAllElevatorsService {
    listAllElevators(): Promise<Result<IListAllElevatorsDTO[]>>
    listFloorsByElevatorId(elevatorId: string): Promise<Result<IFloorDTO[]>>
}