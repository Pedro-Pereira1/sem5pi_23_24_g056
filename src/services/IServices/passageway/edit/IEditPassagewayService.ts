import {Result} from "../../../../core/logic/Result";
import {IPassagewayDTO} from "../../../../dto/passageway/IPassagewayDTO";
import IEditPassagewayDTO from "../../../../dto/passageway/IEditPassagewayDTO";

export default interface IEditPassagewayService {
    editPassageway(passagewayDTO: IEditPassagewayDTO): Promise<Result<IPassagewayDTO>>
}