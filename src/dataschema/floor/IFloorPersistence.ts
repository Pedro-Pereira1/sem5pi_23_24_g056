import { FloorMap } from "../../domain/Floor/FloorMap"

export default interface IFloorPersistence {
    floorNumber: number
    floorDescription: string
    floorMap: {
        map: [[String]],
        passageways: [String],
        rooms: [String],
        elevators: [String]
    }
}