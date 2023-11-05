import { Repo } from "../../../core/infra/Repo";
import { Floor } from "../../../domain/Floor/Floor";

export default interface IFloorRepo extends Repo<Floor> {
    save(floor: Floor): Promise<Floor>
    findById(id: number): Promise<Floor>
    findByElevator(id: number): Promise<Floor[]>
    findByPassageway(passagewayId: number): Promise<Floor[]>
}