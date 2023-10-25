import { Repo } from "../../../core/infra/Repo";
import { Room } from "../../../domain/Room/Room";

export default interface IRoomRepo extends Repo<Room> {
    findById(id: number): Promise<Room>
}