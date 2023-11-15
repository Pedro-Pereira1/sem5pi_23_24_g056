import {Result} from "../../../../core/logic/Result";
import IEditPassagewayDTO from "../../../../dto/passageway/IEditPassagewayDTO";

export default interface IListAllPassagewaysService {
    listAllPassageways(): Promise<Result<IEditPassagewayDTO[]>>
}