export default interface ICreateElevatorDTO {
    elevatorId: number,
    elevatorIdentificationNumber: number
    elevatorBrand: string
    elevatorDescription: string
    elevatorModel: string
    elevatorSerialNumber: string
    buildingCode: string
    floorIds: number[]
}