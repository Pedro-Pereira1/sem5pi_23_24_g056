import { Inject, Service } from "typedi";
import IBuildingRepo from "../../services/IRepos/building/IBuildingRepo";
import { Building } from "../../domain/Building/Building";
import { IBuildingPersistence } from "../../dataschema/building/IBuildingPersistence";
import { Document, FilterQuery, Model } from 'mongoose';
import { BuildingMap } from "../../mappers/building/BuildingMap";
import BuildingCode from "../../domain/Building/BuildingCode";
import { Result } from "../../core/logic/Result";
import { forEach } from "lodash";

@Service()
export default class BuildingRepo implements IBuildingRepo {

    constructor(
        @Inject('buildingSchema') private buildingSchema: Model<IBuildingPersistence & Document>
    ) { }

    public async exists(building: Building): Promise<boolean> {

        const idX = building.id instanceof BuildingCode ? (<BuildingCode>building.id).toValue() : building.id;

        const query = { buildingCode: idX };
        const buildingDocument = await this.buildingSchema.findOne(query as FilterQuery<IBuildingPersistence & Document>);

        return !!buildingDocument === true;
    }

    public async save(building: Building): Promise<Building> {
        const query = { buildingCode: building.id.toString() };


        const buildingDocument = await this.buildingSchema.findOne(query)

        try {
            if (buildingDocument === null) {
                const rawBuilding: any = BuildingMap.toPersistence(building)

                const buildingCreated = await this.buildingSchema.create(rawBuilding)

                return await BuildingMap.toDomain(buildingCreated)

            } else {
                buildingDocument.buildingName = building.props.buildingName.name
                buildingDocument.buildingDescription = building.desctription.description
                buildingDocument.buildingLength = building.props.buildingSize.length
                buildingDocument.buildingWidth = building.props.buildingSize.width
                buildingDocument.buildingFloors = building.floorsNumber

                await buildingDocument.save();

                return building;
            }
        } catch (err) {

            throw err
        }
    }

    public async findAll(): Promise<Building[]> {
        let buildings: Building[] = []

        const cursor = this.buildingSchema.find<Building>({});

        for await (let doc of cursor) {
            buildings.push(await BuildingMap.toDomain(doc))
        }

        return buildings
    }

    public async findByBuidingCode(buildingCode: BuildingCode): Promise<Building> {
        const query = { buildingCode: buildingCode.toString() };
        const buildingDocument = await this.buildingSchema.findOne(query as FilterQuery<IBuildingPersistence & Document>);

        if (buildingDocument != null) {

            const building = await BuildingMap.toDomain(buildingDocument);

            return building;
        }
        else
            return null;
    }

    public async findBuildingsMaxMinFloors(max: number, min: number): Promise<Building[]> {
        try {
            const buildings = await this.findAll();
            const filteredBuildings: Building[] = [];



            for (const element of buildings) {
                if (element.floors.length >= min && element.floors.length <= max) {
                    filteredBuildings.push(element);
                }
            }
            return filteredBuildings;
        } catch (error) {
            console.error("Error in findBuildingsMaxMinFloors:", error);
            throw error;
        }
    }

    public async findByFloor(floorId : number): Promise<Building> {
        const query = {buildingFloors: floorId};
        const buildingDocument = await this.buildingSchema.findOne(query as FilterQuery<IBuildingPersistence & Document>);

        if (buildingDocument != null) {

            const building = await BuildingMap.toDomain(buildingDocument);

            return building;
        }
        else
            return null;
    }

}
