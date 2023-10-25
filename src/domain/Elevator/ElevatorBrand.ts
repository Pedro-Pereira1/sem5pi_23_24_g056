import { ValueObject } from '../../core/domain/ValueObject';

interface ElevatorBrandProps {
  brand: string;
}

export class ElevatorBrand extends ValueObject<ElevatorBrandProps> {

  constructor(props: ElevatorBrandProps) {
    super(props);
  }

  get brand(): string {
    return this.props.brand
  }
}