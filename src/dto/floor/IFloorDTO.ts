export interface IFloorDTO {
    floorId: number
    floorNumber: number
    floorDescription: string
    floorMap: {
        map: number[][],
        passageways: number[],
        rooms: string[],
        elevators: number[],
        passagewaysCoords: number[][], // passagewaysCoords[i][0] = x passagewaysCoords[i][1] = y
        elevatorsCoords: number[][],
        roomCoords: number[][]
    }
}