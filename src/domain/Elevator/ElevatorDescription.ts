import { ValueObject } from '../../core/domain/ValueObject';

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
}