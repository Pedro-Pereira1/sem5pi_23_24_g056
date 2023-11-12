import { Result } from "../../../../core/logic/Result";

export default interface IDeleteFloorService {
    deleteFloor(id: number): Promise<Result<string>>;
}