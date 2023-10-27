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
    const passagewayCoordinatesTopXB2 = passagewayDTO.passagewayCoordinatesTopXB2
    const passagewayCoordinatesTopYB2 = passagewayDTO.passagewayCoordinatesTopYB2
    const passagewayCoordinatesBottomXB2 = passagewayDTO.passagewayCoordinatesBottomXB2
    const passagewayCoordinatesBottomYB2 = passagewayDTO.passagewayCoordinatesBottomYB2

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
