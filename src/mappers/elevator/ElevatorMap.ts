import { Model, Document } from "mongoose"
import { Mapper } from "../../core/infra/Mapper"
import { Elevator } from "../../domain/Elevator/Elevator"
import IElevatorDTO from "../../dto/elevator/IElevatorDTO"
import IElevatorPersistence from "../../dataschema/elevator/IElevatorPersistence"
import { ElevatorIdentificationNumber } from "../../domain/Elevator/ElevatorIdentificationNumber"
import { ElevatorBrand } from "../../domain/Elevator/ElevatorBrand"
import { ElevatorDescription } from "../../domain/Elevator/ElevatorDescription"
import { ElevatorModel } from "../../domain/Elevator/ElevatorModel"
import { ElevatorSerialNumber } from "../../domain/Elevator/ElevatorSerialNumber"
import { ElevatorID } from "../../domain/Elevator/ElevatorID"
import IListElevatorsInBuildingDTO from "../../dto/elevator/IListElevatorsInBuildingDTO"
import IListAllElevatorsDTO from "../../dto/elevator/IListAllElevatorsDTO";

export default class ElevatorMap extends Mapper<Elevator> {

    public static toDto(elevator: Elevator): IElevatorDTO {
        return {
            elevatorId: elevator.id.toValue(),
            elevatorIdentificationNumber: elevator.props.elevatorIdentificationNumber.identificationNumber,
            elevatorBrand: elevator.props.elevatorBrand.brand,
            elevatorDescription: elevator.props.elevatorDescription.description,
            elevatorModel: elevator.props.elevatorModel.model,
            elevatorSerialNumber: elevator.props.elevatorSerialNumber.serialNumber
        } as IElevatorDTO
    }

    public static toDtoList(elevator: Elevator, floorsNumber: number[]): IListElevatorsInBuildingDTO {
        return {
            elevatorId: elevator.id.toValue(),
            elevatorIdentificationNumber: elevator.props.elevatorIdentificationNumber.identificationNumber,
            elevatorBrand: elevator.props.elevatorBrand.brand,
            elevatorDescription: elevator.props.elevatorDescription.description,
            elevatorModel: elevator.props.elevatorModel.model,
            elevatorSerialNumber: elevator.props.elevatorSerialNumber.serialNumber,
            floorsNumber: floorsNumber
        } as IListElevatorsInBuildingDTO
    }

    public static toDomain(elevatorDto: any | Model<IElevatorPersistence & Document>): Elevator {
        const elevatorOrError = Elevator.create(
            {
                elevatorIdentificationNumber: ElevatorIdentificationNumber.create(elevatorDto.elevatorIdentificationNumber).getValue(),
                elevatorBrand: ElevatorBrand.create(elevatorDto.elevatorBrand).getValue(),
                elevatorDescription: ElevatorDescription.create(elevatorDto.elevatorDescription).getValue(),
                elevatorModel: ElevatorModel.create(elevatorDto.elevatorModel).getValue(),
                elevatorSerialNumber: ElevatorSerialNumber.create(elevatorDto.elevatorSerialNumber).getValue()
            }, ElevatorID.create(elevatorDto.elevatorId).getValue())

        return elevatorOrError.isSuccess ? elevatorOrError.getValue() : null
    }

    public static toPersistence(elevator: Elevator): any {
        return {
            elevatorId: elevator.id.toValue(),
            elevatorIdentificationNumber: elevator.props.elevatorIdentificationNumber.identificationNumber,
            elevatorBrand: elevator.props.elevatorBrand.brand,
            elevatorDescription: elevator.props.elevatorDescription.description,
            elevatorModel: elevator.props.elevatorModel.model,
            elevatorSerialNumber: elevator.props.elevatorSerialNumber.serialNumber
        }
    }

    public static toDtoListAll(elevator: Elevator, floors: number[], buildingCode: string): IListAllElevatorsDTO {
        return {
            elevatorId: Number(elevator.id.toValue()),
            floorsId: floors,
            buildingCode: buildingCode
        } as IListAllElevatorsDTO
    }
}