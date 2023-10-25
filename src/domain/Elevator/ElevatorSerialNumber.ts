import { ValueObject } from '../../core/domain/ValueObject';

interface ElevatorSerialNumberProps {
  serialNumber: string;
}

export class ElevatorSerialNumber extends ValueObject<ElevatorSerialNumberProps> {

  constructor(props: ElevatorSerialNumberProps) {
    super(props);
  }

  get serialNumber(): string {
    return this.props.serialNumber
  }
}