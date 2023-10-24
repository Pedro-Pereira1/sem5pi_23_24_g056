import { Result } from "../../../../core/logic/Result";
import { IPassagewayDTO } from "../../../../dto/passageway/IPassagewayDTO";

export default interface ICreatePassagewayService {
    createPassageway(PassagewayDTO: IPassagewayDTO): Promise<Result<IPassagewayDTO>>
}