import {Result} from "../../../../core/logic/Result";
import {IListFloorPassagewaysDTO} from "../../../../dto/floor/IListFloorPassagewaysDTO";

export default interface IListFloorsPassagewaysService {
    listFloorsPassageways(buildingCode: string): Promise<Result<IListFloorPassagewaysDTO[]>>
}