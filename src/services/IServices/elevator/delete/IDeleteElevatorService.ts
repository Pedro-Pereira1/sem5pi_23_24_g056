import IElevatorDTO from "../../../../dto/elevator/IElevatorDTO";
import { Result } from "../../../../core/logic/Result";
import IEditElevatorDTO from "../../../../dto/elevator/IEditElevatorDTO";

export default interface IDeleteElevatorService {
    deleteElevator(elevatorDto: IEditElevatorDTO): Promise<Result<boolean>>
}