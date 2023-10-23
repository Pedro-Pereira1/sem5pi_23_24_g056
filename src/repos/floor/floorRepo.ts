import { Inject, Service } from "typedi";
import IFloorRepo from "../../services/IRepos/floor/IFloorRepo";
import { Floor } from "../../domain/Floor/Floor";
import IFloorPersistence from "../../dataschema/floor/IFloorPersistence";
import { Document } from "mongodb";
import { Model } from "mongoose";

@Service()
export default class FloorRepo implements IFloorRepo {

    constructor(
        @Inject('floorSchema') private floorSchema: Model<IFloorPersistence & Document>
    )
    {}

    save(floor: Floor): Promise<Floor> {
        throw new Error("Method not implemented.");
    }
    findByNumber(number: number): Promise<Floor> {
        throw new Error("Method not implemented.");
    }
    exists(floor: Floor): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}