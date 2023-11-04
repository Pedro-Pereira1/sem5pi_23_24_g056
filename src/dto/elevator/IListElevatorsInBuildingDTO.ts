export default interface IListElevatorsInBuildingDTO {
    elevatorId: number,
    elevatorIdentificationNumber: number
    elevatorBrand: string
    elevatorDescription: string
    elevatorModel: string
    elevatorSerialNumber: string
    floorsNumber: number[]
}