import { Result } from "../../../../core/logic/Result";
import IEditElevatorDTO from "../../../../dto/elevator/IEditElevatorDTO";
import IElevatorDTO from "../../../../dto/elevator/IElevatorDTO";

export default interface IEditElevatorService {
    editElevator(elevatorDto: IEditElevatorDTO): Promise<Result<IElevatorDTO>>
}