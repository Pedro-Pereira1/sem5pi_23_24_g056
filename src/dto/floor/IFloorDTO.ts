export interface IFloorDTO {
    floorId: number
    floorNumber: number
    floorDescription: string
    floorMap: {
        map: number[][],
        passageways: number[],
        rooms: string[],
        elevators: number[]
    }
}