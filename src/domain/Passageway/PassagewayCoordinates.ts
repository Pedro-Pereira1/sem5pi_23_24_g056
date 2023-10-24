import { ValueObject } from '../../core/domain/ValueObject';

interface PassagewayCoordinatesProps {
  topX: number;
  topY: number;
  bottonX: number;
  bottonY: number;
}

export class PassagewayCoordinates extends ValueObject<PassagewayCoordinatesProps> {

  constructor(props: PassagewayCoordinatesProps) {
    super(props);
  }

}
