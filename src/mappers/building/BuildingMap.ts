import { Document, Model } from "mongoose";
import { Mapper } from "../../core/infra/Mapper";
import { IBuildingPersistence } from "../../dataschema/building/IBuildingPersistence";
import { Building } from "../../domain/Building/Building";
import { IBuildingDTO } from "../../dto/building/IBuildingDTO";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";

export class BuildingMap extends Mapper<Building> {

    public static toDto(building: Building): IBuildingDTO {
        return {
            buildingName: building.name.name,
            buildingDescription: building.desctription.description,
            buildingCode: building.code.toString(),
            buildingLength: building.size.length,
            buildingWidth: building.size.width
        } as IBuildingDTO
    }

    public static toDomain(iBuildingDTO: any | Model<IBuildingPersistence & Document>): Building {
        const buildingOrError = Building.create(iBuildingDTO)         

        return buildingOrError.isSuccess ? buildingOrError.getValue() : null
    }

    public static toPersistence(building: Building): any {
        return {
            buildingName: building.name.name,
            buildingDescription: building.desctription.description,
            buildingCode: building.code.toString(),
            buildingLength: building.size.length,
            buildingWidth: building.size.width
        }
    }
}