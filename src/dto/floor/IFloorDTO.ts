export interface IFloorDTO {
    floorId: number
    floorNumber: number
    floorDescription: string
    floorMap: {
        map: string[][],
        passageways: number[],
        rooms: number[],
        elevators: number[]
    }
}