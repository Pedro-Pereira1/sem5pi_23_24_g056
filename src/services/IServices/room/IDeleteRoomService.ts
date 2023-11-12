import { Result } from "../../../core/logic/Result";

export default interface IDeleteRoomService {
    deleteRoom(roomId: string): Promise<Result<string>>;
}