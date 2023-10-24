import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';

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

  public static create(props: PassagewayCoordinatesProps): Result<PassagewayCoordinates> {
    if (props.topX < 0 || props.topY < 0 || props.bottonX < 0 || props.bottonY < 0) {
      return Result.fail<PassagewayCoordinates>('Coordinates cannot be negative.');
    }

    return Result.ok<PassagewayCoordinates>(new PassagewayCoordinates(props));
  }

}
