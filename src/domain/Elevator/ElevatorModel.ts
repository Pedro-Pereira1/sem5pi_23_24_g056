import e from 'express';
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

  public static create(elevatorModel: string): Result<ElevatorModel> {
    const guardResult = Guard.againstNullOrUndefined(elevatorModel, 'model');
    let strRegex = new RegExp(/^[a-z0-9 ]+$/i);

    if (guardResult.succeeded) {
      if (!strRegex.test(elevatorModel)) {
        return Result.fail<ElevatorModel>('Model must be alphanumeric');
      }

      if (elevatorModel.length > 50) {
        return Result.fail<ElevatorModel>('Elevator model must be shorter than 50 words');
      }
    }
    
    return Result.ok<ElevatorModel>(new ElevatorModel({ model: elevatorModel }))
  }
}