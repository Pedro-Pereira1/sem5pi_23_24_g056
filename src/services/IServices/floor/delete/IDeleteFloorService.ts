import { Result } from "../../../../core/logic/Result";
import { IFloorDTO } from "../../../../dto/floor/IFloorDTO";

export default interface IDeleteFloorService {
    deleteFloor(id: number): Promise<Result<IFloorDTO>>
}