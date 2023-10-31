import { Result } from "../../../../core/logic/Result";
import { IBuildingDTO } from "../../../../dto/building/IBuildingDTO";
import { ICreateFloorDTO } from "../../../../dto/floor/ICreateFloorDTO";
import { IFloorDTO } from "../../../../dto/floor/IFloorDTO";

export default interface ICreateFloorService {
    createFloor(createFloorDTO: ICreateFloorDTO): Promise<Result<IFloorDTO>>
}
