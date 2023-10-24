import { IFloorMapDTO } from "./IFloorMapDTO"


export interface IFloorDTO {
    floorNumber: number
    floorDescription: string
    floorMap: IFloorMapDTO
}