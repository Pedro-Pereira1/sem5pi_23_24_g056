import { Repo } from "../../../core/infra/Repo";
import { Floor } from "../../../domain/Floor/Floor";

export default interface IFloorRepo extends Repo<Floor> {
    save(floor: Floor): Promise<Floor>
    findByNumber(number: number): Promise<Floor>
}