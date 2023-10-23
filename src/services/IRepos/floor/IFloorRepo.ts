import { Floor } from "../../../domain/Floor/Floor";

export default interface IFloorRepo {
    save(floor: Floor): Floor
    findByNumber(number: number): Floor
}