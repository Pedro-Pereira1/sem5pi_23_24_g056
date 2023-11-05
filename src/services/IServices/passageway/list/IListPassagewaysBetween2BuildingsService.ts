import { Result } from "../../../../core/logic/Result";
import { IListPassagewaysBetween2BuildingsDTO } from "../../../../dto/passageway/IListPassagewaysBetween2BuildingsDTO";

export default interface IListPassagewaysBetween2BuildingsService {
    listPassagewaysBetween2BuildingsService(building1Code: string, building2Code: string): Promise<Result<IListPassagewaysBetween2BuildingsDTO[]>>
}