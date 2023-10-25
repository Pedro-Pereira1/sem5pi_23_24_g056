import { ValueObject } from '../../core/domain/ValueObject';

interface ElevatorIdentificationNumberProps {
  idNumber: number;
}

export class ElevatorIdentificationNumber extends ValueObject<ElevatorIdentificationNumberProps> {

  constructor(props: ElevatorIdentificationNumberProps) {
    super(props);
  }

  get identificationNumber(): number {
    return this.props.idNumber
  }
}