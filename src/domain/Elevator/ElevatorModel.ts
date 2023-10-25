import { ValueObject } from '../../core/domain/ValueObject';

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
}