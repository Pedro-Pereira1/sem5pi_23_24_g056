import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { PassagewayCoordinates } from './PassagewayCoordinates';
import { PassagewayID } from './PassagewayID';
import { IPassagewayDTO } from '../../dto/passageway/IPassagewayDTO'
import { Result } from '../../core/logic/Result';
import { ICreatePassagewayDTO } from '../../dto/passageway/ICreatePassagewayDTO';

interface PassagewayProps {

}

export class Passageway extends AggregateRoot<PassagewayProps> {

  constructor(props: PassagewayProps, id: PassagewayID) {
    super(props, id);
  }

  public static create(passagewayDTO: ICreatePassagewayDTO): Result<Passageway> {
    const passageway = new Passageway({}, new PassagewayID(passagewayDTO.passagewayId))

    return Result.ok<Passageway>(passageway)
  }
}
