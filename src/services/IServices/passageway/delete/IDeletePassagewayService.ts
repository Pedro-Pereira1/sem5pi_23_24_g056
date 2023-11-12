import { Result } from "../../../../core/logic/Result";

export default interface IDeletePassagewayService {
    deletePassageway(id: number): Promise<Result<string>>
}