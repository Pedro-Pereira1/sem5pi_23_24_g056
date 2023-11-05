import { Document, Model } from "mongoose";
import { Mapper } from "../../core/infra/Mapper";
import IPassagewayPersistence from "../../dataschema/passageway/IPassagewayPersistence";
import { Passageway } from "../../domain/Passageway/Passageway";
import { IPassagewayDTO } from "../../dto/passageway/IPassagewayDTO";
import { NumericDictionary } from "lodash";
import { IListPassagewaysBetween2BuildingsDTO } from "../../dto/passageway/IListPassagewaysBetween2BuildingsDTO";

export class PassagewayMap extends Mapper<Passageway> {

    public static toDto(passageway: Passageway): IPassagewayDTO {
        return {
            passagewayId: Number(passageway.id.toValue())
        } as IPassagewayDTO
    }

    public static toDtoList(passageway: Passageway, floorNumberBuilding1: number, floorNumberBuilding2: number): IListPassagewaysBetween2BuildingsDTO {
        return {
            passagewayId: Number(passageway.id.toValue()),
            floorNumberBuilding1: floorNumberBuilding1,
            floorNumberBuilding2: floorNumberBuilding2
        } as IListPassagewaysBetween2BuildingsDTO
    }

    public static toDomain(IPassagewayDTO: any | Model<IPassagewayPersistence & Document>): Passageway {
        const PassagewayOrError = Passageway.create(IPassagewayDTO)

        return PassagewayOrError.isSuccess ? PassagewayOrError.getValue() : null
    }

    public static toPersistence(passageway: Passageway): any {
        return {
            passagewayId: Number(passageway.id.toValue())
        }
    }
}
