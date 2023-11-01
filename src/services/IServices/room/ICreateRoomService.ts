import { Result } from "../../../core/logic/Result";
import IRoomDTO from "../../../dto/room/IRoomDTO";

export default interface ICreateRoomService {
    createRoom(roomDTO: IRoomDTO): Promise<Result<IRoomDTO>>
}