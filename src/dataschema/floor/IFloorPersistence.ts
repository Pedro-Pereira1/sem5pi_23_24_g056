import { FloorMap } from "../../domain/Floor/FloorMap"

export default interface IFloorPersistence {
    floorNumber: number
    floorId: number
    floorDescription: string
    floorMap: {
        map: String[][],
        passageways: number[],
        rooms: number[],
        elevators: number[]
    }
}