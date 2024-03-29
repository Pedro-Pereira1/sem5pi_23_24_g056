import { Repo } from "../../../core/infra/Repo";
import { Room } from "../../../domain/Room/Room";

export default interface IRoomRepo extends Repo<Room> {
    findById(id: string): Promise<Room>
    save(room: Room): Promise<Room>
    exists(room: Room)
    delete(id: string): Promise<boolean>
}