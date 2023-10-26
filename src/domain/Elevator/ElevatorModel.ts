import { ValueObject } from '../../core/domain/ValueObject';
import { Guard } from '../../core/logic/Guard';
import { Result } from '../../core/logic/Result';

interface ElevatorModelProps {
  model: string;
}

export class ElevatorModel extends ValueObject<ElevatorModelProps> {

  constructor(props: ElevatorModelProps) {
    super(props);
  }

  get model(): string {
    return this.props.model
  }

  public static create (model: string): Result<ElevatorModel> {
    const guardResult = Guard.againstNullOrUndefined(model, 'model');
    if (!guardResult.succeeded) {
      return Result.fail<ElevatorModel>(guardResult.message);
    } else {
      return Result.ok<ElevatorModel>(new ElevatorModel({ model: model }))
    }
  }
}