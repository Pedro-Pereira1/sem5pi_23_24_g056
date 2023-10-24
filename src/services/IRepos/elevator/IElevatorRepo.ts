import { Repo } from "../../../core/infra/Repo";
import { Elevator } from "../../../domain/Elevator/Elevator";

export default interface IElevatorRepo extends Repo<Elevator> {
    findById(id: number): Elevator
}