import { ValueObject } from '../../core/domain/ValueObject';
import { Guard } from '../../core/logic/Guard';
import { Result } from '../../core/logic/Result';

interface ElevatorSerialNumberProps {
  serialNumber: string;
}

export class ElevatorSerialNumber extends ValueObject<ElevatorSerialNumberProps> {

  constructor(props: ElevatorSerialNumberProps) {
    super(props);
  }

  get serialNumber(): string {
    return this.props.serialNumber
  }

  public static create (elevatorSerialNumber: string): Result<ElevatorSerialNumber> {
    const guardResult = Guard.againstNullOrUndefined(elevatorSerialNumber, 'serialNumber');
    if (!guardResult.succeeded) {
      return Result.fail<ElevatorSerialNumber>(guardResult.message);
    }

    if(elevatorSerialNumber === undefined){
      return Result.ok<ElevatorSerialNumber>(new ElevatorSerialNumber({ serialNumber: '' }))
    }

    if(elevatorSerialNumber.length>50){
      return Result.fail<ElevatorSerialNumber>(guardResult.message);
    }

      return Result.ok<ElevatorSerialNumber>(new ElevatorSerialNumber({ serialNumber: elevatorSerialNumber }))
    
  }
}