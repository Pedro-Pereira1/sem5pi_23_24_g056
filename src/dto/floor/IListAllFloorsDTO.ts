export interface IListAllFloorsDTO {
    floorId: number
    floorNumber: number
    floorDescription: string
    floorMap: {
        map: string[][],
        passageways: string[],
        rooms: string[],
        elevators: string[]
    }
    buildingID: string
}