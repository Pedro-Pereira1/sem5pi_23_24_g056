export default interface ILoadFloorMapDTO {
    floorId: number
    buildingCode: string
    map: number[][]
    passageways: number[][]
    elevators: number[][]
    rooms: number[][]
}