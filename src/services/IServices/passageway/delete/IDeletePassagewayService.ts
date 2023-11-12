import { Result } from "../../../../core/logic/Result";
import { IPassagewayDTO } from "../../../../dto/passageway/IPassagewayDTO";

export default interface IDeletePassagewayService {
    deleteFloor(id: number): Promise<Result<IPassagewayDTO>>
}