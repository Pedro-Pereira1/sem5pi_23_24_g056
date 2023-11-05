export interface IListFloorPassagewaysDTO {
    floorId: number
    floorNumber: number
    floorDescription: string
    floorMap: {
        passageways: number[]
    }
    floorConnected: string[]
}