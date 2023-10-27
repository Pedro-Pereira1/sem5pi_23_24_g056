import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';

interface PassagewayCoordinatesProps {
  topX: number;
  topY: number;
  bottomX: number;
  bottomY: number;
  topXB2: number;
  topYB2: number;
  bottomXB2: number;
  bottomYB2: number;
}

export class PassagewayCoordinates extends ValueObject<PassagewayCoordinatesProps> {

  constructor(props: PassagewayCoordinatesProps) {
    super(props);
  }

  public static create(props: PassagewayCoordinatesProps): Result<PassagewayCoordinates> {
    if (props.topX < 0 || props.topY < 0 || props.bottomX < 0 || props.bottomY < 0 || props.topXB2 < 0 || props.topYB2 < 0 || props.bottomXB2 < 0 || props.bottomYB2 < 0) {
      return Result.fail<PassagewayCoordinates>('Coordinates cannot be negative.');
    }

    return Result.ok<PassagewayCoordinates>(new PassagewayCoordinates(props));
  }

}
