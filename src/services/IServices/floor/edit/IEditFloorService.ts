import { Result } from "../../../../core/logic/Result";
import { IFloorDTO } from "../../../../dto/floor/IFloorDTO";

export default interface ICreateFloorService {
    editFloor(FloorDTO: IFloorDTO): Promise<Result<IFloorDTO>>
}