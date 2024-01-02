import { Result } from "../../../core/logic/Result";
import IRoomDTO from "../../../dto/room/IRoomDTO";

export default interface IListAllRoomsService {
    listAllRoomsInBuilding(buildingCode: string): Promise<Result<IRoomDTO[]>>;
    listAllRooms(): Promise<Result<IRoomDTO[]>>;
}