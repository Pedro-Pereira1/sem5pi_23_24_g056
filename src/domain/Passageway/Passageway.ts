import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { PassagewayCoordinates } from './PassagewayCoordinates';
import { PassagewayID } from './PassagewayID';
import { IPassagewayDTO } from '../../dto/passageway/IPassagewayDTO'
import { Result } from '../../core/logic/Result';

interface PassagewayProps {
  passagewayCoordinates: PassagewayCoordinates;
}

export class Passageway extends AggregateRoot<PassagewayProps> {

  constructor(props: PassagewayProps, id: PassagewayID) {
    super(props, id);
  }

  get coordinates(): PassagewayCoordinates {
    return this.props.passagewayCoordinates
  }


  public static create(passagewayDTO: IPassagewayDTO): Result<Passageway> {
    const passagewayId = passagewayDTO.passagewayId
    const passagewayCoordinatesTopX = passagewayDTO.passagewayCoordinatesTopX
    const passagewayCoordinatesTopY = passagewayDTO.passagewayCoordinatesTopY
    const passagewayCoordinatesBottomX = passagewayDTO.passagewayCoordinatesBottomX
    const passagewayCoordinatesBottomY = passagewayDTO.passagewayCoordinatesBottomY
    const passagewayCoordinatesTopXB2 = passagewayDTO.passagewayCoordinatesTopX
    const passagewayCoordinatesTopYB2 = passagewayDTO.passagewayCoordinatesTopY
    const passagewayCoordinatesBottomXB2 = passagewayDTO.passagewayCoordinatesBottomX
    const passagewayCoordinatesBottomYB2 = passagewayDTO.passagewayCoordinatesBottomY

    const passagewayCoordinates = PassagewayCoordinates.create({
      topX: passagewayCoordinatesTopX,
      topY: passagewayCoordinatesTopY,
      bottomX: passagewayCoordinatesBottomX,
      bottomY: passagewayCoordinatesBottomY,
      topXB2: passagewayCoordinatesTopXB2,
      topYB2: passagewayCoordinatesTopYB2,
      bottomXB2: passagewayCoordinatesBottomXB2,
      bottomYB2: passagewayCoordinatesBottomYB2,
    });

    if (passagewayCoordinates.isFailure) {
      return Result.fail<Passageway>(passagewayCoordinates.error);
    }

    const passageway = new Passageway({
      passagewayCoordinates: passagewayCoordinates.getValue(),
    }, new PassagewayID(passagewayId))

    return Result.ok<Passageway>(passageway)
  }
}
