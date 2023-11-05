import { Result } from "../../../../core/logic/Result";
import { IFloorDTO } from "../../../../dto/floor/IFloorDTO";
import { IEditFloorDTO } from "../../../../dto/floor/IEditFloorDTO";

export default interface ICreateFloorService {
    editFloor(FloorDTO: IEditFloorDTO): Promise<Result<IFloorDTO>>
}