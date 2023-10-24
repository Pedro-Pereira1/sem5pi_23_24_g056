import { Floor } from "../../domain/Floor/Floor"

export interface IBuildingPersistence {
    buildingName: string
    buildingDescription: string
    buildingCode: string
    buildingLength: number
    buildingWidth: number
    floors: [String]
}