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

  public static create(elevatorDescription: string): Result<ElevatorDescription> {
    const guardResult = Guard.againstNullOrUndefined(elevatorDescription, 'description');
    let strRegex = new RegExp(/^[a-z0-9 ]+$/i);

    if (guardResult.succeeded) {
      if (!strRegex.test(elevatorDescription)) {
        return Result.fail<ElevatorDescription>('Description must be alphanumeric');
      }

      if (elevatorDescription.length > 250) {
        return Result.fail<ElevatorDescription>('Elevator description must be shorter than 250 words');
      }
    }
    
    return Result.ok<ElevatorDescription>(new ElevatorDescription({ description: elevatorDescription }))
  }
}