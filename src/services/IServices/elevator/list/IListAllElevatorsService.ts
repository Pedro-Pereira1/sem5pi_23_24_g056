import {Result} from "../../../../core/logic/Result";
import IListAllElevatorsDTO from "../../../../dto/elevator/IListAllElevatorsDTO";

export default interface IListAllElevatorsService {
    listAllElevators(): Promise<Result<IListAllElevatorsDTO[]>>
}