import { Inject, Service } from "typedi";
import IBuildingRepo from "../../services/IRepos/building/IBuildingRepo";
import { Building } from "../../domain/Building/Building";
import { IBuildingPersistence } from "../../dataschema/building/IBuildingPersistence";
import { Document, FilterQuery, Model } from 'mongoose';
import { BuildingMap } from "../../mappers/building/BuildingMap";
import BuildingCode from "../../domain/Building/BuildingCode";

@Service()
export default class BuildingRepo implements IBuildingRepo {

    constructor(
        @Inject('buildingSchema') private buildingSchema: Model<IBuildingPersistence & Document>
    ) { }

    exists(t: Building): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    public async save(building: Building): Promise<Building> {
        const query = { buildingCode: building.id.toString() };

        const buildingDocument = await this.buildingSchema.findOne(query)

        try {
            if(buildingDocument === null) {

                const rawBuilding: any = BuildingMap.toPersistence(building)

                const buildingCreated = await this.buildingSchema.create(rawBuilding)

                return BuildingMap.toDomain(buildingCreated)

            } else {
                buildingDocument.buildingName = building.props.buildingName.name
                buildingDocument.buildingDescription = building.desctription.description
                buildingDocument.buildingLength = building.props.buildingSize.length
                buildingDocument.buildingWidth = building.props.buildingSize.width
                buildingDocument.floors = building.floorsNumber

                await buildingDocument.save()

                return building
            }
        } catch (err) {
            throw err
        }



        throw new Error("Method not implemented.");
    }

    findByBuidingCode(buildingCode: BuildingCode): Promise<Building> {
        throw new Error("Method not implemented.");
    }

}
