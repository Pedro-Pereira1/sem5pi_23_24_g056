import { Repo } from "../../../core/infra/Repo";
import { Elevator } from "../../../domain/Elevator/Elevator";

export default interface IElevatorRepo extends Repo<Elevator> {
    save(elevator: Elevator): Promise<Elevator>
    findById(id: number): Promise<Elevator>
}