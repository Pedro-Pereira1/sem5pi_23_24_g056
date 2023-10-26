import { ValueObject } from '../../core/domain/ValueObject';
import { Guard } from '../../core/logic/Guard';
import { Result } from '../../core/logic/Result';

interface ElevatorCoordinateYProps {
    elevatorCoordinateY: number;
}

export class ElevatorCoordinateY extends ValueObject<ElevatorCoordinateYProps> {
  constructor(props: ElevatorCoordinateYProps) {
    super(props);
  }

  get y(): number {
    return this.props.elevatorCoordinateY
  }

  public static create (elevatorCoordinateY: number, buildingLines: number): Result<ElevatorCoordinateY> {
    const guardResult = Guard.againstNullOrUndefined(elevatorCoordinateY, 'elevatorCoordinateY');
    const maxPos = buildingLines +1;
    if (!guardResult.succeeded) {
      return Result.fail<ElevatorCoordinateY>(guardResult.message);
    } 
    
    if (elevatorCoordinateY <= 0) {
      return Result.fail<ElevatorCoordinateY>('Elevator Position Y must be a positive number');
    }

    if (elevatorCoordinateY > maxPos) {
      return Result.fail<ElevatorCoordinateY>('Elevator Position Y must be lower than ' + maxPos);
    }

      return Result.ok<ElevatorCoordinateY>(new ElevatorCoordinateY({elevatorCoordinateY : elevatorCoordinateY}))
  }
}