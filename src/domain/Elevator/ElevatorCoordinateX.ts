import { ValueObject } from '../../core/domain/ValueObject';
import { Guard } from '../../core/logic/Guard';
import { Result } from '../../core/logic/Result';

interface ElevatorCoordinateXProps {
    elevatorCoordinateX: number;
}

export class ElevatorCoordinateX extends ValueObject<ElevatorCoordinateXProps> {

  constructor(props: ElevatorCoordinateXProps) {
    super(props);
  }

  get x(): number {
    return this.props.elevatorCoordinateX
  }

  public static create (elevatorCoordinateX: number): Result<ElevatorCoordinateX> {
    const guardResult = Guard.againstNullOrUndefined(elevatorCoordinateX, 'elevatorCoordinateX');
    if (!guardResult.succeeded) {
      return Result.fail<ElevatorCoordinateX>(guardResult.message);
    } else {
      return Result.ok<ElevatorCoordinateX>(new ElevatorCoordinateX({elevatorCoordinateX : elevatorCoordinateX}))
    }
  }
}