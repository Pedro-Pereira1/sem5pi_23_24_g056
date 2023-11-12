import { Result } from "../../../../core/logic/Result";

export default interface IDeletePassagewayService {
    deleteFloor(id: number): Promise<Result<string>>
}