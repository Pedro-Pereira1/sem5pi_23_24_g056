import { Result } from "../../../../core/logic/Result";
import { IFloorDTO } from "../../../../dto/floor/IFloorDTO";
import { IPassagewayDTO } from "../../../../dto/passageway/IPassagewayDTO";

export default interface ICreatePassagewayService {
    createPassageway(PassagewayDTO: IPassagewayDTO): Promise<Result<IPassagewayDTO>>
}
