import { Result } from "../../../../core/logic/Result";
import { Floor } from "../../../../domain/Floor/Floor";
import { IFloorDTO } from "../../../../dto/floor/IFloorDTO";
import { IListPassagewaysBetween2BuildingsDTO } from "../../../../dto/passageway/IListPassagewaysBetween2BuildingsDTO";

export default interface IListPassagewaysBetween2BuildingsService {
    listPassagewaysBetween2Buildings(building1Code: string, building2Code: string): Promise<Result<IListPassagewaysBetween2BuildingsDTO[]>>
    findFloorsByPassageway(passagewayId: number): Promise<Result<IFloorDTO[]>>
}