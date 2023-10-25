export interface IFloorDTO {
    floorId: number
    floorNumber: number
    floorDescription: string
    floorMap: {
        map: string[][],
        passageways: string[],
        rooms: string[],
        elevators: string[]
    }
}