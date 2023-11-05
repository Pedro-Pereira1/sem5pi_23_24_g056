import { Result } from "../../../../core/logic/Result";
import { ICreatePassagewayDTO } from "../../../../dto/passageway/ICreatePassagewayDTO";
import { IPassagewayDTO } from "../../../../dto/passageway/IPassagewayDTO";

export default interface ICreatePassagewayService {
    createPassageway(PassagewayDTO: ICreatePassagewayDTO): Promise<Result<IPassagewayDTO>>
}
