import { Inject, Service } from "typedi";
import IRoomRepo from "../../services/IRepos/room/IRoomRepo";
import { Model } from "mongoose";
import IRoomPersistence from "../../dataschema/passageway/IPassagewayPersistence";
import { Document } from "mongodb";
import { Room } from "../../domain/Room/Room";

@Service()
export default class RoomRepo implements IRoomRepo {

    constructor(
        @Inject('roomSchema') private roomSchema: Model<IRoomPersistence & Document>
    )
    {}

    findById(id: number): Room {
        throw new Error("Method not implemented.");
    }
    exists(t: Room): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    save(t: Room): Promise<Room> {
        throw new Error("Method not implemented.");
    }
}