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

    const passagewayCoordinates = PassagewayCoordinates.create({
      topX: passagewayCoordinatesTopX,
      topY: passagewayCoordinatesTopY,
      bottonX: passagewayCoordinatesBottomX,
      bottonY: passagewayCoordinatesBottomY,
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
