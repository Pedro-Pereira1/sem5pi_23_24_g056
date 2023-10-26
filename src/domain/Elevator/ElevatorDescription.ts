import { ValueObject } from '../../core/domain/ValueObject';
import { Guard } from '../../core/logic/Guard';
import { Result } from '../../core/logic/Result';

interface ElevatorDescriptionProps {
  description: string;
}

export class ElevatorDescription extends ValueObject<ElevatorDescriptionProps> {

  private constructor(props: ElevatorDescriptionProps) {
    super(props);
  }

  get description(): string {
    return this.props.description
  }

  public static create (description: string): Result<ElevatorDescription> {
    const guardResult = Guard.againstNullOrUndefined(description, 'description');
    if (!guardResult.succeeded) {
      return Result.fail<ElevatorDescription>(guardResult.message);
    } else {
      return Result.ok<ElevatorDescription>(new ElevatorDescription({ description: description }))
    }
  }
}