import { ValueObject } from '../../core/domain/ValueObject';


interface FloorDescriptionProps {
  value: string;
}

export class FloorDescription extends ValueObject<FloorDescriptionProps> {

  constructor(props: FloorDescriptionProps) {
    super(props);
  }

  get description(): string {
    return this.props.value
  }

}
