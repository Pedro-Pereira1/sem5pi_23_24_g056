import { Inject, Service } from "typedi";
import IBuildingRepo from "../../services/IRepos/building/IBuildingRepo";
import { Building } from "../../domain/Building/Building";
import { BuildingName } from "../../domain/Building/BuildingName";
import { IBuildingPersistence } from "../../dataschema/building/IBuildingPersistence";
import { Document, FilterQuery, Model } from 'mongoose';

@Service()
export default class BuildingRepo implements IBuildingRepo {

    constructor(
        @Inject('buildingSchema') private buildingSchema: Model<IBuildingPersistence & Document>
        ) 
    {}

    exists(t: Building): Promise<boolean> {
        throw new Error("Method not implemented.");
    }


    save(building: Building): Promise<Building> {
        throw new Error("Method not implemented.");
    }


    findByBuildingName(buildingName: BuildingName): Promise<Building> {
        throw new Error("Method not implemented.");
    }
    
    
    
}
