export default interface ICreateElevatorDTO {
    elevatorId: number,
    elevatorBrand: string
    elevatorDescription: string
    elevatorModel: string
    elevatorSerialNumber: string
    buildingCode: string
    floorIds: number[]
}