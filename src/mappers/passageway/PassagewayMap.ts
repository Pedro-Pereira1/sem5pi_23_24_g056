import { Document, Model } from "mongoose";
import { Mapper } from "../../core/infra/Mapper";
import IPassagewayPersistence from "../../dataschema/passageway/IPassagewayPersistence";
import { Passageway } from "../../domain/Passageway/Passageway";
import { IPassagewayDTO } from "../../dto/passageway/IPassagewayDTO";

export class PassagewayMap extends Mapper<Passageway> {

    public static toDto(passageway: Passageway): IPassagewayDTO {
        return {
            passagewayId: Number(passageway.id.toValue())
        } as IPassagewayDTO
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
