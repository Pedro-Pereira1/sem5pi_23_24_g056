import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { Result } from '../../core/logic/Result';
import { ElevatorIdentificationNumber } from './ElevatorIdentificationNumber';
import { ElevatorBrand } from './ElevatorBrand';
import { ElevatorDescription } from './ElevatorDescription';
import { ElevatorModel } from './ElevatorModel';
import { ElevatorSerialNumber } from './ElevatorSerialNumber';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Guard } from "../../core/logic/Guard";
import {ElevatorID} from "./ElevatorID";

interface ElevatorProps {
  elevatorIdentificationNumber: ElevatorIdentificationNumber,
  elevatorBrand: ElevatorBrand,
  elevatorDescription: ElevatorDescription,
  elevatorModel: ElevatorModel,
  elevatorSerialNumber: ElevatorSerialNumber
}

export class Elevator extends AggregateRoot<ElevatorProps> {

  constructor(props: ElevatorProps, id: ElevatorID) {
    super(props, id);
  }

  get id (): UniqueEntityID {
    return this._id
  }

  get elevatorIdentificationNumber(): ElevatorIdentificationNumber {
    return this.props.elevatorIdentificationNumber
  }

  get elevatorBrand(): ElevatorBrand {
    return this.props.elevatorBrand
  }

  get elevatorDescription(): ElevatorDescription {
    return this.props.elevatorDescription
  }

  get elevatorModel(): ElevatorModel {
    return this.props.elevatorModel
  }

  get elevatorSerialNumber(): ElevatorSerialNumber {
    return this.props.elevatorSerialNumber
  }

  set elevatorIdentificationNumber(value: ElevatorIdentificationNumber) {
    this.props.elevatorIdentificationNumber = value;
  }

  set elevatorBrand(value: ElevatorBrand) {
    this.props.elevatorBrand = value;
  }

  set elevatorDescription(value: ElevatorDescription) {
    this.props.elevatorDescription = value;
  }

  set elevatorModel(value: ElevatorModel) {
    this.props.elevatorModel = value;
  }

  set elevatorSerialNumber(value: ElevatorSerialNumber) {
    this.props.elevatorSerialNumber = value;
  }

  public static create(elevatorProps: ElevatorProps, id: ElevatorID): Result<Elevator> {

    const guardedProps = [
      { argument: id, argumentName: 'elevatorId' },
      { argument: elevatorProps.elevatorIdentificationNumber, argumentName: 'identificationNumber' },
      { argument: elevatorProps.elevatorBrand, argumentName: 'brand' },
      { argument: elevatorProps.elevatorDescription, argumentName: 'description' },
      { argument: elevatorProps.elevatorModel, argumentName: 'model' },
      { argument: elevatorProps.elevatorSerialNumber, argumentName: 'serialNumber' },
    ];

    const guardResults = Guard.againstNullOrUndefinedBulk(guardedProps);

    if(!guardResults.succeeded){
      return Result.fail<Elevator>(guardResults.message);
    }else{
      const elevator = new Elevator({
        ...elevatorProps
      },id)
      return Result.ok<Elevator>(elevator);
    }
  }

}

