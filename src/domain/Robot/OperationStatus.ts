import { initial } from 'lodash';
import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';


interface OperationStatusProps {
  status: boolean;
}

export class OperationStatus extends ValueObject<OperationStatusProps> {

  private constructor(props: OperationStatusProps) {
    super(props);
  }

  get status(): boolean {
    return this.props.status;
  }

  public static create(): Result<OperationStatus> {
    return Result.ok<OperationStatus>(new OperationStatus({ status: true }));
  }
}
