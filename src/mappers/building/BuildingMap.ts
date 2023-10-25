import { Document, Model } from "mongoose";
import { Mapper } from "../../core/infra/Mapper";
import { IBuildingPersistence } from "../../dataschema/building/IBuildingPersistence";
import { Building } from "../../domain/Building/Building";
import { IBuildingDTO } from "../../dto/building/IBuildingDTO";
import Container from "typedi";
import config from "../../../config";
import IFloorRepo from "../../services/IRepos/floor/IFloorRepo";
import { Floor } from "../../domain/Floor/Floor";
import { BuildingName } from "../../domain/Building/BuildingName";
import { BuildingDescription } from "../../domain/Building/BuildingDescription";
import { BuildingSize } from "../../domain/Building/BuildingSize";

export class BuildingMap extends Mapper<Building> {

    public static toDto(building: Building): IBuildingDTO {
        return {
            buildingName: building.name.name,
            buildingDescription: building.desctription.description,
            buildingCode: building.code.toString(),
            buildingLength: building.size.length,
            buildingWidth: building.size.width,
            buildingFloors: building.floorsNumber
        } as IBuildingDTO
    }

    public static toDomain(buildingRaw: any | Model<IBuildingPersistence & Document>): Building {
        const floorRepo: IFloorRepo = Container.get(config.repos.floor.name)

        let floorsOfBuilding: Floor[] = []

        buildingRaw.buildingFloors.forEach(async (f: number) => {
            floorsOfBuilding.push(await floorRepo.findByNumber(f))
        });

        const buildingOrError = Building.create(
            {
                buildingName: new BuildingName({ value: buildingRaw.buildingName }),
                buildingDescription: new BuildingDescription({ value: buildingRaw.buildingDescription }),
                buildingSize: new BuildingSize({ length: buildingRaw.buildingLength, width: buildingRaw.buildingWidth }),
                floors: floorsOfBuilding,
            }, buildingRaw.buildingCode)

        return buildingOrError.isSuccess ? buildingOrError.getValue() : null
    }

    public static toPersistence(building: Building): any {
        return {
            buildingName: building.name.name,
            buildingDescription: building.desctription.description,
            buildingCode: building.code.toString(),
            buildingLength: building.size.length,
            buildingWidth: building.size.width,
            buildingFloors: building.floorsNumber
        }
    }
}