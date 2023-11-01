import { FloorMap } from "../../domain/Floor/FloorMap"

export default interface IFloorPersistence {
    floorNumber: number
    floorId: number
    floorDescription: string
    floorMap: {
        map: number[][],
        passageways: number[],
        rooms: string[],
        elevators: number[]
    }
}