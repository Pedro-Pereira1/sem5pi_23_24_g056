import IElevatorDTO from "../../../dto/elevator/IElevatorDTO";
import { Result } from "../../../core/logic/Result";
import ICreateElevatorDTO from "../../../dto/elevator/ICreateElevatorDTO";

export default interface ICreateElevatorService {
    createElevator(elevatorDto: ICreateElevatorDTO): Promise<Result<IElevatorDTO>>
}