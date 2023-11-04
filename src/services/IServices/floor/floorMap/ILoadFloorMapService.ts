import { Result } from "../../../../core/logic/Result";
import { IFloorDTO } from "../../../../dto/floor/IFloorDTO";
import ILoadFloorMapDTO from "../../../../dto/floor/ILoadFloorMapDTO";

export default interface ILoadFloorMapService {
    loadFloorMap(floorLayout: ILoadFloorMapDTO): Promise<Result<IFloorDTO>>
}