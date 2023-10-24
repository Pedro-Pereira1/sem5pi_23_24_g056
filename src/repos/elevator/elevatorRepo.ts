import { Inject, Service } from "typedi";
import IElevatorRepo from "../../services/IRepos/elevator/IElevatorRepo";
import { Elevator } from "../../domain/Elevator/Elevator";
import IElevatorPersistence from "../../dataschema/elevator/IElevatorPersistence";
import { Document } from "mongodb";
import { Model } from "mongoose";

@Service()
export default class ElevatorRepo implements IElevatorRepo {
    
    constructor(
        @Inject('elevatorSchema') private elevatorSchema : Model<IElevatorPersistence & Document>
    ) {}


    findById(id: number): Elevator {
        throw new Error("Method not implemented.");
    }

    exists(t: Elevator): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    save(t: Elevator): Promise<Elevator> {
        throw new Error("Method not implemented.");
    }
    
}