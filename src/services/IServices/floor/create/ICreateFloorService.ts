import { Result } from "../../../../core/logic/Result";
import { IFloorDTO } from "../../../../dto/floor/IFloorDTO";

export default interface ICreateFloorService {
    createFloor(FloorDto: IFloorDTO): Promise<Result<IFloorDTO>>
}