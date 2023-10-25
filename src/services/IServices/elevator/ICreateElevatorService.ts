import IElevatorDTO from "../../../dto/elevator/IElevatorDTO";
import { Result } from "../../../core/logic/Result";



export default interface ICreateElevatorService {
    createElevator(PassagewayDTO: IElevatorDTO): Promise<Result<IElevatorDTO>>
}