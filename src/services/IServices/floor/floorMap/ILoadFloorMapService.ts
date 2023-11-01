import { Result } from "../../../../core/logic/Result";
import { IFloorDTO } from "../../../../dto/floor/IFloorDTO";

export default interface ILoadFloorMapService {
    loadFloorMap(buildingCode: string, floorId: number, floorLayout: Buffer): Promise<Result<IFloorDTO>>
}