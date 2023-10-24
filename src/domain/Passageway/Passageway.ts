import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { PassagewayCoordinates } from './PassagewayCoordinates';
import { PassagewayID } from './PassagewayID';

interface PassagewayProps {
  passagewayCoordinates: PassagewayCoordinates;
}

export class Passageway extends AggregateRoot<PassagewayProps> {

  constructor(props: PassagewayProps, id: PassagewayID) {
    super(props, id);
  }

}
