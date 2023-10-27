import { ValueObject } from '../../core/domain/ValueObject';
import { Guard } from '../../core/logic/Guard';
import { Result } from '../../core/logic/Result';

interface ElevatorDescriptionProps {
  description: string;
}

export class ElevatorDescription extends ValueObject<ElevatorDescriptionProps> {

  constructor(props: ElevatorDescriptionProps) {
    super(props);
  }

  get description(): string {
    return this.props.description
  }

  public static create (elevatorDescription: string): Result<ElevatorDescription> {
    const guardResult = Guard.againstNullOrUndefined(elevatorDescription, 'description');
    if (!guardResult.succeeded) {
      return Result.fail<ElevatorDescription>(guardResult.message);
    }

    if(elevatorDescription.length>255){
      return Result.fail<ElevatorDescription>('Elevator description must be shorter than 255 words');
    }

      return Result.ok<ElevatorDescription>(new ElevatorDescription({ description: elevatorDescription }))
  }
}