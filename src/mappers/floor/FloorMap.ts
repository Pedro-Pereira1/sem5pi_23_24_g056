import { Document, Model } from "mongoose";
import { Mapper } from "../../core/infra/Mapper";
import IFloorPersistence from "../../dataschema/floor/IFloorPersistence";
import { Floor } from "../../domain/Floor/Floor";
import { IFloorDTO } from "../../dto/floor/IFloorDTO";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";

export class FloorMap extends Mapper<Floor> {

    public static toDto(Floor: Floor): IFloorDTO {
        return {
            floorNumber: Floor.id.toValue(),
            floorDescription: Floor.description.description,
            //floorMap: IFloorMapDTO
        } as IFloorDTO
    }

    public static toDomain(iFloorDTO: any | Model<IFloorPersistence & Document>): Floor {
        const FloorOrError = Floor.create(iFloorDTO)         

        return FloorOrError.isSuccess ? FloorOrError.getValue() : null
    }

    public static toPersistence(Floor: Floor): any {
        return {
            floorNumber: Floor.id.toString(),
            floorDescription: Floor.description.description,
            //floorMap: IFloorMapDTO
        }
    }
}