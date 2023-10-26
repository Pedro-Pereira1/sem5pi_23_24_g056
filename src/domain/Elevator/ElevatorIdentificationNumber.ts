import { ValueObject } from '../../core/domain/ValueObject';
import { Guard } from '../../core/logic/Guard';
import { Result } from '../../core/logic/Result';

interface ElevatorIdentificationNumberProps {
  identificationNumber: number;
}

export class ElevatorIdentificationNumber extends ValueObject<ElevatorIdentificationNumberProps> {

  constructor(props: ElevatorIdentificationNumberProps) {
    super(props);
  }

  get identificationNumber(): number {
    return this.props.identificationNumber
  }

  public static create (elevatorIdentificationNumber: number): Result<ElevatorIdentificationNumber> {
    const guardResult = Guard.againstNullOrUndefined(elevatorIdentificationNumber, 'identificationNUmber');
    if (!guardResult.succeeded) {
      return Result.fail<ElevatorIdentificationNumber>(guardResult.message);
    }

    if (elevatorIdentificationNumber <= 0) {
      return Result.fail<ElevatorIdentificationNumber>('Elevator Identification Number must be a positive number');
    }

      return Result.ok<ElevatorIdentificationNumber>(new ElevatorIdentificationNumber({ identificationNumber: elevatorIdentificationNumber }))
  }
}