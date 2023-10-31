import { Model, Document } from "mongoose"
import { Mapper } from "../../core/infra/Mapper"
import { Elevator } from "../../domain/Elevator/Elevator"
import IElevatorDTO from "../../dto/elevator/IElevatorDTO"
import IElevatorPersistence from "../../dataschema/elevator/IElevatorPersistence"

export default class ElevatorMap extends Mapper<Elevator> {

    public static toDto(elevator: Elevator): IElevatorDTO {
        return {
            elevatorCoordinateX: elevator.props.elevatorCoordinateX.x,
            elevatorCoordinateY: elevator.props.elevatorCoordinateY.y,
            elevatorIdentificationNumber: elevator.props.elevatorIdentificationNumber.identificationNumber,
            elevatorBrand: elevator.props.elevatorBrand.brand,
            elevatorDescription: elevator.props.elevatorDescription.description,
            elevatorModel: elevator.props.elevatorModel.model,
            elevatorSerialNumber: elevator.props.elevatorSerialNumber.serialNumber
        } as IElevatorDTO
    }

    public static toDomain(elevatorDto: any | Model<IElevatorPersistence & Document>): Elevator {
        const elevatorOrError = Elevator.create(elevatorDto)

        return elevatorOrError.isSuccess ? elevatorOrError.getValue() : null
    }

    public static toPersistence(elevator: Elevator): any {
        return {
            elevatorId: elevator.id.toValue(),
            elevatorCoordinateX: elevator.props.elevatorCoordinateX.x,
            elevatorCoordinateY: elevator.props.elevatorCoordinateY.y,
            elevatorIdentificationNumber: elevator.props.elevatorIdentificationNumber.identificationNumber,
            elevatorBrand: elevator.props.elevatorBrand.brand,
            elevatorDescription: elevator.props.elevatorDescription.description,
            elevatorModel: elevator.props.elevatorModel.model,
            elevatorSerialNumber: elevator.props.elevatorSerialNumber.serialNumber
        }
    }
}