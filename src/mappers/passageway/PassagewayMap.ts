import { Document, Model } from "mongoose";
import { Mapper } from "../../core/infra/Mapper";
import IPassagewayPersistence from "../../dataschema/passageway/IPassagewayPersistence";
import { Passageway } from "../../domain/Passageway/Passageway";
import { IPassagewayDTO } from "../../dto/passageway/IPassagewayDTO";

export class PassagewayMap extends Mapper<Passageway> {

    public static toDto(passageway: Passageway): IPassagewayDTO {
        return {
            passagewayId: Number(passageway.id.toValue()),
            passagewayCoordinatesTopX : passageway.coordinates.props.topX,
            passagewayCoordinatesTopY : passageway.coordinates.props.topY,
            passagewayCoordinatesBottomX : passageway.coordinates.props.bottomX,
            passagewayCoordinatesBottomY : passageway.coordinates.props.bottomY,
            passagewayCoordinatesTopXB2 : passageway.coordinates.props.topXB2,
            passagewayCoordinatesTopYB2 : passageway.coordinates.props.topYB2,
            passagewayCoordinatesBottomXB2 : passageway.coordinates.props.bottomXB2,
            passagewayCoordinatesBottomYB2 : passageway.coordinates.props.bottomYB2,
        } as IPassagewayDTO
    }

    public static toDomain(IPassagewayDTO: any | Model<IPassagewayPersistence & Document>): Passageway {
        const PassagewayOrError = Passageway.create(IPassagewayDTO,100,100,100,100)     

        return PassagewayOrError.isSuccess ? PassagewayOrError.getValue() : null
    }

    public static toPersistence(passageway: Passageway): any {
        return {
            passagewayId: Number(passageway.id.toValue()),
            passagewayCoordinatesTopX : passageway.coordinates.props.topX,
            passagewayCoordinatesTopY : passageway.coordinates.props.topY,
            passagewayCoordinatesBottomX : passageway.coordinates.props.bottomX,
            passagewayCoordinatesBottomY : passageway.coordinates.props.bottomY,
            passagewayCoordinatesTopXB2 : passageway.coordinates.props.topXB2,
            passagewayCoordinatesTopYB2 : passageway.coordinates.props.topYB2,
            passagewayCoordinatesBottomXB2 : passageway.coordinates.props.bottomXB2,
            passagewayCoordinatesBottomYB2 : passageway.coordinates.props.bottomYB2,
        }
    }
}