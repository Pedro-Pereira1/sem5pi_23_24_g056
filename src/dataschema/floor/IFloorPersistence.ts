export default interface IFloorPersistence {
    floorNumber: number
    floorId: number
    floorDescription: string
    floorMap: {
        map: number[][],
        passageways: number[],
        rooms: string[],
        elevators: number[],
        passagewaysCoords: number[][],
        elevatorsCoords: number[][],
        roomCoords: number[][]
    }
}